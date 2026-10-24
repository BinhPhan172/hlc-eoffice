import { useState } from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

function ApprovalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const prototypeUsers = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Văn D",
  ]

  const savedPrototypeUser =
    localStorage.getItem(
      "hlcPrototypeUser"
    ) || "Nguyễn Văn A"

  const [
    currentUser,
    setCurrentUser,
  ] = useState(
    savedPrototypeUser
  )

  const defaultApprovals = [
    {
      id: "TK-0001",
      name:
        "Đề nghị mua sắm thiết bị",
      description:
        "Đề nghị phê duyệt kế hoạch mua sắm thiết bị phục vụ công việc.",
      documentType:
        "Khác",
      priority:
        "Bình thường",
      creator:
        "Nguyễn Văn A",
      approver:
        "Trần Thị B",
      signer:
        "Lê Văn C",
      updatedAt:
        "22/10/2026",
      status:
        "Chờ phê duyệt",
      fileName:
        "de-nghi-mua-sam-thiet-bi.pdf",
      fileSize:
        "2.1 MB",
      fileData: "",
      signatureMethod: "",
      signaturePosition: null,
    },

    {
      id: "TK-0002",
      name:
        "Quyết định điều động nhân sự",
      description:
        "Hồ sơ quyết định điều động nhân sự.",
      documentType:
        "Khác",
      priority:
        "Cao",
      creator:
        "Trần Thị B",
      approver:
        "Lê Văn C",
      signer:
        "Phạm Văn D",
      updatedAt:
        "21/10/2026",
      status:
        "Chờ ký",
      fileName:
        "quyet-dinh-dieu-dong.pdf",
      fileSize:
        "1.5 MB",
      fileData: "",
      signatureMethod:
        "VNPT Smart CA",
      signaturePosition: null,
    },

    {
      id: "TK-0003",
      name:
        "Đề xuất kế hoạch đào tạo",
      description:
        "Đề xuất kế hoạch đào tạo nội bộ.",
      documentType:
        "Khác",
      priority:
        "Bình thường",
      creator:
        "Lê Văn C",
      approver:
        "Phạm Văn D",
      signer:
        "Phạm Văn D",
      updatedAt:
        "20/10/2026",
      status:
        "Hoàn tất",
      fileName:
        "ke-hoach-dao-tao.pdf",
      fileSize:
        "3.0 MB",
      fileData: "",
      signatureMethod:
        "VNPT Smart CA",
      signaturePosition: null,
    },
  ]

  const savedApprovals =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovals"
      )
    ) || []

  const statusOverrides =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalStatus"
      )
    ) || {}

  const savedComments =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalComments"
      )
    ) || {}

  const rejectReasons =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalRejectReasons"
      )
    ) || {}

  const savedDelegates =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalDelegates"
      )
    ) || {}

  const signatures =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalSignatures"
      )
    ) || {}

  const allApprovals = [
    ...defaultApprovals,
    ...savedApprovals,
  ]

  const approval =
    allApprovals.find(
      (item) =>
        item.id === id
    )

  const [status, setStatus] =
    useState(
      approval
        ? statusOverrides[id] ||
            approval.status
        : ""
    )

  const [
    comments,
    setComments,
  ] = useState(
    savedComments[id] ||
      []
  )

  const [
    commentText,
    setCommentText,
  ] = useState("")

  const [
    rejectReason,
    setRejectReason,
  ] = useState("")

  const [
    delegate,
    setDelegate,
  ] = useState(
    savedDelegates[id] ||
      ""
  )

  const [
    selectedDelegate,
    setSelectedDelegate,
  ] = useState("")

  const [
    showCommentForm,
    setShowCommentForm,
  ] = useState(false)

  const [
    showRejectForm,
    setShowRejectForm,
  ] = useState(false)

  const [
    showDelegateForm,
    setShowDelegateForm,
  ] = useState(false)

  if (!approval) {
    return (
      <div>
        <h1>
          Không tìm thấy hồ sơ trình ký
        </h1>

        <button
          onClick={() =>
            navigate(
              "/approval"
            )
          }
        >
          ← Quay lại danh sách
        </button>
      </div>
    )
  }

  const getWorkflow = () => {
    if (
      Array.isArray(
        approval.approvalFlow
      ) &&
      approval.approvalFlow
        .length > 0 &&
      approval.approvalFlow.some(
        (step) =>
          Array.isArray(
            step.handlers
          )
      )
    ) {
      return approval.approvalFlow
    }

    const legacySteps = []

    if (
      approval.approver
    ) {
      legacySteps.push({
        id:
          "legacy-approval",
        step: 1,
        name:
          "Phê duyệt",
        flowType:
          "Tuần tự",
        handlers: [
          {
            id:
              "legacy-approver",
            user:
              approval.approver,
            actionType:
              "Kiểm soát",
            signatureMethod:
              "",
          },
        ],
      })
    }

    if (
      approval.signer
    ) {
      legacySteps.push({
        id:
          "legacy-sign",
        step:
          legacySteps.length +
          1,
        name:
          "Ký duyệt",
        flowType:
          "Tuần tự",
        handlers: [
          {
            id:
              "legacy-signer",
            user:
              approval.signer,
            actionType:
              "Ký duyệt",
            signatureMethod:
              approval.signatureMethod ||
              "",
          },
        ],
      })
    }

    return legacySteps
  }

  const workflow =
    getWorkflow()

  const allHandlers =
    workflow.flatMap(
      (step) =>
        step.handlers ||
        []
    )

  const workflowApprover =
    allHandlers.find(
      (handler) =>
        handler.actionType !==
          "Ký duyệt" &&
        handler.user
    )?.user || ""

  const workflowSignerHandler =
    allHandlers.find(
      (handler) =>
        handler.actionType ===
          "Ký duyệt" &&
        handler.user
    )

  const workflowSigner =
    workflowSignerHandler
      ?.user || ""

  const baseApprover =
    approval.approver ||
    workflowApprover ||
    workflowSigner

  const baseSigner =
    approval.signer ||
    workflowSigner ||
    baseApprover

  const currentSigner =
    delegate ||
    baseSigner

  const signature =
    signatures[id]

  // =========================
  // STORAGE
  // =========================

  const saveStatus = (
    newStatus
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcApprovalStatus"
        )
      ) || {}

    current[id] =
      newStatus

    localStorage.setItem(
      "hlcApprovalStatus",
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
          "hlcApprovalComments"
        )
      ) || {}

    current[id] =
      newComments

    localStorage.setItem(
      "hlcApprovalComments",
      JSON.stringify(
        current
      )
    )

    setComments(
      newComments
    )
  }

  // =========================
  // ACTIONS
  // =========================

  const handleChangePrototypeUser = (
    event
  ) => {
    const user =
      event.target.value

    setCurrentUser(
      user
    )

    localStorage.setItem(
      "hlcPrototypeUser",
      user
    )
  }

  const handleApprove = () => {
    saveStatus(
      "Chờ ký"
    )

    saveComments([
      ...comments,
      {
        author:
          currentUser,
        content:
          "Đã phê duyệt hồ sơ.",
        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      },
    ])
  }

  const handleReject = () => {
    if (
      !rejectReason.trim()
    ) {
      return
    }

    saveStatus(
      "Từ chối"
    )

    const currentReasons =
      JSON.parse(
        localStorage.getItem(
          "hlcApprovalRejectReasons"
        )
      ) || {}

    currentReasons[id] =
      rejectReason.trim()

    localStorage.setItem(
      "hlcApprovalRejectReasons",
      JSON.stringify(
        currentReasons
      )
    )

    saveComments([
      ...comments,
      {
        author:
          currentUser,
        content:
          `Từ chối: ${rejectReason.trim()}`,
        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      },
    ])

    setRejectReason("")
    setShowRejectForm(
      false
    )
  }

  const handleAddComment = () => {
    if (
      !commentText.trim()
    ) {
      return
    }

    saveComments([
      ...comments,
      {
        author:
          currentUser,
        content:
          commentText.trim(),
        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      },
    ])

    setCommentText("")
    setShowCommentForm(
      false
    )
  }

  const handleDelegate = () => {
    if (
      !selectedDelegate
    ) {
      return
    }

    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcApprovalDelegates"
        )
      ) || {}

    current[id] =
      selectedDelegate

    localStorage.setItem(
      "hlcApprovalDelegates",
      JSON.stringify(
        current
      )
    )

    setDelegate(
      selectedDelegate
    )

    saveComments([
      ...comments,
      {
        author:
          currentUser,
        content:
          `Đã ủy quyền ký cho ${selectedDelegate}.`,
        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      },
    ])

    setSelectedDelegate(
      ""
    )

    setShowDelegateForm(
      false
    )
  }

  const handleWithdraw = () => {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn thu hồi hồ sơ trình ký này?"
      )

    if (!confirmed) {
      return
    }

    saveStatus(
      "Đã thu hồi"
    )

    saveComments([
      ...comments,
      {
        author:
          currentUser,
        content:
          "Đã thu hồi hồ sơ trình ký.",
        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      },
    ])
  }

  const handleDownload = () => {
    if (
      !approval.fileData
    ) {
      window.alert(
        "File mẫu hoặc hồ sơ cũ chưa có dữ liệu tải xuống."
      )
      return
    }

    const link =
      document.createElement(
        "a"
      )

    link.href =
      approval.fileData

    link.download =
      approval.fileName ||
      "ho-so-trinh-ky"

    document.body.appendChild(
      link
    )

    link.click()

    document.body.removeChild(
      link
    )
  }

  // =========================
  // PERMISSION
  // =========================

  const canWithdraw =
    currentUser ===
      approval.creator &&
    status !==
      "Hoàn tất" &&
    status !==
      "Từ chối" &&
    status !==
      "Đã thu hồi"

  const canApprove =
    status ===
      "Chờ phê duyệt" &&
    currentUser ===
      baseApprover

  const canReject =
    canApprove

  const canDelegate =
    status ===
      "Chờ ký" &&
    !delegate &&
    currentUser ===
      baseSigner

  const canSign =
    status ===
      "Chờ ký" &&
    currentUser ===
      currentSigner

  const getStatusClass =
    () => {
      if (
        status ===
        "Hoàn tất"
      ) {
        return "status processing"
      }

      if (
        status ===
        "Chờ ký"
      ) {
        return "status waiting"
      }

      if (
        status ===
          "Từ chối" ||
        status ===
          "Đã thu hồi"
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
            "/approval"
          )
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header detail-header-actions">
        <div>
          <h1>
            Chi tiết hồ sơ trình ký
          </h1>

          <p>
            Mã hồ sơ:{" "}
            {approval.id}
          </p>
        </div>

        <div className="detail-action-buttons">
          {status !==
            "Hoàn tất" &&
            status !==
              "Đã thu hồi" && (
              <button
                className="secondary-button"
                onClick={() =>
                  setShowCommentForm(
                    true
                  )
                }
              >
                Thêm ý kiến
              </button>
            )}

          {canWithdraw && (
            <button
              className="reject-button"
              onClick={
                handleWithdraw
              }
            >
              Thu hồi
            </button>
          )}

          {canApprove && (
            <button
              className="accept-button"
              onClick={
                handleApprove
              }
            >
              Phê duyệt
            </button>
          )}

          {canReject && (
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
          )}

          {canDelegate && (
            <button
              className="secondary-button"
              onClick={() =>
                setShowDelegateForm(
                  true
                )
              }
            >
              Ủy quyền ký
            </button>
          )}

          {canSign && (
            <button
              className="primary-button"
              onClick={() =>
                navigate(
                  `/approval/${id}/sign`
                )
              }
            >
              Ký tài liệu
            </button>
          )}
        </div>
      </div>

      {status !==
        "Hoàn tất" && (
        <div className="detail-card">
          <h2>
            Người dùng mô phỏng
          </h2>

          <div className="form-group">
            <label>
              Người đang thao tác
            </label>

            <select
              value={
                currentUser
              }
              onChange={
                handleChangePrototypeUser
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
        </div>
      )}

      {status ===
        "Chờ phê duyệt" &&
        !canApprove && (
          <div className="settings-note">
            Hồ sơ hiện đang chờ{" "}
            <strong>
              {baseApprover}
            </strong>{" "}
            xử lý bước phê duyệt.
          </div>
        )}

      {status ===
        "Chờ ký" &&
        !canSign && (
          <div className="settings-note">
            Hồ sơ hiện đang chờ{" "}
            <strong>
              {currentSigner}
            </strong>{" "}
            ký duyệt.
          </div>
        )}

      {status ===
        "Đã thu hồi" && (
          <div className="reject-message">
            Hồ sơ trình ký này đã được
            người khởi tạo thu hồi.
          </div>
        )}

      {showCommentForm && (
        <div className="detail-card">
          <h2>
            Thêm ý kiến
          </h2>

          <div className="form-group">
            <textarea
              rows="4"
              value={
                commentText
              }
              placeholder="Nhập ý kiến..."
              onChange={(e) =>
                setCommentText(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setShowCommentForm(
                  false
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={
                handleAddComment
              }
            >
              Gửi ý kiến
            </button>
          </div>
        </div>
      )}

      {showRejectForm && (
        <div className="detail-card">
          <h2>
            Từ chối hồ sơ
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
              Xác nhận từ chối
            </button>
          </div>
        </div>
      )}

      {showDelegateForm && (
        <div className="detail-card">
          <h2>
            Ủy quyền ký
          </h2>

          <div className="form-group">
            <label>
              Người được ủy quyền
            </label>

            <select
              value={
                selectedDelegate
              }
              onChange={(e) =>
                setSelectedDelegate(
                  e.target.value
                )
              }
            >
              <option value="">
                Chọn người
              </option>

              {prototypeUsers
                .filter(
                  (user) =>
                    user !==
                    currentUser
                )
                .map(
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

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setShowDelegateForm(
                  false
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={
                handleDelegate
              }
            >
              Xác nhận ủy quyền
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
          Thông tin hồ sơ
        </h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Tên hồ sơ
            </span>

            <p>
              {approval.name}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người khởi tạo
            </span>

            <p>
              {
                approval.creator
              }
            </p>
          </div>

          <div>
            <span className="detail-label">
              Loại tài liệu
            </span>

            <p>
              {approval.documentType ||
                "Chưa có thông tin"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Mức độ ưu tiên
            </span>

            <p>
              {approval.priority ||
                "Bình thường"}
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
              Ngày cập nhật
            </span>

            <p>
              {
                approval.updatedAt
              }
            </p>
          </div>
        </div>
      </div>

      {/* LUỒNG */}

      <div className="detail-card">
        <h2>
          Luồng trình ký
        </h2>

        {workflow.map(
          (
            step,
            index
          ) => (
            <div
              key={
                step.id ||
                index
              }
              style={{
                border:
                  "1px solid #dbe3ee",

                borderRadius:
                  "10px",

                padding:
                  "16px",

                marginTop:
                  index === 0
                    ? 0
                    : "14px",

                background:
                  "#f9fbfd",
              }}
            >
              <div className="detail-grid">
                <div>
                  <span className="detail-label">
                    Bước{" "}
                    {index +
                      1}
                  </span>

                  <p>
                    <strong>
                      {step.name ||
                        `Bước ${
                          index +
                          1
                        }`}
                    </strong>
                  </p>
                </div>

                <div>
                  <span className="detail-label">
                    Loại bước
                  </span>

                  <p>
                    {step.flowType ||
                      "Tuần tự"}
                  </p>
                </div>
              </div>

              <table
                style={{
                  marginTop:
                    "12px",
                }}
              >
                <thead>
                  <tr>
                    <th>
                      Người xử lý
                    </th>

                    <th>
                      Loại xử lý
                    </th>

                    <th>
                      Phương thức ký
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(step.handlers ||
                    []).map(
                    (
                      handler
                    ) => (
                      <tr
                        key={
                          handler.id ||
                          `${handler.user}-${handler.actionType}`
                        }
                      >
                        <td>
                          {
                            handler.user
                          }
                        </td>

                        <td>
                          {
                            handler.actionType
                          }
                        </td>

                        <td>
                          {handler.actionType ===
                          "Ký duyệt"
                            ? handler.signatureMethod ||
                              approval.signatureMethod ||
                              "-"
                            : "-"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* VỊ TRÍ KÝ */}

      <div className="detail-card">
        <h2>
          Thiết lập ký
        </h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Người ký duyệt chính
            </span>

            <p>
              {baseSigner ||
                "-"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Phương thức ký
            </span>

            <p>
              {approval.signatureMethod ||
                workflowSignerHandler
                  ?.signatureMethod ||
                "-"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Trang ký
            </span>

            <p>
              {approval.signaturePosition
                ?.page
                ? `Trang ${approval.signaturePosition.page}`
                : "-"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Vị trí
            </span>

            <p>
              {approval.signaturePosition
                ? `X ${Math.round(
                    approval
                      .signaturePosition
                      .x
                  )}% - Y ${Math.round(
                    approval
                      .signaturePosition
                      .y
                  )}%`
                : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>
          Nội dung trình ký
        </h2>

        <p>
          {approval.description ||
            "Không có nội dung."}
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Tài liệu trình ký
        </h2>

        <div className="file-row">
          <div>
            <strong>
              {approval.fileName ||
                "Không có file"}
            </strong>

            {approval.fileSize && (
              <p>
                Dung lượng:{" "}
                {
                  approval.fileSize
                }
              </p>
            )}
          </div>

          <button
            onClick={
              handleDownload
            }
          >
            Tải xuống
          </button>
        </div>
      </div>

      {comments.length > 0 && (
        <div className="detail-card">
          <h2>
            Ý kiến xử lý
          </h2>

          <table>
            <thead>
              <tr>
                <th>
                  Người gửi
                </th>

                <th>
                  Nội dung
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

      {signature && (
        <div className="detail-card">
          <h2>
            Kết quả ký
          </h2>

          <div
            style={{
              border:
                "2px solid #16a34a",

              borderRadius:
                "10px",

              padding:
                "16px",

              marginBottom:
                "16px",

              background:
                "#f0fdf4",
            }}
          >
            <strong
              style={{
                color:
                  "#15803d",
                fontSize:
                  "18px",
              }}
            >
              ✓ ĐÃ KÝ SỐ
            </strong>

            <p>
              {
                signature.signer
              }
            </p>

            <p>
              {
                signature.method
              }
            </p>

            <p>
              {
                signature.signedAt
              }
            </p>
          </div>

          <div className="detail-grid">
            <div>
              <span className="detail-label">
                Người ký
              </span>

              <p>
                {
                  signature.signer
                }
              </p>
            </div>

            <div>
              <span className="detail-label">
                Phương thức
              </span>

              <p>
                {
                  signature.method
                }
              </p>
            </div>

            <div>
              <span className="detail-label">
                Trang ký
              </span>

              <p>
                Trang{" "}
                {
                  signature.page
                }
              </p>
            </div>

            <div>
              <span className="detail-label">
                Vị trí
              </span>

              <p>
                X{" "}
                {Math.round(
                  signature.x ??
                    0
                )}
                % - Y{" "}
                {Math.round(
                  signature.y ??
                    0
                )}
                %
              </p>
            </div>

            <div>
              <span className="detail-label">
                Thời gian ký
              </span>

              <p>
                {
                  signature.signedAt
                }
              </p>
            </div>

            <div>
              <span className="detail-label">
                Ủy quyền
              </span>

              <p>
                {signature.delegated
                  ? "Có"
                  : "Không"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="settings-note">
        <strong>
          Ghi chú prototype
        </strong>

        <p>
          Thao tác ký hiện đang mô phỏng,
          chưa tích hợp ký số thực tế.
        </p>
      </div>
    </div>
  )
}

export default ApprovalDetailPage