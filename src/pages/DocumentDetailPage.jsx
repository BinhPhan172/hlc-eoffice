import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker

function DocumentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const canvasRefs = useRef({})

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
      folderId: "FOL-0003",
      folderName:
        "Văn bản dùng chung",
      version: "v1.0",
      date: "22/10/2026",
      status:
        "Đã tiếp nhận",
      uploader:
        "Nguyễn Văn A",
      fileName:
        "quy-che-quan-ly-tai-lieu.pdf",
      fileSize: "2.4 MB",
      fileData: "",
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
      folderId: "FOL-0003",
      folderName:
        "Văn bản dùng chung",
      version: "v2.1",
      date: "21/10/2026",
      status:
        "Đã tiếp nhận",
      uploader:
        "Trần Thị B",
      fileName:
        "huong-dan-eoffice.pdf",
      fileSize: "4.1 MB",
      fileData: "",
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
      folderId: "FOL-0003",
      folderName:
        "Văn bản dùng chung",
      version: "v1.0",
      date: "20/10/2026",
      status:
        "Chờ tiếp nhận",
      uploader: "Lê Văn C",
      fileName:
        "bien-ban-hop-thang-10.pdf",
      fileSize: "1.8 MB",
      fileData: "",
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
    folderId:
      item.folderId || "",
    folderName:
      item.folderName || "",
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

  const [
    pdfDocument,
    setPdfDocument,
  ] = useState(null)

  const [
    numPages,
    setNumPages,
  ] = useState(0)

  const [
    pdfLoading,
    setPdfLoading,
  ] = useState(false)

  const [
    pdfError,
    setPdfError,
  ] = useState("")

  const normalizeVersionStatus = (
    version
  ) =>
    version.status ||
    "Đã tiếp nhận"

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
    foundDocument?.uploader

  const isRecordsClerk =
    currentRole ===
    "records_clerk"

  const isCommonDocument =
    foundDocument
      ?.documentScope ===
    "Dùng chung"

  const clerkCanAccess =
    isRecordsClerk &&
    isCommonDocument

  const canView =
    Boolean(foundDocument) &&
    (
      isOwner ||
      clerkCanAccess ||
      Boolean(
        currentShare?.permissions.includes(
          "view"
        )
      )
    )

  const canDownload =
    Boolean(foundDocument) &&
    (
      isOwner ||
      clerkCanAccess ||
      Boolean(
        currentShare?.permissions.includes(
          "download"
        )
      )
    )

  const canShare =
    Boolean(foundDocument) &&
    isOwner &&
    (
      !isCommonDocument ||
      status ===
        "Đã tiếp nhận"
    )

  const canUpdateVersion =
    Boolean(foundDocument) &&
    isOwner &&
    (
      !isCommonDocument ||
      status ===
        "Đã tiếp nhận"
    )

  const canManageAcceptance =
    Boolean(foundDocument) &&
    isRecordsClerk &&
    isCommonDocument &&
    status ===
      "Chờ tiếp nhận"

  const baseVersion = {
    version:
      foundDocument
        ?.version ||
      "v1.0",

    updater:
      foundDocument
        ?.uploader ||
      "",

    date:
      foundDocument?.date ||
      foundDocument?.updatedAt ||
      "",

    fileName:
      foundDocument
        ?.fileName ||
      "",

    fileSize:
      foundDocument
        ?.fileSize ||
      "",

    fileData:
      foundDocument
        ?.fileData ||
      "",

    note:
      foundDocument?.note ||
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
        ) ===
        "Đã tiếp nhận"
    )

  const currentVersion =
    acceptedVersions.length > 0
      ? acceptedVersions[
          acceptedVersions.length -
            1
        ]
      : baseVersion

  const pendingVersions =
    versionItems.filter(
      (version) =>
        normalizeVersionStatus(
          version
        ) ===
        "Chờ tiếp nhận"
    )

  const currentFileName =
    currentVersion.fileName ||
    ""

  const currentFileData =
    currentVersion.fileData ||
    ""

  const lowerFileName =
    currentFileName.toLowerCase()

  const isPdf =
    currentFileData.startsWith(
      "data:application/pdf"
    ) ||
    lowerFileName.endsWith(
      ".pdf"
    )

  const isImage =
    currentFileData.startsWith(
      "data:image/"
    ) ||
    [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
    ].some((extension) =>
      lowerFileName.endsWith(
        extension
      )
    )

  const dataUrlToUint8Array = (
    dataUrl
  ) => {
    const base64 =
      dataUrl.split(",")[1]

    const binaryString =
      window.atob(base64)

    const bytes =
      new Uint8Array(
        binaryString.length
      )

    for (
      let i = 0;
      i <
      binaryString.length;
      i += 1
    ) {
      bytes[i] =
        binaryString.charCodeAt(
          i
        )
    }

    return bytes
  }

  // =========================
  // LOAD PDF
  // Không gọi pdf.destroy()
  // để tránh crash khi rời trang.
  // =========================

  useEffect(() => {
    canvasRefs.current = {}

    if (
      !canView ||
      !currentFileData ||
      !isPdf
    ) {
      setPdfDocument(null)
      setNumPages(0)
      setPdfLoading(false)
      setPdfError("")
      return
    }

    let cancelled = false

    const loadPdf =
      async () => {
        try {
          setPdfLoading(true)
          setPdfError("")

          const data =
            dataUrlToUint8Array(
              currentFileData
            )

          const loadingTask =
            pdfjsLib.getDocument({
              data,
            })

          const pdf =
            await loadingTask.promise

          if (cancelled) {
            return
          }

          setPdfDocument(pdf)

          setNumPages(
            pdf.numPages
          )
        } catch (err) {
          console.error(err)

          if (!cancelled) {
            setPdfDocument(null)
            setNumPages(0)

            setPdfError(
              "Không thể hiển thị file PDF này."
            )
          }
        } finally {
          if (!cancelled) {
            setPdfLoading(
              false
            )
          }
        }
      }

    loadPdf()

    return () => {
      cancelled = true
    }
  }, [
    canView,
    currentFileData,
    isPdf,
  ])

  // =========================
  // RENDER PDF
  // =========================

  useEffect(() => {
    if (
      !pdfDocument ||
      numPages === 0
    ) {
      return
    }

    let cancelled = false

    const renderPages =
      async () => {
        for (
          let pageNumber = 1;
          pageNumber <=
          numPages;
          pageNumber += 1
        ) {
          if (cancelled) {
            return
          }

          const canvas =
            canvasRefs.current[
              pageNumber
            ]

          if (!canvas) {
            continue
          }

          try {
            const page =
              await pdfDocument.getPage(
                pageNumber
              )

            const baseViewport =
              page.getViewport({
                scale: 1,
              })

            const targetWidth =
              900

            const scale =
              targetWidth /
              baseViewport.width

            const viewport =
              page.getViewport({
                scale,
              })

            const outputScale =
              window.devicePixelRatio ||
              1

            const context =
              canvas.getContext(
                "2d"
              )

            canvas.width =
              Math.floor(
                viewport.width *
                  outputScale
              )

            canvas.height =
              Math.floor(
                viewport.height *
                  outputScale
              )

            canvas.style.width =
              "100%"

            canvas.style.height =
              "auto"

            const transform =
              outputScale !== 1
                ? [
                    outputScale,
                    0,
                    0,
                    outputScale,
                    0,
                    0,
                  ]
                : null

            await page
              .render({
                canvasContext:
                  context,
                viewport,
                transform,
              })
              .promise
          } catch (err) {
            if (!cancelled) {
              console.error(err)
            }
          }
        }
      }

    renderPages()

    return () => {
      cancelled = true
    }
  }, [
    pdfDocument,
    numPages,
  ])

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
      JSON.stringify(
        current
      )
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
      JSON.stringify(
        current
      )
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
    if (
      !canManageAcceptance
    ) {
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

        action:
          "Từ chối",

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

        {canView && (
          <div className="settings-note">
            Quyền hiện tại:{" "}
            <strong>
              Xem
              {canDownload
                ? ", Tải xuống"
                : ""}
              {canShare
                ? ", Chia sẻ"
                : ""}
            </strong>
          </div>
        )}
      </div>

      {!canView ? (
        <div className="reject-message">
          <strong>
            Không có quyền xem tài liệu.
          </strong>

          <p>
            Người dùng hiện tại chưa
            được cấp quyền Xem tài liệu
            này.
          </p>
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
              đang chờ Văn thư tiếp
              nhận. Phiên bản hiện hành
              vẫn là{" "}
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
                  Ý kiến tiếp nhận
                </label>

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
              </div>

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

              <div className="form-group">
                <label>
                  Lý do từ chối *
                </label>

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
              </div>

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
                  Thư mục
                </span>

                <p>
                  {foundDocument.folderName
                    ? `📁 ${foundDocument.folderName}`
                    : "Không có thư mục"}
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
                  {currentVersion.fileName ||
                    "Không có tệp"}
                </strong>

                <p>
                  {currentVersion.fileSize ||
                    "-"}
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

          {/* XEM TRỰC TIẾP */}

          <div className="detail-card">
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: "12px",
                marginBottom:
                  "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    marginBottom:
                      "4px",
                  }}
                >
                  Xem tài liệu
                </h2>

                <p
                  style={{
                    margin: 0,
                    color:
                      "#6b7280",
                  }}
                >
                  Xem trực tiếp phiên
                  bản hiện hành.
                </p>
              </div>

              <span
                style={{
                  padding:
                    "6px 10px",
                  borderRadius:
                    "999px",
                  background:
                    "#ecfdf5",
                  color:
                    "#047857",
                  fontSize:
                    "13px",
                  fontWeight:
                    "600",
                }}
              >
                Quyền Xem
              </span>
            </div>

            {!currentFileData && (
              <div className="settings-note">
                File mẫu cũ chưa có dữ
                liệu để xem trực tiếp.
                File mới tải lên sẽ xem
                được tại đây.
              </div>
            )}

            {currentFileData &&
              isPdf && (
              <>
                {pdfLoading && (
                  <div
                    style={{
                      padding:
                        "40px",
                      textAlign:
                        "center",
                    }}
                  >
                    Đang tải PDF...
                  </div>
                )}

                {pdfError && (
                  <div className="form-error">
                    {pdfError}
                  </div>
                )}

                {pdfDocument &&
                  numPages >
                    0 && (
                    <div
                      style={{
                        maxHeight:
                          "720px",

                        overflowY:
                          "auto",

                        padding:
                          "20px",

                        background:
                          "#e5e7eb",

                        borderRadius:
                          "10px",
                      }}
                    >
                      {Array.from(
                        {
                          length:
                            numPages,
                        },
                        (
                          _,
                          index
                        ) =>
                          index +
                          1
                      ).map(
                        (
                          pageNumber
                        ) => (
                          <div
                            key={
                              pageNumber
                            }
                            style={{
                              maxWidth:
                                "900px",

                              margin:
                                "0 auto 24px",
                            }}
                          >
                            <div
                              style={{
                                textAlign:
                                  "center",

                                marginBottom:
                                  "7px",

                                fontWeight:
                                  "600",

                                color:
                                  "#374151",
                              }}
                            >
                              Trang{" "}
                              {
                                pageNumber
                              }{" "}
                              /{" "}
                              {
                                numPages
                              }
                            </div>

                            <div
                              style={{
                                background:
                                  "#ffffff",

                                boxShadow:
                                  "0 4px 15px rgba(0,0,0,0.15)",
                              }}
                            >
                              <canvas
                                ref={(
                                  canvas
                                ) => {
                                  canvasRefs.current[
                                    pageNumber
                                  ] =
                                    canvas
                                }}
                                style={{
                                  display:
                                    "block",
                                  width:
                                    "100%",
                                  height:
                                    "auto",
                                }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </>
            )}

            {currentFileData &&
              isImage && (
              <div
                style={{
                  maxHeight:
                    "720px",

                  overflow:
                    "auto",

                  padding:
                    "20px",

                  textAlign:
                    "center",

                  background:
                    "#e5e7eb",

                  borderRadius:
                    "10px",
                }}
              >
                <img
                  src={
                    currentFileData
                  }
                  alt={
                    currentVersion.fileName ||
                    "Tài liệu"
                  }
                  style={{
                    maxWidth:
                      "100%",

                    height:
                      "auto",

                    background:
                      "#ffffff",

                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
            )}

            {currentFileData &&
              !isPdf &&
              !isImage && (
              <div className="settings-note">
                Định dạng file này chưa
                hỗ trợ xem trực tiếp
                trong prototype.
              </div>
            )}

            {!canDownload &&
              currentFileData && (
              <div
                className="settings-note"
                style={{
                  marginTop:
                    "14px",
                }}
              >
                <strong>
                  Chỉ có quyền Xem:
                </strong>{" "}
                bạn có thể đọc tài liệu
                trực tiếp nhưng không
                được tải file xuống.
              </div>
            )}
          </div>

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
                    Trạng thái
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

          {status ===
            "Từ chối" &&
            rejectReasons[id] && (
              <div className="reject-message">
                <strong>
                  Lý do từ chối:
                </strong>{" "}
                {
                  rejectReasons[
                    id
                  ]
                }
              </div>
            )}

          {comments.length >
            0 && (
            <div className="detail-card">
              <h2>
                Lịch sử xử lý
              </h2>

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
                          {comment.action ||
                            "-"}
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
            thế phiên bản đang hiện
            hành.
          </div>
        </>
      )}
    </div>
  )
}

export default DocumentDetailPage