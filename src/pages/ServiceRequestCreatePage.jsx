import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ServiceRequestCreatePage() {
  const navigate = useNavigate()

  const defaultCategories = [
    {
      id: "CAT-001",
      name: "CNTT",
    },
    {
      id: "CAT-002",
      name: "Hành chính",
    },
    {
      id: "CAT-003",
      name: "Nhân sự",
    },
  ]

  const savedCategories =
    JSON.parse(
      localStorage.getItem(
        "hlcRequestCategories"
      )
    )

  const categories =
    savedCategories !== null
      ? savedCategories
      : defaultCategories

  const priorityOptions = [
    "Bình thường",
    "Cao",
    "Khẩn",
  ]

  const [title, setTitle] =
    useState("")

  const [category, setCategory] =
    useState("")

  const [priority, setPriority] =
    useState("Bình thường")

  const [
    description,
    setDescription,
  ] = useState("")

  const [file, setFile] =
    useState(null)

  const [error, setError] =
    useState("")

  const [saving, setSaving] =
    useState(false)

  const readFileAsDataUrl = (
    selectedFile
  ) => {
    return new Promise(
      (resolve, reject) => {
        const reader =
          new FileReader()

        reader.onload = () => {
          resolve(reader.result)
        }

        reader.onerror = () => {
          reject(
            new Error(
              "Không thể đọc file."
            )
          )
        }

        reader.readAsDataURL(
          selectedFile
        )
      }
    )
  }

  const generateRequestId = (
    savedRequests
  ) => {
    const numbers =
      savedRequests
        .map((item) => {
          const match =
            item.id?.match(
              /^SR-(\d+)$/
            )

          return match
            ? Number(match[1])
            : 0
        })
        .filter((number) =>
          Number.isFinite(
            number
          )
        )

    const highest = Math.max(
      3,
      ...numbers
    )

    return `SR-${String(
      highest + 1
    ).padStart(4, "0")}`
  }

  const handleCreate =
    async () => {
      if (
        !title.trim() ||
        !category ||
        !priority ||
        !description.trim()
      ) {
        setError(
          "Vui lòng nhập đầy đủ nội dung, danh mục, mức độ ưu tiên và mô tả yêu cầu."
        )

        return
      }

      if (
        file &&
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
        let fileData = ""
        let fileName = ""
        let fileSize = ""

        if (file) {
          fileData =
            await readFileAsDataUrl(
              file
            )

          fileName =
            file.name

          fileSize = `${(
            file.size /
            1024 /
            1024
          ).toFixed(2)} MB`
        }

        const savedRequests =
          JSON.parse(
            localStorage.getItem(
              "hlcServiceRequests"
            )
          ) || []

        const newId =
          generateRequestId(
            savedRequests
          )

        const newRequest = {
          id: newId,

          title:
            title.trim(),

          category,

          priority,

          requester:
            "Nguyễn Văn A",

          description:
            description.trim(),

          updatedAt:
            new Date().toLocaleDateString(
              "vi-VN"
            ),

          status:
            "Chờ tiếp nhận",

          handlerName: "",

          handlerDepartment:
            "",

          fileName,
          fileSize,
          fileData,
        }

        localStorage.setItem(
          "hlcServiceRequests",
          JSON.stringify([
            ...savedRequests,
            newRequest,
          ])
        )

        navigate(
          `/service-requests/${newId}`
        )
      } catch (err) {
        console.error(err)

        setError(
          "Không thể lưu yêu cầu. Vui lòng thử lại."
        )
      } finally {
        setSaving(false)
      }
    }

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            "/service-requests"
          )
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Tạo yêu cầu dịch vụ
        </h1>

        <p>
          Gửi yêu cầu dịch vụ nội bộ
          trên HLC E-Office.
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
              Nội dung yêu cầu *
            </label>

            <input
              type="text"
              placeholder="Ví dụ: Sửa bàn phím"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />
          </div>

          <div className="detail-grid">
            <div className="form-group">
              <label>
                Loại yêu cầu *
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Chọn loại yêu cầu
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={
                        item.name
                      }
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>

              {categories.length ===
                0 && (
                <small>
                  Chưa có danh mục yêu
                  cầu. Vui lòng cấu hình
                  trong Thiết lập hệ
                  thống.
                </small>
              )}
            </div>

            <div className="form-group">
              <label>
                Mức độ ưu tiên *
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value
                  )
                }
              >
                {priorityOptions.map(
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
          </div>

          <div className="form-group">
            <label>
              Mô tả yêu cầu *
            </label>

            <textarea
              rows="5"
              placeholder="Mô tả chi tiết nội dung cần hỗ trợ..."
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
              Tệp đính kèm
            </label>

            <input
              type="file"
              onChange={(e) =>
                setFile(
                  e.target
                    .files[0] ||
                    null
                )
              }
            />

            {file && (
              <small>
                Đã chọn:{" "}
                {file.name} -{" "}
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </small>
            )}

            <small>
              Không bắt buộc. Prototype
              hiện hỗ trợ lưu file tối
              đa 2 MB.
            </small>
          </div>

          <div className="settings-note">
            Sau khi gửi, yêu cầu sẽ ở
            trạng thái{" "}
            <strong>
              Chờ tiếp nhận
            </strong>{" "}
            để Điều phối viên kiểm tra
            và phân công người xử lý.
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                navigate(
                  "/service-requests"
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
              disabled={
                saving ||
                categories.length ===
                  0
              }
            >
              {saving
                ? "Đang gửi..."
                : "Gửi yêu cầu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceRequestCreatePage