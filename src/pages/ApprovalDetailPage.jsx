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

  const defaultApprovals = [
    {
      id: "TK-0001",
      name: "Đề nghị mua sắm thiết bị",
      description:
        "Đề nghị phê duyệt kế hoạch mua sắm thiết bị phục vụ công việc.",
      documentType: "Khác",
      priority: "Bình thường",
      creator: "Nguyễn Văn A",
      approver: "Trần Thị B",
      signer: "Lê Văn C",
      updatedAt: "22/10/2026",
      status: "Chờ phê duyệt",
      fileName:
        "de-nghi-mua-sam-thiet-bi.pdf",
      fileSize: "2.1 MB",
      fileData: "",
      fileType: "application/pdf",
      signatureMethod:
        "VNPT Smart CA",
      signaturePosition: null,
    },
    {
      id: "TK-0002",
      name:
        "Quyết định điều động nhân sự",
      description:
        "Hồ sơ quyết định điều động nhân sự.",
      documentType: "Khác",
      priority: "Cao",
      creator: "Trần Thị B",
      approver: "Lê Văn C",
      signer: "Phạm Văn D",
      updatedAt: "21/10/2026",
      status: "Chờ ký",
      fileName:
        "quyet-dinh-dieu-dong.pdf",
      fileSize: "1.5 MB",
      fileData: "",
      fileType: "application/pdf",
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
      documentType: "Khác",
      priority: "Bình thường",
      creator: "Lê Văn C",
      approver: "Phạm Văn D",
      signer: "Phạm Văn D",
      updatedAt: "20/10/2026",
      status: "Hoàn tất",
      fileName:
        "ke-hoach-dao-tao.pdf",
      fileSize: "3.0 MB",
      fileData: "",
      fileType: "application/pdf",
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

  const savedWorkflowStates =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalWorkflowStates"
      )
    ) || {}

  const savedDelegatesRaw =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalDelegates"
      )
    ) || {}

  const signaturesRaw =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalSignatures"
      )
    ) || {}

  const rejectReasons =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalRejectReasons"
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

  const [
    comments,
    setComments,
  ] = useState(
    savedComments[id] || []
  )

  const [
    showOpinionForm,
    setShowOpinionForm,
  ] = useState(false)

  const [
    showRejectForm,
    setShowRejectForm,
  ] = useState(false)

  const [
    showDelegateForm,
    setShowDelegateForm,
  ] = useState(false)

  const [
    selectedHandler,
    setSelectedHandler,
  ] = useState(null)

  const [
    opinionText,
    setOpinionText,
  ] = useState("")

  const [
    rejectReason,
    setRejectReason,
  ] = useState("")

  const [
    selectedDelegate,
    setSelectedDelegate,
  ] = useState("")

  if (!approval) {
    return (
      <div>
        <h1>
          Không tìm thấy hồ sơ trình ký
        </h1>

        <button
          onClick={() =>
            navigate("/approval")
          }
        >
          ← Quay lại danh sách
        </button>
      </div>
    )
  }

  // =========================
  // WORKFLOW
  // =========================

  const getWorkflow = () => {
    if (
      Array.isArray(
        approval.approvalFlow
      ) &&
      approval.approvalFlow.length >
        0
    ) {
      return approval.approvalFlow.map(
        (step, index) => ({
          ...step,

          step:
            step.step ||
            index + 1,

          name:
            step.name ||
            `Bước ${index + 1}`,

          flowType:
            step.flowType ||
            "Tuần tự",

          handlers:
            Array.isArray(
              step.handlers
            )
              ? step.handlers
              : [],
        })
      )
    }

    const legacy = []

    if (approval.approver) {
      legacy.push({
        id: "legacy-control",
        step: 1,
        name: "Kiểm soát",
        flowType: "Tuần tự",

        handlers: [
          {
            id:
              "legacy-control-handler",

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

    if (approval.signer) {
      legacy.push({
        id: "legacy-sign",
        step:
          legacy.length + 1,

        name: "Ký duyệt",

        flowType: "Tuần tự",

        handlers: [
          {
            id:
              "legacy-sign-handler",

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

    return legacy
  }

  const workflow =
    getWorkflow()

  const flatHandlers =
    workflow.flatMap(
      (step) =>
        step.handlers
    )

  const sourceStatus =
    statusOverrides[id] ||
    approval.status ||
    "Đang xử lý"

  const normalizeTerminalStatus = (
    value
  ) => {
    if (
      value === "Hoàn tất"
    ) {
      return "Hoàn thành"
    }

    if (
      value === "Từ chối"
    ) {
      return "Bị từ chối"
    }

    return value
  }

  const createInitialHandlerStates =
    () => {
      const states = {}

      flatHandlers.forEach(
        (handler) => {
          states[handler.id] = {
            status: "pending",
          }
        }
      )

      const normalizedStatus =
        normalizeTerminalStatus(
          sourceStatus
        )

      if (
        normalizedStatus ===
        "Hoàn thành"
      ) {
        flatHandlers.forEach(
          (handler) => {
            states[
              handler.id
            ] = {
              status:
                "completed",
            }
          }
        )

        return states
      }

      if (
        sourceStatus ===
          "Chờ ký" ||
        sourceStatus ===
          "Đang phê duyệt"
      ) {
        const signerIndex =
          flatHandlers.findIndex(
            (handler) =>
              handler.actionType ===
              "Ký duyệt"
          )

        if (
          signerIndex > 0
        ) {
          flatHandlers
            .slice(
              0,
              signerIndex
            )
            .forEach(
              (handler) => {
                states[
                  handler.id
                ] = {
                  status:
                    "completed",
                }
              }
            )
        }
      }

      return states
    }

  const [
    handlerStates,
    setHandlerStates,
  ] = useState(
    savedWorkflowStates[id]
      ?.handlerStates ||
      createInitialHandlerStates()
  )

  const normalizeDelegates =
    () => {
      const raw =
        savedDelegatesRaw[id]

      if (!raw) {
        return {}
      }

      if (
        typeof raw ===
        "object"
      ) {
        return raw
      }

      const signer =
        flatHandlers.find(
          (handler) =>
            handler.actionType ===
            "Ký duyệt"
        )

      if (!signer) {
        return {}
      }

      return {
        [signer.id]: raw,
      }
    }

  const [
    delegates,
    setDelegates,
  ] = useState(
    normalizeDelegates()
  )

  const isCompleted = (
    handler
  ) =>
    handlerStates[
      handler.id
    ]?.status ===
    "completed"

  const isStepComplete = (
    step
  ) =>
    step.handlers.every(
      (handler) =>
        isCompleted(handler)
    )

  const currentStepIndex =
    workflow.findIndex(
      (step) =>
        !isStepComplete(step)
    )

  const getActiveHandlers =
    () => {
      if (
        currentStepIndex < 0
      ) {
        return []
      }

      const step =
        workflow[
          currentStepIndex
        ]

      const pending =
        step.handlers.filter(
          (handler) =>
            !isCompleted(
              handler
            )
        )

      if (
        step.flowType ===
        "Song song"
      ) {
        return pending
      }

      return pending.length > 0
        ? [pending[0]]
        : []
    }

  const activeHandlers =
    getActiveHandlers()

  const getEffectiveUser = (
    handler
  ) =>
    delegates[
      handler.id
    ] ||
    handler.user

  const deriveWorkflowStatus = (
    states =
      handlerStates
  ) => {
    const completed = (
      handler
    ) =>
      states[
        handler.id
      ]?.status ===
      "completed"

    const stepIndex =
      workflow.findIndex(
        (step) =>
          !step.handlers.every(
            (handler) =>
              completed(
                handler
              )
          )
      )

    if (stepIndex < 0) {
      return "Hoàn thành"
    }

    const step =
      workflow[stepIndex]

    const pending =
      step.handlers.filter(
        (handler) =>
          !completed(handler)
      )

    const active =
      step.flowType ===
      "Song song"
        ? pending
        : pending.slice(0, 1)

    const types = [
      ...new Set(
        active.map(
          (handler) =>
            handler.actionType
        )
      ),
    ]

    if (types.length !== 1) {
      return "Đang xử lý"
    }

    if (
      types[0] ===
      "Kiểm soát"
    ) {
      return "Đang kiểm soát"
    }

    if (
      types[0] ===
      "Tham mưu"
    ) {
      return "Đang tham mưu"
    }

    if (
      types[0] ===
      "Ký duyệt"
    ) {
      return "Đang phê duyệt"
    }

    return "Đang xử lý"
  }

  const normalizedSourceStatus =
    normalizeTerminalStatus(
      sourceStatus
    )

  const [
    status,
    setStatus,
  ] = useState(
    [
      "Hoàn thành",
      "Bị từ chối",
      "Đã thu hồi",
    ].includes(
      normalizedSourceStatus
    )
      ? normalizedSourceStatus
      : deriveWorkflowStatus()
  )

  const isTerminal =
    [
      "Hoàn thành",
      "Bị từ chối",
      "Đã thu hồi",
    ].includes(status)

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

    setStatus(newStatus)
  }

  const saveWorkflowState = (
    nextStates
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcApprovalWorkflowStates"
        )
      ) || {}

    current[id] = {
      handlerStates:
        nextStates,

      updatedAt:
        new Date().toLocaleString(
          "vi-VN"
        ),
    }

    localStorage.setItem(
      "hlcApprovalWorkflowStates",
      JSON.stringify(current)
    )

    setHandlerStates(
      nextStates
    )
  }

  const saveComments = (
    nextComments
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcApprovalComments"
        )
      ) || {}

    current[id] =
      nextComments

    localStorage.setItem(
      "hlcApprovalComments",
      JSON.stringify(current)
    )

    setComments(
      nextComments
    )
  }

  const appendComment = (
    content
  ) => {
    saveComments([
      ...comments,
      {
        author:
          currentUser,

        content,

        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      },
    ])
  }

  // =========================
  // USER
  // =========================

  const handleChangePrototypeUser = (
    event
  ) => {
    const user =
      event.target.value

    setCurrentUser(user)

    localStorage.setItem(
      "hlcPrototypeUser",
      user
    )

    setShowOpinionForm(
      false
    )
    setShowRejectForm(
      false
    )
    setShowDelegateForm(
      false
    )
  }

  // =========================
  // PROCESS
  // =========================

  const openOpinionForm = (
    handler
  ) => {
    setSelectedHandler(
      handler
    )

    setOpinionText("")
    setShowOpinionForm(
      true
    )
  }

  const handleCompleteAction =
    () => {
      if (
        !selectedHandler
      ) {
        return
      }

      const isActive =
        activeHandlers.some(
          (handler) =>
            handler.id ===
            selectedHandler.id
        )

      if (!isActive) {
        window.alert(
          "Người xử lý này chưa đến lượt."
        )
        return
      }

      if (
        getEffectiveUser(
          selectedHandler
        ) !== currentUser
      ) {
        window.alert(
          "Bạn không phải người đang được phân công xử lý bước này."
        )
        return
      }

      const nextStates = {
        ...handlerStates,

        [selectedHandler.id]: {
          status:
            "completed",

          actionBy:
            currentUser,

          actionAt:
            new Date().toLocaleString(
              "vi-VN"
            ),

          opinion:
            opinionText.trim(),
        },
      }

      saveWorkflowState(
        nextStates
      )

      const nextStatus =
        deriveWorkflowStatus(
          nextStates
        )

      saveStatus(
        nextStatus
      )

      const actionLabel =
        selectedHandler.actionType ===
        "Kiểm soát"
          ? "Đã phê duyệt kiểm soát"
          : "Đã gửi ý kiến tham mưu"

      appendComment(
        opinionText.trim()
          ? `${actionLabel}: ${opinionText.trim()}`
          : `${actionLabel}.`
      )

      setOpinionText("")
      setSelectedHandler(null)
      setShowOpinionForm(
        false
      )
    }

  const openRejectForm = (
    handler
  ) => {
    setSelectedHandler(
      handler
    )
    setRejectReason("")
    setShowRejectForm(
      true
    )
  }

  const handleReject = () => {
    if (
      !selectedHandler ||
      !rejectReason.trim()
    ) {
      return
    }

    const isActive =
      activeHandlers.some(
        (handler) =>
          handler.id ===
          selectedHandler.id
      )

    if (
      !isActive ||
      getEffectiveUser(
        selectedHandler
      ) !== currentUser
    ) {
      return
    }

    const nextStates = {
      ...handlerStates,

      [selectedHandler.id]: {
        status:
          "rejected",

        actionBy:
          currentUser,

        actionAt:
          new Date().toLocaleString(
            "vi-VN"
          ),

        opinion:
          rejectReason.trim(),
      },
    }

    saveWorkflowState(
      nextStates
    )

    saveStatus(
      "Bị từ chối"
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

    appendComment(
      `Từ chối trình ký: ${rejectReason.trim()}`
    )

    setRejectReason("")
    setSelectedHandler(null)
    setShowRejectForm(
      false
    )
  }

  // =========================
  // DELEGATE
  // =========================

  const openDelegateForm = (
    handler
  ) => {
    setSelectedHandler(
      handler
    )
    setSelectedDelegate("")
    setShowDelegateForm(
      true
    )
  }

  const handleDelegate = () => {
    if (
      !selectedHandler ||
      !selectedDelegate
    ) {
      return
    }

    if (
      selectedHandler.actionType !==
        "Ký duyệt" ||
      selectedHandler.user !==
        currentUser
    ) {
      return
    }

    const nextDelegates = {
      ...delegates,

      [selectedHandler.id]:
        selectedDelegate,
    }

    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcApprovalDelegates"
        )
      ) || {}

    current[id] =
      nextDelegates

    localStorage.setItem(
      "hlcApprovalDelegates",
      JSON.stringify(
        current
      )
    )

    setDelegates(
      nextDelegates
    )

    appendComment(
      `Đã ủy quyền bước ký cho ${selectedDelegate}.`
    )

    setSelectedHandler(null)
    setSelectedDelegate("")
    setShowDelegateForm(
      false
    )
  }

  // =========================
  // WITHDRAW
  // =========================

  const completedCount =
    Object.values(
      handlerStates
    ).filter(
      (state) =>
        state.status ===
        "completed"
    ).length

  const canWithdraw =
    currentUser ===
      approval.creator &&
    completedCount === 0 &&
    !isTerminal

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

    appendComment(
      "Đã thu hồi hồ sơ trình ký."
    )
  }

  // =========================
  // FILE
  // =========================

  const handleDownload = () => {
    if (!approval.fileData) {
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
  // VIEW HELPERS
  // =========================

  const getHandlerStatusText = (
    handler,
    stepIndex
  ) => {
    const state =
      handlerStates[
        handler.id
      ]

    if (
      state?.status ===
      "completed"
    ) {
      return "Đã xử lý"
    }

    if (
      state?.status ===
      "rejected"
    ) {
      return "Bị từ chối"
    }

    const active =
      activeHandlers.some(
        (item) =>
          item.id ===
          handler.id
      )

    if (active) {
      return "Đang chờ xử lý"
    }

    if (
      stepIndex >
      currentStepIndex
    ) {
      return "Chưa đến bước"
    }

    return "Chưa đến lượt"
  }

  const getStepStatus = (
    step,
    index
  ) => {
    if (
      isStepComplete(step)
    ) {
      return "Hoàn thành"
    }

    if (
      index ===
      currentStepIndex &&
      !isTerminal
    ) {
      return "Đang xử lý"
    }

    return "Chưa xử lý"
  }

  const getStatusClass = (
    value = status
  ) => {
    if (
      value ===
        "Hoàn thành" ||
      value ===
        "Hoàn tất" ||
      value ===
        "Đã xử lý"
    ) {
      return "status processing"
    }

    if (
      value ===
        "Bị từ chối" ||
      value ===
        "Đã thu hồi"
    ) {
      return "status rejected"
    }

    if (
      value ===
        "Đang kiểm soát" ||
      value ===
        "Đang tham mưu" ||
      value ===
        "Đang phê duyệt" ||
      value ===
        "Đang xử lý" ||
      value ===
        "Đang chờ xử lý"
    ) {
      return "status waiting"
    }

    return "status pending"
  }

  const signatureList =
    Array.isArray(
      signaturesRaw[id]
    )
      ? signaturesRaw[id]
      : signaturesRaw[id]
        ? [
            signaturesRaw[
              id
            ],
          ]
        : []

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

          {approval.fileData && (
            <button
              className="secondary-button"
              onClick={
                handleDownload
              }
            >
              Tải tài liệu
            </button>
          )}
        </div>
      </div>

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

        <div className="settings-note">
          Đang thao tác với tư cách{" "}
          <strong>
            {currentUser}
          </strong>
          .
        </div>
      </div>

      <div className="detail-card">
        <h2>
          Thông tin trình ký
        </h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Nội dung
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
              {approval.creator}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Loại tài liệu
            </span>

            <p>
              {approval.documentType ||
                "-"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Mức độ ưu tiên
            </span>

            <p>
              <strong>
                {approval.priority ||
                  "Bình thường"}
              </strong>
            </p>
          </div>

          <div>
            <span className="detail-label">
              Trạng thái
            </span>

            <p>
              <span
                className={getStatusClass()}
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
              {approval.updatedAt}
            </p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>
          Mô tả
        </h2>

        <p>
          {approval.description ||
            "Không có mô tả."}
        </p>
      </div>

      {approval.fileName && (
        <div className="detail-card">
          <h2>
            Tài liệu đính kèm
          </h2>

          <div className="file-row">
            <div>
              <strong>
                {
                  approval.fileName
                }
              </strong>

              {approval.fileSize && (
                <p>
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
      )}

      {/* WORKFLOW */}

      <div className="detail-card">
        <h2>
          Quy trình phê duyệt
        </h2>

        <div className="settings-note">
          Các bước chạy từ trên xuống.
          Trong bước{" "}
          <strong>
            Tuần tự
          </strong>
          , người xử lý làm lần lượt.
          Trong bước{" "}
          <strong>
            Song song
          </strong>
          , các người xử lý trong bước
          có thể thực hiện cùng lúc.
        </div>

        {workflow.map(
          (
            step,
            stepIndex
          ) => (
            <div
              key={step.id}
              style={{
                marginTop:
                  "18px",
                padding:
                  "16px",
                border:
                  "1px solid #e5e7eb",
                borderRadius:
                  "10px",
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  gap: "12px",
                  alignItems:
                    "center",
                  marginBottom:
                    "12px",
                }}
              >
                <div>
                  <strong>
                    Bước{" "}
                    {stepIndex +
                      1}
                    :{" "}
                    {step.name ||
                      `Bước ${stepIndex + 1}`}
                  </strong>

                  <div
                    style={{
                      marginTop:
                        "4px",
                      color:
                        "#6b7280",
                    }}
                  >
                    Cách xử lý:{" "}
                    <strong>
                      {
                        step.flowType
                      }
                    </strong>
                  </div>
                </div>

                <span
                  className={getStatusClass(
                    getStepStatus(
                      step,
                      stepIndex
                    )
                  )}
                >
                  {getStepStatus(
                    step,
                    stepIndex
                  )}
                </span>
              </div>

              <div className="document-table">
                <table>
                  <thead>
                    <tr>
                      <th>
                        Người xử lý
                      </th>

                      <th>
                        Vai trò
                      </th>

                      <th>
                        Phương thức ký
                      </th>

                      <th>
                        Trạng thái
                      </th>

                      <th>
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {step.handlers.map(
                      (handler) => {
                        const active =
                          activeHandlers.some(
                            (
                              item
                            ) =>
                              item.id ===
                              handler.id
                          )

                        const effectiveUser =
                          getEffectiveUser(
                            handler
                          )

                        const canAct =
                          active &&
                          !isTerminal &&
                          effectiveUser ===
                            currentUser

                        const canReject =
                          canAct &&
                          [
                            "Kiểm soát",
                            "Ký duyệt",
                          ].includes(
                            handler.actionType
                          )

                        const canDelegate =
                          canAct &&
                          handler.actionType ===
                            "Ký duyệt" &&
                          handler.user ===
                            currentUser &&
                          !delegates[
                            handler.id
                          ]

                        return (
                          <tr
                            key={
                              handler.id
                            }
                          >
                            <td>
                              <strong>
                                {
                                  handler.user
                                }
                              </strong>

                              {delegates[
                                handler.id
                              ] && (
                                <div
                                  style={{
                                    marginTop:
                                      "4px",
                                    color:
                                      "#6b7280",
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  Ủy quyền cho:{" "}
                                  <strong>
                                    {
                                      delegates[
                                        handler
                                          .id
                                      ]
                                    }
                                  </strong>
                                </div>
                              )}
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
                                  "Chưa thiết lập"
                                : "-"}
                            </td>

                            <td>
                              <span
                                className={getStatusClass(
                                  getHandlerStatusText(
                                    handler,
                                    stepIndex
                                  )
                                )}
                              >
                                {getHandlerStatusText(
                                  handler,
                                  stepIndex
                                )}
                              </span>
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
                                {canAct &&
                                  handler.actionType ===
                                    "Kiểm soát" && (
                                    <button
                                      className="primary-button"
                                      onClick={() =>
                                        openOpinionForm(
                                          handler
                                        )
                                      }
                                    >
                                      Phê duyệt
                                    </button>
                                  )}

                                {canAct &&
                                  handler.actionType ===
                                    "Tham mưu" && (
                                    <button
                                      className="primary-button"
                                      onClick={() =>
                                        openOpinionForm(
                                          handler
                                        )
                                      }
                                    >
                                      Gửi tham mưu
                                    </button>
                                  )}

                                {canAct &&
                                  handler.actionType ===
                                    "Ký duyệt" && (
                                    <button
                                      className="primary-button"
                                      onClick={() =>
                                        navigate(
                                          `/approval/${id}/sign`
                                        )
                                      }
                                    >
                                      Ký duyệt
                                    </button>
                                  )}

                                {canReject && (
                                  <button
                                    className="reject-button"
                                    onClick={() =>
                                      openRejectForm(
                                        handler
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
                                      openDelegateForm(
                                        handler
                                      )
                                    }
                                  >
                                    Ủy quyền
                                  </button>
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
            </div>
          )
        )}
      </div>

      {/* OPINION */}

      {showOpinionForm &&
        selectedHandler && (
          <div className="detail-card">
            <h2>
              {selectedHandler.actionType ===
              "Kiểm soát"
                ? "Ý kiến kiểm soát"
                : "Ý kiến tham mưu"}
            </h2>

            <div className="form-group">
              <label>
                Nội dung ý kiến
              </label>

              <textarea
                rows="4"
                placeholder="Nhập ý kiến nếu có..."
                value={
                  opinionText
                }
                onChange={(e) =>
                  setOpinionText(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-actions">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowOpinionForm(
                    false
                  )
                  setSelectedHandler(
                    null
                  )
                  setOpinionText(
                    ""
                  )
                }}
              >
                Hủy
              </button>

              <button
                className="primary-button"
                onClick={
                  handleCompleteAction
                }
              >
                {selectedHandler.actionType ===
                "Kiểm soát"
                  ? "Xác nhận phê duyệt"
                  : "Gửi ý kiến"}
              </button>
            </div>
          </div>
        )}

      {/* REJECT */}

      {showRejectForm &&
        selectedHandler && (
          <div className="detail-card">
            <h2>
              Từ chối trình ký
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
                placeholder="Nhập lý do từ chối..."
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
                  setSelectedHandler(
                    null
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

      {/* DELEGATE */}

      {showDelegateForm &&
        selectedHandler && (
          <div className="detail-card">
            <h2>
              Ủy quyền ký
            </h2>

            <div className="form-group">
              <label>
                Người được ủy quyền *
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
                onClick={() => {
                  setShowDelegateForm(
                    false
                  )
                  setSelectedHandler(
                    null
                  )
                  setSelectedDelegate(
                    ""
                  )
                }}
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
        "Bị từ chối" &&
        rejectReasons[id] && (
          <div className="reject-message">
            <strong>
              Lý do từ chối:
            </strong>{" "}
            {rejectReasons[id]}
          </div>
        )}

      {signatureList.length >
        0 && (
        <div className="detail-card">
          <h2>
            Lịch sử ký duyệt
          </h2>

          <table>
            <thead>
              <tr>
                <th>
                  Người ký
                </th>

                <th>
                  Phương thức
                </th>

                <th>
                  Thời gian
                </th>
              </tr>
            </thead>

            <tbody>
              {signatureList.map(
                (
                  signature,
                  index
                ) => (
                  <tr key={index}>
                    <td>
                      {
                        signature.signer
                      }
                    </td>

                    <td>
                      {
                        signature.method
                      }
                    </td>

                    <td>
                      {
                        signature.signedAt
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="detail-card">
        <h2>
          Lịch sử xử lý
        </h2>

        {comments.length ===
        0 ? (
          <p>
            Chưa có lịch sử xử lý.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  Người thực hiện
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
        )}
      </div>
    </div>
  )
}

export default ApprovalDetailPage