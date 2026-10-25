import { useState } from "react"

import {
  useParams,
  useNavigate,
} from "react-router-dom"

function DocumentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const prototypeUsers = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Nguyễn Văn B",
    "Trần Thị C",
    "Phạm Văn D",
  ]

  const shareOptions = [
    {
      id: "user-01",
      name: "Nguyễn Văn B",
      type: "Cá nhân",
    },
    {
      id: "user-02",
      name: "Trần Thị C",
      type: "Cá nhân",
    },
    {
      id: "user-03",
      name: "Phạm Văn D",
      type: "Cá nhân",
    },
    {
      id: "department-01",
      name: "Phòng Hành chính",
      type: "Phòng ban",
    },
    {
      id: "department-02",
      name: "Phòng Kinh doanh",
      type: "Phòng ban",
    },
    {
      id: "department-03",
      name: "Phòng CNTT",
      type: "Phòng ban",
    },
  ]

  const defaultDocuments = [
    {
      id: "TL-0001",

      name:
        "Quy chế quản lý tài liệu nội bộ",

      category:
        "Quy chế",

      version:
        "v1.0",

      date:
        "22/10/2026",

      status:
        "Đã tiếp nhận",

      uploader:
        "Nguyễn Văn A",

      fileName:
        "quy-che-quan-ly-tai-lieu.pdf",

      fileSize:
        "2.4 MB",

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

      version:
        "v2.1",

      date:
        "21/10/2026",

      status:
        "Đã tiếp nhận",

      uploader:
        "Trần Thị B",

      fileName:
        "huong-dan-eoffice.pdf",

      fileSize:
        "4.1 MB",

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

      version:
        "v1.0",

      date:
        "20/10/2026",

      status:
        "Chờ tiếp nhận",

      uploader:
        "Lê Văn C",

      fileName:
        "bien-ban-hop-thang-10.pdf",

      fileSize:
        "1.8 MB",

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

  const storedShares =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentShares"
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

  const savedPrototypeUser =
    localStorage.getItem(
      "hlcDocumentPrototypeUser"
    )

  const [
    currentUser,
    setCurrentUser,
  ] = useState(
    savedPrototypeUser ||
      foundDocument?.uploader ||
      "Nguyễn Văn A"
  )

  const [
    status,
    setStatus,
  ] = useState(
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

  const [
    comments,
    setComments,
  ] = useState(
    storedComments[id] ||
      []
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

  const normalizeShares = (
    rawShares
  ) => {
    if (
      !Array.isArray(rawShares)
    ) {
      return []
    }

    return rawShares
      .map((share) => {
        if (
          typeof share ===
          "string"
        ) {
          const option =
            shareOptions.find(
              (item) =>
                item.id === share
            )

          if (!option) {
            return null
          }

          return {
            recipientId:
              option.id,

            recipientName:
              option.name,

            recipientType:
              option.type,

            permissions: [
              "view",
              "download",
            ],
          }
        }

        return {
          recipientId:
            share.recipientId,

          recipientName:
            share.recipientName,

          recipientType:
            share.recipientType,

          permissions:
            Array.isArray(
              share.permissions
            )
              ? share.permissions
              : ["view"],
        }
      })
      .filter(Boolean)
  }

  const documentShares =
    normalizeShares(
      storedShares[id] || []
    )

  const currentShare =
    documentShares.find(
      (share) =>
        share.recipientType ===
          "Cá nhân" &&
        share.recipientName ===
          currentUser
    )

  const isOwner =
    currentUser ===
    foundDocument.uploader

  const canView =
    isOwner ||
    Boolean(
      currentShare?.permissions.includes(
        "view"
      )
    )

  const canDownload =
    isOwner ||
    Boolean(
      currentShare?.permissions.includes(
        "download"
      )
    )

  // Prototype:
  // quyền Chia sẻ không tự động đi
  // kèm quyền Xem/Tải xuống.
  const canShare =
    isOwner

  const canManage =
    isOwner

  const getPermissionText =
    () => {
      if (isOwner) {
        return "Xem, Tải xuống, Chia sẻ"
      }

      if (!currentShare) {
        return "Chưa được cấp quyền"
      }

      const labels = []

      if (
        currentShare.permissions.includes(
          "view"
        )
      ) {
        labels.push("Xem")
      }

      if (
        currentShare.permissions.includes(
          "download"
        )
      ) {
        labels.push(
          "Tải xuống"
        )
      }

      return (
        labels.join(", ") ||
        "Chưa được cấp quyền"
      )
    }

  const handleCurrentUserChange = (
    event
  ) => {
    const user =
      event.target.value

    setCurrentUser(user)

    localStorage.setItem(
      "hlcDocumentPrototypeUser",
      user
    )

    setShowAcceptForm(false)
    setShowRejectForm(false)
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
      JSON.stringify(
        current
      )
    )

    setStatus(
      newStatus
    )
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
      JSON.stringify(
        current
      )
    )

    setComments(
      newComments
    )
  }

  const handleAccept = () => {
    if (!canManage) {
      return
    }

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
      !canManage ||
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

    saveStatus(
      "Từ chối"
    )

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

  const getStatusClass =
    () => {
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
      "Nguyễn Văn A",

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
      foundDocument.note ||
      "",
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
    if (!canDownload) {
      window.alert(
        "Bạn chỉ có quyền Xem và không được phép tải xuống tài liệu này."
      )

      return
    }

    if (!version.fileData) {
      window.alert(
        "File mẫu hoặc file cũ chưa có dữ liệu tải xuống. Hãy upload một tài liệu mới để test chức năng này."
      )

      return
    }

    const link =
      document.createElement(
        "a"
      )

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

      <div className="detail-header">
        <h1>
          Chi tiết tài liệu
        </h1>

        <p>
          Mã tài liệu:{" "}
          {foundDocument.id}
        </p>
      </div>

      {/* NGƯỜI DÙNG MÔ PHỎNG */}

      <div className="detail-card">
        <h2>
          Vai trò / quyền mô phỏng
        </h2>

        <p>
          Chọn người đang truy cập để
          kiểm thử quyền đối với tài
          liệu.
        </p>

        <div className="form-group">
          <label>
            Người đang truy cập
          </label>

          <select
            value={
              currentUser
            }
            onChange={
              handleCurrentUserChange
            }
          >
            {prototypeUsers.map(
              (user) => (
                <option
                  key={user}
                  value={user}
                >
                  {user}
                </option>
              )
            )}
          </select>
        </div>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Vai trò
            </span>

            <p>
              <strong>
                {isOwner
                  ? "Chủ tài liệu"
                  : currentShare
                    ? "Người nhận chia sẻ"
                    : "Chưa có quyền truy cập"}
              </strong>
            </p>
          </div>

          <div>
            <span className="detail-label">
              Quyền hiện tại
            </span>

            <p>
              <strong>
                {getPermissionText()}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {!canView ? (
        <div className="reject-message">
          <strong>
            Không có quyền xem tài liệu.
          </strong>

          <p>
            Người dùng hiện tại chưa được
            cấp quyền Xem đối với tài liệu
            này.
          </p>
        </div>
      ) : (
        <>
          <div className="detail-header-actions">
            <div />

            <div className="detail-action-buttons">
              {canShare && (
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
              )}

              {canManage &&
                status ===
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

          {!canShare &&
            currentShare && (
              <div className="settings-note">
                Bạn đang truy cập tài liệu
                bằng quyền được chia sẻ.
                Quyền Xem/Tải xuống không
                tự động bao gồm quyền Chia
                sẻ lại.
              </div>
            )}

          {canManage &&
            status ===
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

          {/* THÔNG TIN */}

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
                  {
                    foundDocument.name
                  }
                </p>
              </div>

              <div>
                <span className="detail-label">
                  Loại tài liệu
                </span>

                <p>
                  {
                    foundDocument.category
                  }
                </p>
              </div>

              <div>
                <span className="detail-label">
                  Người tải lên
                </span>

                <p>
                  {
                    foundDocument.uploader
                  }
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
            <h2>
              Mô tả
            </h2>

            <p>
              {foundDocument.description ||
                "Không có mô tả."}
            </p>
          </div>

          {/* FILE HIỆN TẠI */}

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
                    {
                      currentVersion.note
                    }
                  </p>
                )}
              </div>

              {canDownload ? (
                <button
                  onClick={() =>
                    handleDownload(
                      currentVersion
                    )
                  }
                >
                  Tải xuống
                </button>
              ) : (
                <span
                  style={{
                    padding:
                      "7px 11px",

                    borderRadius:
                      "999px",

                    background:
                      "#f3f4f6",

                    color:
                      "#6b7280",

                    fontSize:
                      "13px",

                    fontWeight:
                      "600",
                  }}
                >
                  Chỉ được Xem
                </span>
              )}
            </div>
          </div>

          {/* LỊCH SỬ VERSION */}

          <div className="detail-card">
            <h2>
              Lịch sử phiên bản
            </h2>

            <table>
              <thead>
                <tr>
                  <th>
                    Phiên bản
                  </th>

                  <th>
                    Tệp
                  </th>

                  <th>
                    Người cập nhật
                  </th>

                  <th>
                    Ngày
                  </th>

                  <th>
                    Ghi chú
                  </th>

                  <th>
                    Thao tác
                  </th>
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
                          {canDownload ? (
                            <button
                              onClick={() =>
                                handleDownload(
                                  version
                                )
                              }
                            >
                              Tải
                            </button>
                          ) : (
                            <span
                              style={{
                                color:
                                  "#6b7280",

                                fontSize:
                                  "13px",
                              }}
                            >
                              Không có quyền tải
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>

          {/* COMMENTS */}

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
                      <tr
                        key={
                          index
                        }
                      >
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

          <div className="settings-note">
            <strong>
              Ghi chú prototype
            </strong>

            <p>
              Kiểm tra quyền hiện được mô
              phỏng bằng localStorage.
              Hệ thống thực tế cần kiểm tra
              quyền người dùng tại backend
              mỗi lần truy cập tài liệu.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default DocumentDetailPage