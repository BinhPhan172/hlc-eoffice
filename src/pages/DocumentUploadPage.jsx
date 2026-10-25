import { useState } from "react"
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom"

function DocumentUploadPage() {
  const navigate = useNavigate()

  const [
    searchParams,
  ] = useSearchParams()

  const defaultCategories = [
    {
      id: "DOC-CAT-001",
      name: "Quy chế",
    },
    {
      id: "DOC-CAT-002",
      name: "Hướng dẫn",
    },
    {
      id: "DOC-CAT-003",
      name: "Biên bản",
    },
    {
      id: "DOC-CAT-004",
      name: "Khác",
    },
  ]

  const defaultFolders = [
    {
      id: "FOL-0001",
      name:
        "Dự án Nhà ở Đường A",
      scope:
        "Phòng ban",
      description:
        "Lưu trữ hồ sơ, biên bản và tài liệu liên quan đến Dự án Nhà ở Đường A.",
      createdBy:
        "Nguyễn Văn A",
    },
    {
      id: "FOL-0002",
      name:
        "Dự án Khu dân cư B",
      scope:
        "Phòng ban",
      description:
        "Tài liệu nội bộ liên quan đến Dự án Khu dân cư B.",
      createdBy:
        "Nguyễn Văn A",
    },
    {
      id: "FOL-0003",
      name:
        "Văn bản dùng chung",
      scope:
        "Dùng chung",
      description:
        "Thư mục văn bản và tài liệu dùng chung toàn công ty.",
      createdBy:
        "Nguyễn Văn A",
    },
  ]

  const savedCategories =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentCategories"
      )
    )

  const categories =
    savedCategories !== null
      ? savedCategories
      : defaultCategories

  const savedFolders =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentFolders"
      )
    ) || []

  const folders = [
    ...defaultFolders,
    ...savedFolders,
  ]

  const currentUser =
    localStorage.getItem(
      "hlcDocumentPrototypeUser"
    ) ||
    "Nguyễn Văn A"

  const initialFolderId =
    searchParams.get(
      "folder"
    ) || ""

  const initialFolder =
    folders.find(
      (folder) =>
        folder.id ===
        initialFolderId
    )

  const [name, setName] =
    useState("")

  const [category, setCategory] =
    useState("")

  const [
    documentScope,
    setDocumentScope,
  ] = useState(
    initialFolder?.scope ||
      "Phòng ban"
  )

  const [
    selectedFolderId,
    setSelectedFolderId,
  ] = useState(
    initialFolderId
  )

  const [
    description,
    setDescription,
  ] = useState("")

  const [file, setFile] =
    useState(null)

  const [error, setError] =
    useState("")

  const [
    uploading,
    setUploading,
  ] = useState(false)

  const availableFolders =
    folders.filter(
      (folder) =>
        folder.scope ===
        documentScope
    )

  const selectedFolder =
    folders.find(
      (folder) =>
        folder.id ===
        selectedFolderId
    ) || null

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

  const generateDocumentId = (
    savedDocuments
  ) => {
    const numbers =
      savedDocuments
        .map((item) => {
          const match =
            item.id?.match(
              /^TL-(\d+)$/
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

    const highest =
      Math.max(
        3,
        ...numbers
      )

    return `TL-${String(
      highest + 1
    ).padStart(4, "0")}`
  }

  const handleScopeChange = (
    event
  ) => {
    const newScope =
      event.target.value

    setDocumentScope(
      newScope
    )

    const currentFolder =
      folders.find(
        (folder) =>
          folder.id ===
          selectedFolderId
      )

    if (
      currentFolder &&
      currentFolder.scope !==
        newScope
    ) {
      setSelectedFolderId(
        ""
      )
    }
  }

  const handleFolderChange = (
    event
  ) => {
    const folderId =
      event.target.value

    setSelectedFolderId(
      folderId
    )

    const folder =
      folders.find(
        (item) =>
          item.id ===
          folderId
      )

    if (folder) {
      setDocumentScope(
        folder.scope
      )
    }
  }

  const handleUpload =
    async () => {
      if (
        !name.trim() ||
        !category ||
        !documentScope ||
        !file
      ) {
        setError(
          "Vui lòng nhập tên tài liệu, chọn loại tài liệu, phạm vi tài liệu và chọn file."
        )
        return
      }

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
          await readFileAsDataUrl(
            file
          )

        const savedDocuments =
          JSON.parse(
            localStorage.getItem(
              "hlcDocuments"
            )
          ) || []

        const newId =
          generateDocumentId(
            savedDocuments
          )

        const today =
          new Date().toLocaleDateString(
            "vi-VN"
          )

        const initialStatus =
          documentScope ===
          "Dùng chung"
            ? "Chờ tiếp nhận"
            : "Đã tiếp nhận"

        const folder =
          folders.find(
            (item) =>
              item.id ===
              selectedFolderId
          )

        const newDocument = {
          id: newId,

          name:
            name.trim(),

          category,

          documentScope,

          folderId:
            folder?.id ||
            "",

          folderName:
            folder?.name ||
            "",

          description:
            description.trim(),

          version:
            "v1.0",

          date:
            today,

          updatedAt:
            today,

          status:
            initialStatus,

          uploader:
            currentUser,

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

        navigate(
          `/documents/${newId}`
        )
      } catch (err) {
        console.error(err)

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
          navigate(
            "/documents"
          )
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Tải lên tài liệu
        </h1>

        <p>
          Thêm tài liệu mới vào HLC
          E-Office.
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

          <div className="detail-grid">
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

                {categories.map(
                  (item) => (
                    <option
                      key={
                        item.id
                      }
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
                  Chưa có danh mục tài
                  liệu. Vui lòng cấu
                  hình trong Thiết lập
                  hệ thống.
                </small>
              )}
            </div>

            <div className="form-group">
              <label>
                Phạm vi tài liệu *
              </label>

              <select
                value={
                  documentScope
                }
                onChange={
                  handleScopeChange
                }
              >
                <option value="Phòng ban">
                  Tài liệu phòng ban
                </option>

                <option value="Dùng chung">
                  Tài liệu dùng chung
                </option>
              </select>
            </div>
          </div>

          {/* FOLDER */}

          <div className="form-group">
            <label>
              Thư mục lưu trữ
            </label>

            <select
              value={
                selectedFolderId
              }
              onChange={
                handleFolderChange
              }
            >
              <option value="">
                Không chọn thư mục
              </option>

              {availableFolders.map(
                (folder) => (
                  <option
                    key={
                      folder.id
                    }
                    value={
                      folder.id
                    }
                  >
                    {folder.name}
                  </option>
                )
              )}
            </select>

            <small>
              Thư mục dùng để nhóm tài
              liệu theo dự án, công
              trình hoặc chủ đề.
            </small>
          </div>

          {selectedFolder && (
            <div className="settings-note">
              <strong>
                📁{" "}
                {
                  selectedFolder.name
                }
              </strong>

              <br />

              Phạm vi:{" "}
              {
                selectedFolder.scope
              }

              {selectedFolder.description && (
                <>
                  <br />
                  {
                    selectedFolder.description
                  }
                </>
              )}
            </div>
          )}

          {documentScope ===
          "Phòng ban" ? (
            <div className="settings-note">
              <strong>
                Tài liệu phòng ban:
              </strong>{" "}
              do phòng ban tự quản và
              không cần Văn thư tiếp
              nhận trong prototype.
            </div>
          ) : (
            <div className="settings-note">
              <strong>
                Tài liệu dùng chung:
              </strong>{" "}
              sau khi tải lên sẽ ở
              trạng thái{" "}
              <strong>
                Chờ tiếp nhận
              </strong>{" "}
              và cần Văn thư kiểm tra.
            </div>
          )}

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
                  e.target.files[0] ||
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
              Prototype hiện hỗ trợ
              lưu file tối đa 2 MB.
            </small>
          </div>

          <div className="detail-card">
            <h3>
              Vị trí lưu
            </h3>

            <p>
              Tài liệu
              {selectedFolder
                ? ` / ${selectedFolder.name}`
                : " / Không có thư mục"}
            </p>
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
              onClick={
                handleUpload
              }
              disabled={
                uploading ||
                categories.length ===
                  0
              }
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