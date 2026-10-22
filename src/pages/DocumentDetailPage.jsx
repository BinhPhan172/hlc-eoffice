import { useState } from "react"
import {
  useParams,
  useNavigate,
} from "react-router-dom"

function DocumentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const currentUser =
    "Nguyễn Văn A"

  const defaultDocuments = [
    {
      id: "TL-0001",
      name:
        "Quy chế quản lý tài liệu nội bộ",
      category: "Quy chế",
      version: "v1.0",
      date: "22/10/2026",
      status: "Đã tiếp nhận",
      uploader:
        "Nguyễn Văn A",
      fileName:
        "quy-che-quan-ly-tai-lieu.pdf",
      fileSize: "2.4 MB",
      description:
        "Quy chế quản lý và sử dụng tài liệu nội bộ.",
      note: "",
    },

    {
      id: "TL-0002",
      name:
        "Hướng dẫn sử dụng hệ thống E-Office",
      category:
        "Hướng dẫn",
      version: "v2.1",
      date: "21/10/2026",
      status: "Đã tiếp nhận",
      uploader:
        "Trần Thị B",
      fileName:
        "huong-dan-eoffice.pdf",
      fileSize: "4.1 MB",
      description:
        "Tài liệu hướng dẫn sử dụng hệ thống HLC E-Office.",
      note: "",
    },

    {
      id: "TL-0003",
      name:
        "Biên bản họp dự án tháng 10",
      category:
        "Biên bản",
      version: "v1.0",
      date: "20/10/2026",
      status: "Chờ tiếp nhận",
      uploader:
        "Lê Văn C",
      fileName:
        "bien-ban-hop-thang-10.pdf",
      fileSize: "1.8 MB",
      description:
        "Biên bản họp dự án trong tháng 10.",
      note: "",
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

  const savedVersions =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentVersions"
      )
    ) || {}

  const rejectReasons =
    JSON.parse(
      localStorage.getItem(
        "hlcRejectReasons"
      )
    ) || {}

  const storedComments =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentComments"
      )
    ) || {}

  const allDocuments = [
    ...defaultDocuments,
    ...savedDocuments,
  ]

  const foundDocument =
    allDocuments.find(
      (item) =>
        item.id === id
    )

  const [status, setStatus] =
    useState(
      foundDocument
        ? statusOverrides[id] ||
            foundDocument.status
        : ""
    )

  const [
    receiveComment,
    setReceiveComment,
  ] = useState("")

  const [
    rejectReason,
    setRejectReason,
  ] = useState("")

  const [comments, setComments] =
    useState(
      storedComments[id] || []
    )

  const [
    showAcceptForm,
    setShowAcceptForm,
  ] = useState(false)

  const [
    showRejectForm,
    setShowRejectForm,
  ] = useState(false)

  if (!foundDocument) {
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
          ← Quay lại danh sách
        </button>
      </div>
    )
  }

  const saveStatus = (
    newStatus
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcDocumentStatus"
        )
      ) || {}

    current[id] =
      newStatus

    localStorage.setItem(
      "hlcDocumentStatus",
      JSON.stringify(current)
    )

    setStatus(newStatus)
  }

  const saveComments = (
    newComments
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcDocumentComments"
        )
      ) || {}

    current[id] =
      newComments

    localStorage.setItem(
      "hlcDocumentComments",
      JSON.stringify(current)
    )

    setComments(newComments)
  }

  const handleAccept = () => {
    saveStatus(
      "Đã tiếp nhận"
    )

    const newComment = {
      author:
        currentUser,

      action:
        "Tiếp nhận",

      content:
        receiveComment.trim() ||
        "Đã tiếp nhận tài liệu.",

      date:
        new Date().toLocaleString(
          "vi-VN"
        ),
    }

    saveComments([
      ...comments,
      newComment,
    ])

    setReceiveComment("")
    setShowAcceptForm(false)
  }

  const handleReject = () => {
    if (
      !rejectReason.trim()
    ) {
      return
    }

    const currentReasons =
      JSON.parse(
        localStorage.getItem(
          "hlcRejectReasons"
        )
      ) || {}

    currentReasons[id] =
      rejectReason.trim()

    localStorage.setItem(
      "hlcRejectReasons",
      JSON.stringify(
        currentReasons
      )
    )

    saveStatus("Từ chối")

    const newComment = {
      author:
        currentUser,

      action:
        "Từ chối",

      content:
        rejectReason.trim(),

      date:
        new Date().toLocaleString(
          "vi-VN"
        ),
    }

    saveComments([
      ...comments,
      newComment,
    ])

    setRejectReason("")
    setShowRejectForm(false)
  }

  const getStatusClass = () => {
    if (
      status ===
      "Đã tiếp nhận"
    ) {
      return "status processing"
    }

    if (
      status ===
      "Từ chối"
    ) {
      return "status rejected"
    }

    return "status pending"
  }

  const baseVersion = {
    version:
      foundDocument.version ||
      "v1.0",

    updater:
      foundDocument.uploader ||
      currentUser,

    date:
      foundDocument.date,

    fileName:
      foundDocument.fileName,

    fileSize:
      foundDocument.fileSize,

    fileData:
      foundDocument.fileData ||
      "",

    note:
      foundDocument.note || "",
  }

  const extraVersions =
    savedVersions[id] || []

  const versionList = [
    baseVersion,
    ...extraVersions,
  ]

  const currentVersion =
    versionList[
      versionList.length - 1
    ]

  const handleDownload = (
    version
  ) => {
    if (!version.fileData) {
      window.alert(
        "File mẫu hoặc file cũ chưa có dữ liệu tải xuống. Hãy upload một tài liệu mới để test chức năng này."
      )
      return
    }

    const link =
      document.createElement("a")

    link.href =
      version.fileData

    link.download =
      version.fileName ||
      "tai-lieu"

    document.body.appendChild(
      link
    )

    link.click()

    document.body.removeChild(
      link
    )
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

      <div className="detail-header detail-header-actions">
        <div>
          <h1>
            Chi tiết tài liệu
          </h1>

          <p>
            Mã tài liệu:{" "}
            {foundDocument.id}
          </p>
        </div>

        <div className="detail-action-buttons">
          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                `/documents/${id}/share`
              )
            }
          >
            Chia sẻ
          </button>

          {status ===
            "Đã tiếp nhận" && (
            <button
              className="primary-button"
              onClick={() =>
                navigate(
                  `/documents/${id}/version`
                )
              }
            >
              + Cập nhật phiên bản
            </button>
          )}
        </div>
      </div>

      {status ===
        "Chờ tiếp nhận" && (
        <div className="document-actions">
          <button
            className="accept-button"
            onClick={() => {
              setShowAcceptForm(
                true
              )

              setShowRejectForm(
                false
              )
            }}
          >
            Tiếp nhận
          </button>

          <button
            className="reject-button"
            onClick={() => {
              setShowRejectForm(
                true
              )

              setShowAcceptForm(
                false
              )
            }}
          >
            Từ chối
          </button>
        </div>
      )}

      {showAcceptForm && (
        <div className="detail-card">
          <h2>
            Tiếp nhận tài liệu
          </h2>

          <div className="form-group">
            <label>
              Ý kiến xử lý
            </label>

            <textarea
              rows="4"
              placeholder="Nhập ý kiến nếu có..."
              value={
                receiveComment
              }
              onChange={(e) =>
                setReceiveComment(
                  e.target.value
                )
              }
            />

            <small>
              Ý kiến không bắt buộc
              trong prototype.
            </small>
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() => {
                setShowAcceptForm(
                  false
                )

                setReceiveComment(
                  ""
                )
              }}
            >
              Hủy
            </button>

            <button
              className="accept-button"
              onClick={
                handleAccept
              }
            >
              Xác nhận tiếp nhận
            </button>
          </div>
        </div>
      )}

      {showRejectForm && (
        <div className="detail-card">
          <h2>
            Từ chối tài liệu
          </h2>

          <div className="form-group">
            <label>
              Lý do / ý kiến từ chối *
            </label>

            <textarea
              rows="4"
              placeholder="Nhập lý do từ chối..."
              value={
                rejectReason
              }
              onChange={(e) =>
                setRejectReason(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() => {
                setShowRejectForm(
                  false
                )

                setRejectReason(
                  ""
                )
              }}
            >
              Hủy
            </button>

            <button
              className="reject-button"
              onClick={
                handleReject
              }
            >
              Xác nhận từ chối
            </button>
          </div>
        </div>
      )}

      {status ===
        "Từ chối" &&
        rejectReasons[id] && (
          <div className="reject-message">
            <strong>
              Lý do từ chối:
            </strong>{" "}
            {rejectReasons[id]}
          </div>
        )}

      <div className="detail-card">
        <h2>
          Thông tin tài liệu
        </h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Tên tài liệu
            </span>

            <p>
              {foundDocument.name}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Loại tài liệu
            </span>

            <p>
              {foundDocument.category}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người tải lên
            </span>

            <p>
              {foundDocument.uploader ||
                currentUser}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Trạng thái
            </span>

            <p>
              <span
                className={
                  getStatusClass()
                }
              >
                {status}
              </span>
            </p>
          </div>

          <div>
            <span className="detail-label">
              Phiên bản hiện tại
            </span>

            <p>
              {
                currentVersion.version
              }
            </p>
          </div>

          <div>
            <span className="detail-label">
              Ngày cập nhật
            </span>

            <p>
              {
                currentVersion.date
              }
            </p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>Mô tả</h2>

        <p>
          {foundDocument.description ||
            "Không có mô tả."}
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Tệp hiện tại
        </h2>

        <div className="file-row">
          <div>
            <strong>
              {currentVersion.fileName ||
                "Không có tệp"}
            </strong>

            {currentVersion.fileSize && (
              <p>
                Dung lượng:{" "}
                {
                  currentVersion.fileSize
                }
              </p>
            )}

            {currentVersion.note && (
              <p>
                Ghi chú:{" "}
                {currentVersion.note}
              </p>
            )}
          </div>

          <button
            onClick={() =>
              handleDownload(
                currentVersion
              )
            }
          >
            Tải xuống
          </button>
        </div>
      </div>

      <div className="detail-card">
        <h2>
          Lịch sử phiên bản
        </h2>

        <table>
          <thead>
            <tr>
              <th>Phiên bản</th>
              <th>Tệp</th>
              <th>
                Người cập nhật
              </th>
              <th>Ngày</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {[...versionList]
              .reverse()
              .map(
                (
                  version,
                  index
                ) => (
                  <tr key={index}>
                    <td>
                      <strong>
                        {
                          version.version
                        }
                      </strong>
                    </td>

                    <td>
                      {
                        version.fileName
                      }
                    </td>

                    <td>
                      {
                        version.updater
                      }
                    </td>

                    <td>
                      {
                        version.date
                      }
                    </td>

                    <td>
                      {version.note ||
                        "-"}
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleDownload(
                            version
                          )
                        }
                      >
                        Tải
                      </button>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>

      <div className="detail-card">
        <h2>
          Ý kiến xử lý
        </h2>

        {comments.length ===
        0 ? (
          <p>
            Chưa có ý kiến xử lý.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  Người thực hiện
                </th>

                <th>
                  Hành động
                </th>

                <th>
                  Ý kiến
                </th>

                <th>
                  Thời gian
                </th>
              </tr>
            </thead>

            <tbody>
              {comments.map(
                (
                  comment,
                  index
                ) => (
                  <tr key={index}>
                    <td>
                      {
                        comment.author
                      }
                    </td>

                    <td>
                      {
                        comment.action
                      }
                    </td>

                    <td>
                      {
                        comment.content
                      }
                    </td>

                    <td>
                      {
                        comment.date
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default DocumentDetailPage