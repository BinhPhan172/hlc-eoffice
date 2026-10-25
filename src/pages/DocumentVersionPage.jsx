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
      name: "Quy chế quản lý tài liệu nội bộ",
      version: "v1.0",
      documentScope: "Dùng chung",
      uploader: "Nguyễn Văn A",
      status: "Đã tiếp nhận",
    },
    {
      id: "TL-0002",
      name: "Hướng dẫn sử dụng hệ thống E-Office",
      version: "v2.1",
      documentScope: "Dùng chung",
      uploader: "Trần Thị B",
      status: "Đã tiếp nhận",
    },
    {
      id: "TL-0003",
      name: "Biên bản họp dự án tháng 10",
      version: "v1.0",
      documentScope: "Dùng chung",
      uploader: "Lê Văn C",
      status: "Chờ tiếp nhận",
    },
  ]

  const savedDocuments =
    JSON.parse(
      localStorage.getItem(
        "hlcDocuments"
      )
    ) || []

  const statusOverrides =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentStatus"
      )
    ) || {}

  const allDocuments = [
    ...defaultDocuments,
    ...savedDocuments,
  ].map((item) => ({
    ...item,
    documentScope:
      item.documentScope ||
      "Dùng chung",
  }))

  const document =
    allDocuments.find(
      (item) =>
        item.id === id
    )

  const currentUser =
    localStorage.getItem(
      "hlcDocumentPrototypeUser"
    ) ||
    document?.uploader ||
    "Nguyễn Văn A"

  const savedVersions =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentVersions"
      )
    ) || {}

  const documentVersions =
    savedVersions[id] || []

  const documentStatus =
    document
      ? statusOverrides[id] ||
        document.status
      : ""

  const normalizeVersionStatus = (
    version
  ) =>
    version.status ||
    "Đã tiếp nhận"

  const acceptedVersions =
    documentVersions.filter(
      (version) =>
        normalizeVersionStatus(
          version
        ) === "Đã tiếp nhận"
    )

  const currentActiveVersion =
    acceptedVersions.length > 0
      ? acceptedVersions[
          acceptedVersions.length - 1
        ].version
      : document?.version ||
        "v1.0"

  const latestCreatedVersion =
    documentVersions.length > 0
      ? documentVersions[
          documentVersions.length - 1
        ].version
      : document?.version ||
        "v1.0"

  const getNextVersion = (
    version
  ) => {
    const clean =
      version.replace(
        "v",
        ""
      )

    const parts =
      clean.split(".")

    const major =
      Number(parts[0]) || 1

    const minor =
      Number(parts[1]) || 0

    return `v${major}.${minor + 1}`
  }

  const nextVersion =
    getNextVersion(
      latestCreatedVersion
    )

  const [file, setFile] =
    useState(null)

  const [note, setNote] =
    useState("")

  const [error, setError] =
    useState("")

  const [
    uploading,
    setUploading,
  ] = useState(false)

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

  const isOwner =
    currentUser ===
    document.uploader

  const canUpdate =
    isOwner &&
    (
      document.documentScope ===
        "Phòng ban" ||
      documentStatus ===
        "Đã tiếp nhận"
    )

  const readFileAsDataUrl = (
    selectedFile
  ) =>
    new Promise(
      (resolve, reject) => {
        const reader =
          new FileReader()

        reader.onload = () =>
          resolve(
            reader.result
          )

        reader.onerror = () =>
          reject(
            new Error(
              "Không thể đọc file."
            )
          )

        reader.readAsDataURL(
          selectedFile
        )
      }
    )

  const handleUpdate =
    async () => {
      if (!canUpdate) {
        setError(
          "Bạn không có quyền cập nhật phiên bản tài liệu này."
        )
        return
      }

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

        const isCommonDocument =
          document.documentScope ===
          "Dùng chung"

        const newVersion = {
          version:
            nextVersion,

          updater:
            currentUser,

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

          status:
            isCommonDocument
              ? "Chờ tiếp nhận"
              : "Đã tiếp nhận",

          reviewedBy: "",

          reviewedAt: "",

          reviewNote: "",
        }

        current[id] = [
          ...oldVersions,
          newVersion,
        ]

        localStorage.setItem(
          "hlcDocumentVersions",
          JSON.stringify(
            current
          )
        )

        navigate(
          `/documents/${id}`
        )
      } catch (err) {
        console.error(err)

        setError(
          "Không thể lưu file phiên bản mới."
        )
      } finally {
        setUploading(false)
      }
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

      {!canUpdate && (
        <div className="reject-message">
          Bạn không có quyền cập nhật
          phiên bản tài liệu này.
        </div>
      )}

      <div className="detail-card">
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="version-info">
          <div>
            <span className="detail-label">
              Phiên bản hiện hành
            </span>

            <h3>
              {
                currentActiveVersion
              }
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

        {document.documentScope ===
        "Dùng chung" ? (
          <div className="settings-note">
            <strong>
              Tài liệu dùng chung:
            </strong>{" "}
            phiên bản mới sẽ ở trạng
            thái{" "}
            <strong>
              Chờ tiếp nhận
            </strong>
            . Phiên bản{" "}
            <strong>
              {currentActiveVersion}
            </strong>{" "}
            vẫn là bản hiện hành cho đến
            khi Văn thư tiếp nhận bản
            mới.
          </div>
        ) : (
          <div className="settings-note">
            <strong>
              Tài liệu phòng ban:
            </strong>{" "}
            phiên bản mới có hiệu lực
            ngay sau khi cập nhật.
          </div>
        )}

        <div className="upload-form">
          <div className="form-group">
            <label>
              File phiên bản mới *
            </label>

            <input
              type="file"
              disabled={!canUpdate}
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
              Prototype hiện hỗ trợ file
              tối đa 2 MB.
            </small>
          </div>

          <div className="form-group">
            <label>
              Ghi chú phiên bản
            </label>

            <textarea
              rows="4"
              disabled={!canUpdate}
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
              disabled={
                uploading ||
                !canUpdate
              }
              onClick={
                handleUpdate
              }
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