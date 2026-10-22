import { useState } from "react"
import { useNavigate } from "react-router-dom"

function DocumentUploadPage() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)

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

  const handleUpload = async () => {
    if (
      !name.trim() ||
      !category ||
      !file
    ) {
      setError(
        "Vui lòng nhập tên tài liệu, chọn loại tài liệu và chọn file."
      )
      return
    }

    // Giới hạn riêng cho prototype dùng localStorage.
    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setError(
        "Prototype hiện chỉ lưu file tối đa 2 MB. Vui lòng chọn file nhỏ hơn."
      )
      return
    }

    setError("")
    setUploading(true)

    try {
      const fileData =
        await readFileAsDataUrl(file)

      const savedDocuments =
        JSON.parse(
          localStorage.getItem(
            "hlcDocuments"
          )
        ) || []

      const newId = `TL-${String(
        savedDocuments.length + 4
      ).padStart(4, "0")}`

      const today =
        new Date().toLocaleDateString(
          "vi-VN"
        )

      const newDocument = {
        id: newId,
        name: name.trim(),
        category,
        description:
          description.trim(),
        version: "v1.0",
        date: today,
        status:
          "Chờ tiếp nhận",
        uploader:
          "Nguyễn Văn A",
        fileName:
          file.name,
        fileSize: `${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB`,
        fileData,
        note: "",
      }

      localStorage.setItem(
        "hlcDocuments",
        JSON.stringify([
          ...savedDocuments,
          newDocument,
        ])
      )

      navigate("/documents")
    } catch (err) {
      setError(
        "Không thể lưu file. Vui lòng thử lại với file nhỏ hơn."
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate("/documents")
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Tải lên tài liệu
        </h1>

        <p>
          Thêm tài liệu mới vào
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
              Tên tài liệu *
            </label>

            <input
              type="text"
              placeholder="Nhập tên tài liệu"
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
              Loại tài liệu *
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
                Chọn loại tài liệu
              </option>

              <option value="Quy chế">
                Quy chế
              </option>

              <option value="Hướng dẫn">
                Hướng dẫn
              </option>

              <option value="Biên bản">
                Biên bản
              </option>

              <option value="Khác">
                Khác
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Mô tả
            </label>

            <textarea
              rows="4"
              placeholder="Nhập mô tả tài liệu..."
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
              File tài liệu *
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
                  "/documents"
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading
                ? "Đang tải..."
                : "Tải lên"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentUploadPage