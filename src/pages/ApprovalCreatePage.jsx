import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ApprovalCreatePage() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null)
  const [approver, setApprover] = useState("")
  const [error, setError] = useState("")

  const handleCreate = () => {
    if (!name || !file || !approver) {
      setError(
        "Vui lòng nhập tên hồ sơ, chọn tệp và người phê duyệt."
      )
      return
    }

    const savedApprovals =
      JSON.parse(
        localStorage.getItem("hlcApprovals")
      ) || []

    const newId = `TK-${String(
      savedApprovals.length + 4
    ).padStart(4, "0")}`

    const today =
      new Date().toLocaleDateString("vi-VN")

    const newApproval = {
      id: newId,
      name,
      description,
      creator: "Nguyễn Văn A",
      approver,
      fileName: file.name,
      fileSize:
        `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      updatedAt: today,
      status: "Chờ phê duyệt",
    }

    localStorage.setItem(
      "hlcApprovals",
      JSON.stringify([
        ...savedApprovals,
        newApproval,
      ])
    )

    navigate("/approval")
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
        <h1>Khởi tạo trình ký</h1>

        <p>
          Tạo hồ sơ mới và gửi vào luồng trình ký.
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
                setName(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>
              Nội dung / mô tả
            </label>

            <textarea
              rows="4"
              placeholder="Nhập nội dung trình ký..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>
              Tệp trình ký *
            </label>

            <input
              type="file"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
              }
            />

            {file && (
              <small>
                Đã chọn: {file.name}
              </small>
            )}
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

              <option value="Trần Thị B">
                Trần Thị B
              </option>

              <option value="Lê Văn C">
                Lê Văn C
              </option>

              <option value="Phạm Văn D">
                Phạm Văn D
              </option>
            </select>
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                navigate("/approval")
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={handleCreate}
            >
              Khởi tạo trình ký
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalCreatePage