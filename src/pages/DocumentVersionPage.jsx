import { useState } from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

function DocumentVersionPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const defaultDocuments = [
    {
      id: "TL-0001",
      name:
        "Quy chế quản lý tài liệu nội bộ",
      version: "v1.0",
    },
    {
      id: "TL-0002",
      name:
        "Hướng dẫn sử dụng hệ thống E-Office",
      version: "v2.1",
    },
    {
      id: "TL-0003",
      name:
        "Biên bản họp dự án tháng 10",
      version: "v1.0",
    },
  ]

  const savedDocuments =
    JSON.parse(
      localStorage.getItem(
        "hlcDocuments"
      )
    ) || []

  const allDocuments = [
    ...defaultDocuments,
    ...savedDocuments,
  ]

  const document =
    allDocuments.find(
      (item) =>
        item.id === id
    )

  const savedVersions =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentVersions"
      )
    ) || {}

  const documentVersions =
    savedVersions[id] || []

  const currentVersion =
    documentVersions.length > 0
      ? documentVersions[
          documentVersions.length -
            1
        ].version
      : document?.version ||
        "v1.0"

  const getNextVersion = (
    version
  ) => {
    const cleanVersion =
      version.replace(
        "v",
        ""
      )

    const parts =
      cleanVersion.split(".")

    const major =
      Number(parts[0]) || 1

    const minor =
      Number(parts[1]) || 0

    return `v${major}.${minor + 1}`
  }

  const nextVersion =
    getNextVersion(
      currentVersion
    )

  const [file, setFile] =
    useState(null)

  const [note, setNote] =
    useState("")

  const [error, setError] =
    useState("")

  const [uploading, setUploading] =
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

  const handleUpdate = async () => {
    if (!file) {
      setError(
        "Vui lòng chọn file phiên bản mới."
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
    setUploading(true)

    try {
      const fileData =
        await readFileAsDataUrl(
          file
        )

      const current =
        JSON.parse(
          localStorage.getItem(
            "hlcDocumentVersions"
          )
        ) || {}

      const oldVersions =
        current[id] || []

      const newVersion = {
        version:
          nextVersion,

        updater:
          "Nguyễn Văn A",

        date:
          new Date().toLocaleDateString(
            "vi-VN"
          ),

        fileName:
          file.name,

        fileSize: `${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB`,

        fileData,

        note:
          note.trim(),
      }

      current[id] = [
        ...oldVersions,
        newVersion,
      ]

      localStorage.setItem(
        "hlcDocumentVersions",
        JSON.stringify(current)
      )

      navigate(
        `/documents/${id}`
      )
    } catch (err) {
      setError(
        "Không thể lưu file. Vui lòng thử lại với file nhỏ hơn."
      )
    } finally {
      setUploading(false)
    }
  }

  if (!document) {
    return (
      <div>
        <h1>
          Không tìm thấy tài liệu
        </h1>

        <button
          onClick={() =>
            navigate(
              "/documents"
            )
          }
        >
          ← Quay lại
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            `/documents/${id}`
          )
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Cập nhật phiên bản
        </h1>

        <p>
          {document.name}
        </p>
      </div>

      <div className="detail-card">
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="version-info">
          <div>
            <span className="detail-label">
              Phiên bản hiện tại
            </span>

            <h3>
              {currentVersion}
            </h3>
          </div>

          <div>
            <span className="detail-label">
              Phiên bản mới
            </span>

            <h3>
              {nextVersion}
            </h3>
          </div>
        </div>

        <div className="upload-form">
          <div className="form-group">
            <label>
              File phiên bản mới *
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
              Prototype hiện hỗ trợ
              lưu file tối đa 2 MB.
            </small>
          </div>

          <div className="form-group">
            <label>
              Ghi chú phiên bản
            </label>

            <textarea
              rows="4"
              placeholder="Nhập nội dung thay đổi..."
              value={note}
              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                navigate(
                  `/documents/${id}`
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={
                handleUpdate
              }
              disabled={uploading}
            >
              {uploading
                ? "Đang cập nhật..."
                : "Cập nhật phiên bản"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentVersionPage