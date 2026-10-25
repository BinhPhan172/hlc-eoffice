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

  const prototypeRoles = [
    {
      value: "employee",
      label: "CBNV",
    },
    {
      value: "records_clerk",
      label: "Văn thư",
    },
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
  ]

  const defaultDocuments = [
    {
      id: "TL-0001",
      name:
        "Quy chế quản lý tài liệu nội bộ",
      category: "Quy chế",
      documentScope:
        "Dùng chung",
      version: "v1.0",
      date: "22/10/2026",
      status:
        "Đã tiếp nhận",
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
      documentScope:
        "Dùng chung",
      version: "v2.1",
      date: "21/10/2026",
      status:
        "Đã tiếp nhận",
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
      category: "Biên bản",
      documentScope:
        "Dùng chung",
      version: "v1.0",
      date: "20/10/2026",
      status:
        "Chờ tiếp nhận",
      uploader: "Lê Văn C",
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

  const initialSavedVersions =
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
  ].map((item) => ({
    ...item,
    documentScope:
      item.documentScope ||
      "Dùng chung",
  }))

  const foundDocument =
    allDocuments.find(
      (item) =>
        item.id === id
    )

  const savedPrototypeUser =
    localStorage.getItem(
      "hlcDocumentPrototypeUser"
    )

  const savedPrototypeRole =
    localStorage.getItem(
      "hlcDocumentPrototypeRole"
    ) || "employee"

  const [
    currentUser,
    setCurrentUser,
  ] = useState(
    savedPrototypeUser ||
      foundDocument?.uploader ||
      "Nguyễn Văn A"
  )

  const [
    currentRole,
    setCurrentRole,
  ] = useState(
    savedPrototypeRole
  )

  const [status, setStatus] =
    useState(
      foundDocument
        ? statusOverrides[id] ||
            foundDocument.status
        : ""
    )

  const [
    versionItems,
    setVersionItems,
  ] = useState(
    initialSavedVersions[id] ||
      []
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
    versionRejectIndex,
    setVersionRejectIndex,
  ] = useState(null)

  const [
    versionRejectReason,
    setVersionRejectReason,
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
          ← Quay lại
        </button>
      </div>
    )
  }

  const normalizeVersionStatus = (
    version
  ) =>
    version.status ||
    "Đã tiếp nhận"

  const normalizeShares = (
    rawShares
  ) => {
    if (!Array.isArray(rawShares)) {
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

  const isRecordsClerk =
    currentRole ===
    "records_clerk"

  const isCommonDocument =
    foundDocument.documentScope ===
    "Dùng chung"

  const clerkCanAccess =
    isRecordsClerk &&
    isCommonDocument

  const canView =
    isOwner ||
    clerkCanAccess ||
    Boolean(
      currentShare?.permissions.includes(
        "view"
      )
    )

  const canDownload =
    isOwner ||
    clerkCanAccess ||
    Boolean(
      currentShare?.permissions.includes(
        "download"
      )
    )

  const canShare =
    isOwner &&
    (
      !isCommonDocument ||
      status ===
        "Đã tiếp nhận"
    )

  const canUpdateVersion =
    isOwner &&
    (
      !isCommonDocument ||
      status ===
        "Đã tiếp nhận"
    )

  const canManageAcceptance =
    isRecordsClerk &&
    isCommonDocument &&
    status ===
      "Chờ tiếp nhận"

  const baseVersion = {
    version:
      foundDocument.version ||
      "v1.0",

    updater:
      foundDocument.uploader,

    date:
      foundDocument.date ||
      foundDocument.updatedAt,

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

    status:
      status ===
      "Đã tiếp nhận"
        ? "Đã tiếp nhận"
        : status,
  }

  const acceptedVersions =
    versionItems.filter(
      (version) =>
        normalizeVersionStatus(
          version
        ) === "Đã tiếp nhận"
    )

  const currentVersion =
    acceptedVersions.length > 0
      ? acceptedVersions[
          acceptedVersions.length - 1
        ]
      : baseVersion

  const pendingVersions =
    versionItems.filter(
      (version) =>
        normalizeVersionStatus(
          version
        ) === "Chờ tiếp nhận"
    )

  const saveVersions = (
    nextVersions
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcDocumentVersions"
        )
      ) || {}

    current[id] =
      nextVersions

    localStorage.setItem(
      "hlcDocumentVersions",
      JSON.stringify(
        current
      )
    )

    setVersionItems(
      nextVersions
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

    setComments(
      newComments
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
  }

  const handleRoleChange = (
    event
  ) => {
    const role =
      event.target.value

    setCurrentRole(role)

    localStorage.setItem(
      "hlcDocumentPrototypeRole",
      role
    )

    setShowAcceptForm(false)
    setShowRejectForm(false)
    setVersionRejectIndex(null)
  }

  const handleAccept = () => {
    if (!canManageAcceptance) {
      return
    }

    saveStatus(
      "Đã tiếp nhận"
    )

    saveComments([
      ...comments,
      {
        author:
          `Văn thư - ${currentUser}`,
        action:
          "Tiếp nhận",
        content:
          receiveComment.trim() ||
          "Đã tiếp nhận tài liệu dùng chung.",
        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      },
    ])

    setReceiveComment("")
    setShowAcceptForm(false)
  }

  const handleReject = () => {
    if (
      !canManageAcceptance ||
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

    saveComments([
      ...comments,
      {
        author:
          `Văn thư - ${currentUser}`,
        action: "Từ chối",
        content:
          rejectReason.trim(),
        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      },
    ])

    setRejectReason("")
    setShowRejectForm(false)
  }

  const handleAcceptVersion = (
    index
  ) => {
    if (
      !isRecordsClerk ||
      !isCommonDocument
    ) {
      return
    }

    const next =
      versionItems.map(
        (version, i) =>
          i === index
            ? {
                ...version,
                status:
                  "Đã tiếp nhận",
                reviewedBy:
                  currentUser,
                reviewedAt:
                  new Date().toLocaleString(
                    "vi-VN"
                  ),
                reviewNote:
                  "Văn thư đã tiếp nhận phiên bản.",
              }
            : version
      )

    saveVersions(next)
  }

  const handleRejectVersion =
    () => {
      if (
        versionRejectIndex ===
          null ||
        !versionRejectReason.trim()
      ) {
        return
      }

      const next =
        versionItems.map(
          (version, index) =>
            index ===
            versionRejectIndex
              ? {
                  ...version,
                  status:
                    "Từ chối",
                  reviewedBy:
                    currentUser,
                  reviewedAt:
                    new Date().toLocaleString(
                      "vi-VN"
                    ),
                  reviewNote:
                    versionRejectReason.trim(),
                }
              : version
        )

      saveVersions(next)

      setVersionRejectIndex(
        null
      )

      setVersionRejectReason(
        ""
      )
    }

  const handleDownload = (
    version
  ) => {
    if (!canDownload) {
      window.alert(
        "Bạn không được phép tải xuống tài liệu này."
      )
      return
    }

    if (!version.fileData) {
      window.alert(
        "File mẫu hoặc file cũ chưa có dữ liệu tải xuống."
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

  const getStatusClass = (
    value
  ) => {
    if (
      value ===
      "Đã tiếp nhận"
    ) {
      return "status processing"
    }

    if (
      value ===
      "Từ chối"
    ) {
      return "status rejected"
    }

    return "status pending"
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

      <div className="detail-card">
        <h2>
          Vai trò / quyền mô phỏng
        </h2>

        <div className="detail-grid">
          <div className="form-group">
            <label>
              Người đang truy cập
            </label>

            <select
              value={currentUser}
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

          <div className="form-group">
            <label>
              Vai trò
            </label>

            <select
              value={currentRole}
              onChange={
                handleRoleChange
              }
            >
              {prototypeRoles.map(
                (role) => (
                  <option
                    key={
                      role.value
                    }
                    value={
                      role.value
                    }
                  >
                    {role.label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {!canView ? (
        <div className="reject-message">
          Không có quyền xem tài liệu.
        </div>
      ) : (
        <>
          {pendingVersions.length >
            0 && (
            <div className="settings-note">
              Tài liệu có{" "}
              <strong>
                {
                  pendingVersions.length
                }{" "}
                phiên bản mới
              </strong>{" "}
              đang chờ Văn thư tiếp nhận.
              Phiên bản hiện hành vẫn là{" "}
              <strong>
                {
                  currentVersion.version
                }
              </strong>
              .
            </div>
          )}

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

              {canUpdateVersion && (
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

          {canManageAcceptance && (
            <div className="document-actions">
              <button
                className="accept-button"
                onClick={() =>
                  setShowAcceptForm(
                    true
                  )
                }
              >
                Tiếp nhận
              </button>

              <button
                className="reject-button"
                onClick={() =>
                  setShowRejectForm(
                    true
                  )
                }
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

              <textarea
                rows="4"
                value={
                  receiveComment
                }
                placeholder="Ý kiến tiếp nhận..."
                onChange={(e) =>
                  setReceiveComment(
                    e.target.value
                  )
                }
              />

              <div className="form-actions">
                <button
                  className="secondary-button"
                  onClick={() =>
                    setShowAcceptForm(
                      false
                    )
                  }
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

              <textarea
                rows="4"
                value={
                  rejectReason
                }
                placeholder="Lý do từ chối..."
                onChange={(e) =>
                  setRejectReason(
                    e.target.value
                  )
                }
              />

              <div className="form-actions">
                <button
                  className="secondary-button"
                  onClick={() =>
                    setShowRejectForm(
                      false
                    )
                  }
                >
                  Hủy
                </button>

                <button
                  className="reject-button"
                  onClick={
                    handleReject
                  }
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}

          {versionRejectIndex !==
            null && (
            <div className="detail-card">
              <h2>
                Từ chối phiên bản{" "}
                {
                  versionItems[
                    versionRejectIndex
                  ]?.version
                }
              </h2>

              <div className="form-group">
                <label>
                  Lý do từ chối *
                </label>

                <textarea
                  rows="4"
                  value={
                    versionRejectReason
                  }
                  onChange={(e) =>
                    setVersionRejectReason(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-actions">
                <button
                  className="secondary-button"
                  onClick={() => {
                    setVersionRejectIndex(
                      null
                    )
                    setVersionRejectReason(
                      ""
                    )
                  }}
                >
                  Hủy
                </button>

                <button
                  className="reject-button"
                  onClick={
                    handleRejectVersion
                  }
                >
                  Xác nhận từ chối
                </button>
              </div>
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
                  Phạm vi
                </span>
                <p>
                  {
                    foundDocument.documentScope
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
                    className={getStatusClass(
                      status
                    )}
                  >
                    {status}
                  </span>
                </p>
              </div>

              <div>
                <span className="detail-label">
                  Phiên bản hiện hành
                </span>

                <p>
                  <strong>
                    {
                      currentVersion.version
                    }
                  </strong>
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

          <div className="detail-card">
            <h2>
              Tệp hiện hành
            </h2>

            <div className="file-row">
              <div>
                <strong>
                  {
                    currentVersion.fileName
                  }
                </strong>

                <p>
                  {
                    currentVersion.fileSize
                  }
                </p>
              </div>

              {canDownload && (
                <button
                  onClick={() =>
                    handleDownload(
                      currentVersion
                    )
                  }
                >
                  Tải xuống
                </button>
              )}
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
                  <th>Người cập nhật</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <strong>
                      {
                        baseVersion.version
                      }
                    </strong>
                  </td>

                  <td>
                    {
                      baseVersion.fileName
                    }
                  </td>

                  <td>
                    {
                      baseVersion.updater
                    }
                  </td>

                  <td>
                    {
                      baseVersion.date
                    }
                  </td>

                  <td>
                    <span
                      className={getStatusClass(
                        baseVersion.status
                      )}
                    >
                      {
                        baseVersion.status
                      }
                    </span>
                  </td>

                  <td>
                    {baseVersion.note ||
                      "-"}
                  </td>

                  <td>
                    {canDownload && (
                      <button
                        onClick={() =>
                          handleDownload(
                            baseVersion
                          )
                        }
                      >
                        Tải
                      </button>
                    )}
                  </td>
                </tr>

                {[...versionItems]
                  .map(
                    (
                      version,
                      index
                    ) => ({
                      ...version,
                      storageIndex:
                        index,
                    })
                  )
                  .reverse()
                  .map(
                    (version) => {
                      const versionStatus =
                        normalizeVersionStatus(
                          version
                        )

                      return (
                        <tr
                          key={
                            version.storageIndex
                          }
                        >
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
                            <span
                              className={getStatusClass(
                                versionStatus
                              )}
                            >
                              {
                                versionStatus
                              }
                            </span>

                            {version.reviewNote && (
                              <div
                                style={{
                                  marginTop:
                                    "5px",
                                  fontSize:
                                    "12px",
                                  color:
                                    "#6b7280",
                                }}
                              >
                                {
                                  version.reviewNote
                                }
                              </div>
                            )}
                          </td>

                          <td>
                            {version.note ||
                              "-"}
                          </td>

                          <td>
                            <div
                              style={{
                                display:
                                  "flex",
                                gap:
                                  "6px",
                                flexWrap:
                                  "wrap",
                              }}
                            >
                              {canDownload && (
                                <button
                                  onClick={() =>
                                    handleDownload(
                                      version
                                    )
                                  }
                                >
                                  Tải
                                </button>
                              )}

                              {isRecordsClerk &&
                                isCommonDocument &&
                                versionStatus ===
                                  "Chờ tiếp nhận" && (
                                  <>
                                    <button
                                      className="accept-button"
                                      onClick={() =>
                                        handleAcceptVersion(
                                          version.storageIndex
                                        )
                                      }
                                    >
                                      Tiếp nhận
                                    </button>

                                    <button
                                      className="reject-button"
                                      onClick={() =>
                                        setVersionRejectIndex(
                                          version.storageIndex
                                        )
                                      }
                                    >
                                      Từ chối
                                    </button>
                                  </>
                                )}
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  )}
              </tbody>
            </table>
          </div>

          {comments.length > 0 && (
            <div className="detail-card">
              <h2>
                Lịch sử xử lý
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Người thực hiện</th>
                    <th>Hành động</th>
                    <th>Ý kiến</th>
                    <th>Thời gian</th>
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
            </div>
          )}

          <div className="settings-note">
            <strong>
              Quy tắc phiên bản:
            </strong>{" "}
            đối với tài liệu dùng chung,
            phiên bản mới chưa được Văn
            thư tiếp nhận sẽ không thay
            thế phiên bản đang hiện hành.
          </div>
        </>
      )}
    </div>
  )
}

export default DocumentDetailPage