import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ApprovalCreatePage() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [approver, setApprover] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const approvers = [
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Văn D",
  ]

  const readFileAsDataUrl = (selectedFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        resolve(reader.result)
      }

      reader.onerror = () => {
        reject(
          new Error("Không thể đọc file.")
        )
      }

      reader.readAsDataURL(selectedFile)
    })
  }

  const generateApprovalId = (savedApprovals) => {
    const numbers = savedApprovals
      .map((item) => {
        const match = item.id?.match(/^TK-(\d+)$/)

        return match
          ? Number(match[1])
          : 0
      })
      .filter((number) =>
        Number.isFinite(number)
      )

    const highest = Math.max(
      3,
      ...numbers
    )

    return `TK-${String(
      highest + 1
    ).padStart(4, "0")}`
  }

  const handleCreate = async () => {
    if (
      !name.trim() ||
      !approver ||
      !file
    ) {
      setError(
        "Vui lòng nhập tên hồ sơ, chọn người phê duyệt và chọn file trình ký."
      )
      return
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setError(
        "Prototype hiện chỉ lưu file tối đa 2 MB."
      )
      return
    }

    setError("")
    setSaving(true)

    try {
      const fileData =
        await readFileAsDataUrl(file)

      const savedApprovals =
        JSON.parse(
          localStorage.getItem(
            "hlcApprovals"
          )
        ) || []

      const newId =
        generateApprovalId(
          savedApprovals
        )

      const newApproval = {
        id: newId,
        name: name.trim(),
        description:
          description.trim(),
        creator:
          "Nguyễn Văn A",
        approver,
        updatedAt:
          new Date().toLocaleDateString(
            "vi-VN"
          ),
        status:
          "Chờ phê duyệt",
        fileName:
          file.name,
        fileSize: `${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB`,
        fileData,
      }

      localStorage.setItem(
        "hlcApprovals",
        JSON.stringify([
          ...savedApprovals,
          newApproval,
        ])
      )

      navigate(
        `/approval/${newId}`
      )
    } catch (err) {
      setError(
        "Không thể lưu file. Vui lòng thử lại với file nhỏ hơn."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate("/approval")
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Khởi tạo trình ký
        </h1>

        <p>
          Tạo hồ sơ trình ký mới trên
          HLC E-Office.
        </p>
      </div>

      <div className="detail-card">
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="upload-form">
          <div className="form-group">
            <label>
              Tên hồ sơ *
            </label>

            <input
              type="text"
              placeholder="Nhập tên hồ sơ trình ký"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Nội dung trình ký
            </label>

            <textarea
              rows="5"
              placeholder="Nhập nội dung trình ký..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Người phê duyệt *
            </label>

            <select
              value={approver}
              onChange={(e) =>
                setApprover(
                  e.target.value
                )
              }
            >
              <option value="">
                Chọn người phê duyệt
              </option>

              {approvers.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-group">
            <label>
              File trình ký *
            </label>

            <input
              type="file"
              onChange={(e) =>
                setFile(
                  e.target.files[0] ||
                  null
                )
              }
            />

            {file && (
              <small>
                Đã chọn: {file.name} -{" "}
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </small>
            )}

            <small>
              Prototype hiện hỗ trợ
              lưu file tối đa 2 MB.
            </small>
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                navigate(
                  "/approval"
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={
                handleCreate
              }
              disabled={saving}
            >
              {saving
                ? "Đang tạo..."
                : "Khởi tạo trình ký"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalCreatePage