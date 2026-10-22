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

  const [title, setTitle] =
    useState("")

  const [category, setCategory] =
    useState("")

  const [
    description,
    setDescription,
  ] = useState("")

  const [file, setFile] =
    useState(null)

  const [error, setError] =
    useState("")

  const handleCreate = () => {
    if (
      !title.trim() ||
      !category ||
      !description.trim()
    ) {
      setError(
        "Vui lòng nhập đầy đủ nội dung yêu cầu, danh mục và mô tả."
      )

      return
    }

    const savedRequests =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequests"
        )
      ) || []

    const newId = `SR-${String(
      savedRequests.length + 4
    ).padStart(4, "0")}`

    const newRequest = {
      id: newId,

      title,

      category,

      description,

      requester:
        "Nguyễn Văn A",

      updatedAt:
        new Date().toLocaleDateString(
          "vi-VN"
        ),

      status:
        "Chờ tiếp nhận",

      fileName:
        file?.name || "",

      fileSize: file
        ? `${(
            file.size /
            1024 /
            1024
          ).toFixed(2)} MB`
        : "",
    }

    localStorage.setItem(
      "hlcServiceRequests",
      JSON.stringify([
        ...savedRequests,
        newRequest,
      ])
    )

    navigate(
      "/service-requests"
    )
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
          Tạo yêu cầu hỗ trợ nội bộ mới.
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
              placeholder="Nhập nội dung yêu cầu"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Danh mục *
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
                Chọn danh mục
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>

            {categories.length ===
              0 && (
              <small>
                Chưa có danh mục yêu cầu
                được cấu hình.
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              Mô tả chi tiết *
            </label>

            <textarea
              rows="5"
              placeholder="Mô tả chi tiết vấn đề hoặc nhu cầu..."
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
                  e.target.files[0]
                )
              }
            />

            {file && (
              <small>
                Đã chọn:{" "}
                {file.name}
              </small>
            )}
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
            >
              Tạo yêu cầu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceRequestCreatePage