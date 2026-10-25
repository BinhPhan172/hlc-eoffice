import { useState } from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

function ServiceRequestDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const prototypeRoles = [
    {
      value: "requester",
      label: "Người yêu cầu",
    },
    {
      value: "dispatcher",
      label: "Điều phối viên",
    },
    {
      value: "handler",
      label: "Người xử lý",
    },
  ]

  const savedPrototypeRole =
    localStorage.getItem(
      "hlcServiceRequestPrototypeRole"
    ) || "requester"

  const [
    currentRole,
    setCurrentRole,
  ] = useState(
    savedPrototypeRole
  )

  const defaultRequests = [
    {
      id: "SR-0001",
      title:
        "Cấp quyền sử dụng phần mềm",
      category: "CNTT",
      priority: "Cao",
      requester:
        "Nguyễn Văn A",
      description:
        "Yêu cầu cấp quyền sử dụng phần mềm phục vụ công việc.",
      updatedAt:
        "22/10/2026",
      status:
        "Chờ tiếp nhận",
      handlerName: "",
      handlerDepartment: "",
      fileName: "",
      fileSize: "",
      fileData: "",
    },

    {
      id: "SR-0002",
      title:
        "Hỗ trợ sửa máy in",
      category: "CNTT",
      priority: "Khẩn",
      requester:
        "Trần Thị B",
      description:
        "Máy in tại phòng làm việc không thể in tài liệu.",
      updatedAt:
        "21/10/2026",
      status:
        "Đang xử lý",
      handlerName:
        "Nguyễn Văn A",
      handlerDepartment:
        "Phòng CNTT",
      fileName: "",
      fileSize: "",
      fileData: "",
    },

    {
      id: "SR-0003",
      title:
        "Yêu cầu cấp văn phòng phẩm",
      category:
        "Hành chính",
      priority:
        "Bình thường",
      requester:
        "Lê Văn C",
      description:
        "Yêu cầu bổ sung văn phòng phẩm phục vụ công việc.",
      updatedAt:
        "20/10/2026",
      status:
        "Hoàn thành",
      handlerName:
        "Phạm Văn D",
      handlerDepartment:
        "Phòng Hành chính",
      fileName: "",
      fileSize: "",
      fileData: "",
    },
  ]

  const savedRequests =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequests"
      )
    ) || []

  const statusOverrides =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequestStatus"
      )
    ) || {}

  const assignments =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequestAssignments"
      )
    ) || {}

  const results =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequestResults"
      )
    ) || {}

  const rejectReasons =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequestRejectReasons"
      )
    ) || {}

  const evaluations =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequestEvaluations"
      )
    ) || {}

  const routingList =
    JSON.parse(
      localStorage.getItem(
        "hlcRequestRouting"
      )
    ) || []

  const storedSupplements =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequestSupplements"
      )
    ) || {}

  const storedComments =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequestComments"
      )
    ) || {}

  const allRequests = [
    ...defaultRequests,
    ...savedRequests,
  ]

  const request =
    allRequests.find(
      (item) =>
        item.id === id
    )

  const normalizeStatus = (
    value
  ) => {
    if (
      value === "Hoàn tất" ||
      value === "Chờ đánh giá"
    ) {
      return "Hoàn thành"
    }

    if (
      value === "Từ chối"
    ) {
      return "Đã từ chối"
    }

    if (
      value === "Chờ bổ sung"
    ) {
      return "Chờ bổ sung thông tin"
    }

    if (
      value === "Chờ phân công"
    ) {
      return "Chờ tiếp nhận"
    }

    return value
  }

  const routingConfig =
    request
      ? routingList.find(
          (item) =>
            item.category ===
            request.category
        )
      : null

  const suggestedHandler =
    routingConfig?.handler ||
    ""

  const splitHandlerText = (
    value
  ) => {
    if (
      !value ||
      typeof value !==
        "string"
    ) {
      return {
        name: "",
        department: "",
      }
    }

    const parts =
      value.split(" - ")

    if (
      parts.length >= 2
    ) {
      return {
        name:
          parts[0].trim(),

        department:
          parts
            .slice(1)
            .join(" - ")
            .trim(),
      }
    }

    return {
      name:
        value.trim(),
      department: "",
    }
  }

  const normalizeAssignment = (
    raw
  ) => {
    if (!raw) {
      return {
        name: "",
        department: "",
      }
    }

    if (
      typeof raw ===
      "object"
    ) {
      return {
        name:
          raw.name || "",
        department:
          raw.department ||
          "",
      }
    }

    return splitHandlerText(
      raw
    )
  }

  const savedAssignment =
    normalizeAssignment(
      assignments[id]
    )

  const legacyHandler =
    splitHandlerText(
      request?.handler || ""
    )

  const resultHandler =
    splitHandlerText(
      results[id]
        ?.responder || ""
    )

  const initialHandler = {
    name:
      savedAssignment.name ||
      request?.handlerName ||
      legacyHandler.name ||
      resultHandler.name ||
      "",

    department:
      savedAssignment.department ||
      request
        ?.handlerDepartment ||
      legacyHandler.department ||
      resultHandler.department ||
      "",
  }

  const [
    status,
    setStatus,
  ] = useState(
    request
      ? normalizeStatus(
          statusOverrides[id] ||
            request.status
        )
      : ""
  )

  const [
    handler,
    setHandler,
  ] = useState(
    initialHandler
  )

  const [
    selectedHandlerName,
    setSelectedHandlerName,
  ] = useState(
    initialHandler.name
  )

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState(
    initialHandler.department
  )

  const [
    rejectReason,
    setRejectReason,
  ] = useState("")

  const [
    supplementReason,
    setSupplementReason,
  ] = useState("")

  const [
    supplementContent,
    setSupplementContent,
  ] = useState("")

  const [
    resultText,
    setResultText,
  ] = useState(
    results[id]?.content ||
      ""
  )

  const [
    evaluationText,
    setEvaluationText,
  ] = useState(
    evaluations[id]?.content ||
      ""
  )

  const [
    commentText,
    setCommentText,
  ] = useState("")

  const [
    supplements,
    setSupplements,
  ] = useState(
    storedSupplements[id] ||
      []
  )

  const [
    comments,
    setComments,
  ] = useState(
    storedComments[id] ||
      []
  )

  const [
    showAssignForm,
    setShowAssignForm,
  ] = useState(false)

  const [
    showRejectForm,
    setShowRejectForm,
  ] = useState(false)

  const [
    showRequestSupplementForm,
    setShowRequestSupplementForm,
  ] = useState(false)

  const [
    showSupplementForm,
    setShowSupplementForm,
  ] = useState(false)

  const [
    showResultForm,
    setShowResultForm,
  ] = useState(false)

  const [
    showEvaluationForm,
    setShowEvaluationForm,
  ] = useState(false)

  const [
    showCommentForm,
    setShowCommentForm,
  ] = useState(false)

  if (!request) {
    return (
      <div>
        <h1>
          Không tìm thấy yêu cầu
        </h1>

        <button
          onClick={() =>
            navigate(
              "/service-requests"
            )
          }
        >
          ← Quay lại danh sách
        </button>
      </div>
    )
  }

  const formatHandler = (
    assignment
  ) => {
    if (
      assignment.name &&
      assignment.department
    ) {
      return `${assignment.name} - ${assignment.department}`
    }

    if (
      assignment.name
    ) {
      return assignment.name
    }

    return ""
  }

  const handlerDisplay =
    formatHandler(handler)

  const saveStatus = (
    newStatus
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestStatus"
        )
      ) || {}

    current[id] =
      newStatus

    localStorage.setItem(
      "hlcServiceRequestStatus",
      JSON.stringify(
        current
      )
    )

    setStatus(newStatus)
  }

  const saveAssignment = (
    name,
    department
  ) => {
    const assignment = {
      name: name.trim(),
      department:
        department.trim(),
    }

    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestAssignments"
        )
      ) || {}

    current[id] =
      assignment

    localStorage.setItem(
      "hlcServiceRequestAssignments",
      JSON.stringify(
        current
      )
    )

    const currentRequests =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequests"
        )
      ) || []

    const updatedRequests =
      currentRequests.map(
        (item) =>
          item.id === id
            ? {
                ...item,

                handlerName:
                  assignment.name,

                handlerDepartment:
                  assignment.department,
              }
            : item
      )

    localStorage.setItem(
      "hlcServiceRequests",
      JSON.stringify(
        updatedRequests
      )
    )

    setHandler(
      assignment
    )
  }

  const saveSupplements = (
    next
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestSupplements"
        )
      ) || {}

    current[id] = next

    localStorage.setItem(
      "hlcServiceRequestSupplements",
      JSON.stringify(
        current
      )
    )

    setSupplements(next)
  }

  const saveComments = (
    next
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestComments"
        )
      ) || {}

    current[id] = next

    localStorage.setItem(
      "hlcServiceRequestComments",
      JSON.stringify(
        current
      )
    )

    setComments(next)
  }

  const handleRoleChange = (
    event
  ) => {
    const role =
      event.target.value

    setCurrentRole(role)

    localStorage.setItem(
      "hlcServiceRequestPrototypeRole",
      role
    )
  }

  // =========================
  // ĐIỀU PHỐI
  // =========================

  const handleAssign = () => {
    if (
      !selectedHandlerName.trim() ||
      !selectedDepartment.trim()
    ) {
      window.alert(
        "Vui lòng nhập đầy đủ người xử lý và phòng ban / đơn vị."
      )

      return
    }

    saveAssignment(
      selectedHandlerName,
      selectedDepartment
    )

    saveStatus(
      "Đã phân công"
    )

    setShowAssignForm(false)
  }

  const handleReject = () => {
    if (
      !rejectReason.trim()
    ) {
      return
    }

    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestRejectReasons"
        )
      ) || {}

    current[id] =
      rejectReason.trim()

    localStorage.setItem(
      "hlcServiceRequestRejectReasons",
      JSON.stringify(
        current
      )
    )

    saveStatus(
      "Đã từ chối"
    )

    setRejectReason("")
    setShowRejectForm(false)
  }

  // =========================
  // NGƯỜI XỬ LÝ
  // =========================

  const handleHandlerAccept =
    () => {
      saveStatus(
        "Đang xử lý"
      )

      saveComments([
        ...comments,
        {
          author:
            handlerDisplay ||
            "Người xử lý",

          content:
            "Đã tiếp nhận yêu cầu.",

          date:
            new Date().toLocaleString(
              "vi-VN"
            ),
        },
      ])
    }

  const handleRequestSupplement =
    () => {
      if (
        !supplementReason.trim()
      ) {
        return
      }

      const newItem = {
        type:
          "request",

        author:
          handlerDisplay ||
          "Người xử lý",

        content:
          supplementReason.trim(),

        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      }

      saveSupplements([
        ...supplements,
        newItem,
      ])

      saveStatus(
        "Chờ bổ sung thông tin"
      )

      setSupplementReason("")

      setShowRequestSupplementForm(
        false
      )
    }

  const handleAddComment =
    () => {
      if (
        !commentText.trim()
      ) {
        return
      }

      saveComments([
        ...comments,
        {
          author:
            handlerDisplay ||
            "Người xử lý",

          content:
            commentText.trim(),

          date:
            new Date().toLocaleString(
              "vi-VN"
            ),
        },
      ])

      setCommentText("")

      setShowCommentForm(false)
    }

  const handleSubmitResult =
    () => {
      if (
        !resultText.trim()
      ) {
        return
      }

      const current =
        JSON.parse(
          localStorage.getItem(
            "hlcServiceRequestResults"
          )
        ) || {}

      current[id] = {
        content:
          resultText.trim(),

        responder:
          handlerDisplay ||
          "Người xử lý",

        respondedAt:
          new Date().toLocaleString(
            "vi-VN"
          ),
      }

      localStorage.setItem(
        "hlcServiceRequestResults",
        JSON.stringify(
          current
        )
      )

      saveStatus(
        "Hoàn thành"
      )

      setShowResultForm(
        false
      )
    }

  // =========================
  // NGƯỜI YÊU CẦU
  // =========================

  const handleSupplement =
    () => {
      if (
        !supplementContent.trim()
      ) {
        return
      }

      const newItem = {
        type:
          "response",

        author:
          request.requester,

        content:
          supplementContent.trim(),

        date:
          new Date().toLocaleString(
            "vi-VN"
          ),
      }

      saveSupplements([
        ...supplements,
        newItem,
      ])

      saveStatus(
        handlerDisplay
          ? "Đang xử lý"
          : "Chờ tiếp nhận"
      )

      setSupplementContent("")

      setShowSupplementForm(
        false
      )
    }

  const handleEvaluation =
    () => {
      const current =
        JSON.parse(
          localStorage.getItem(
            "hlcServiceRequestEvaluations"
          )
        ) || {}

      current[id] = {
        content:
          evaluationText.trim() ||
          "Đã ghi nhận đánh giá.",

        evaluator:
          request.requester,

        evaluatedAt:
          new Date().toLocaleString(
            "vi-VN"
          ),
      }

      localStorage.setItem(
        "hlcServiceRequestEvaluations",
        JSON.stringify(
          current
        )
      )

      setShowEvaluationForm(
        false
      )

      window.alert(
        "Đã ghi nhận đánh giá."
      )
    }

  const handleDownload =
    () => {
      if (!request.fileData) {
        window.alert(
          "Yêu cầu này chưa có dữ liệu file để tải xuống."
        )

        return
      }

      const link =
        document.createElement(
          "a"
        )

      link.href =
        request.fileData

      link.download =
        request.fileName ||
        "tep-dinh-kem"

      document.body.appendChild(
        link
      )

      link.click()

      document.body.removeChild(
        link
      )
    }

  const isRequester =
    currentRole ===
    "requester"

  const isDispatcher =
    currentRole ===
    "dispatcher"

  const isHandler =
    currentRole ===
    "handler"

  const currentRoleLabel =
    prototypeRoles.find(
      (role) =>
        role.value ===
        currentRole
    )?.label || ""

  const savedResult =
    results[id]

  const savedEvaluation =
    evaluations[id]

  const getStatusClass =
    () => {
      if (
        status ===
        "Hoàn thành"
      ) {
        return "status processing"
      }

      if (
        status ===
          "Đang xử lý" ||
        status ===
          "Đã phân công"
      ) {
        return "status waiting"
      }

      if (
        status ===
        "Đã từ chối"
      ) {
        return "status rejected"
      }

      return "status pending"
    }

  const getPriorityStyle =
    () => {
      if (
        request.priority ===
        "Khẩn"
      ) {
        return {
          color: "#b91c1c",
          fontWeight: "700",
        }
      }

      if (
        request.priority ===
        "Cao"
      ) {
        return {
          color: "#c2410c",
          fontWeight: "700",
        }
      }

      return {
        fontWeight: "600",
      }
    }

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            "/service-requests"
          )
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header detail-header-actions">
        <div>
          <h1>
            Chi tiết yêu cầu
          </h1>

          <p>
            Mã yêu cầu:{" "}
            {request.id}
          </p>
        </div>

        <div className="detail-action-buttons">
          {isDispatcher &&
            status ===
              "Chờ tiếp nhận" && (
              <>
                <button
                  className="primary-button"
                  onClick={() =>
                    setShowAssignForm(
                      true
                    )
                  }
                >
                  Phân công xử lý
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
              </>
            )}

          {isHandler &&
            status ===
              "Đã phân công" && (
              <button
                className="accept-button"
                onClick={
                  handleHandlerAccept
                }
              >
                Tiếp nhận yêu cầu
              </button>
            )}

          {isHandler &&
            status ===
              "Đang xử lý" && (
              <>
                <button
                  className="secondary-button"
                  onClick={() =>
                    setShowRequestSupplementForm(
                      true
                    )
                  }
                >
                  Yêu cầu bổ sung
                </button>

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

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowResultForm(
                      true
                    )
                  }
                >
                  Phản hồi kết quả
                </button>
              </>
            )}

          {isRequester &&
            status ===
              "Chờ bổ sung thông tin" && (
              <button
                className="primary-button"
                onClick={() =>
                  setShowSupplementForm(
                    true
                  )
                }
              >
                Bổ sung thông tin
              </button>
            )}

          {isRequester &&
            status ===
              "Hoàn thành" &&
            !savedEvaluation && (
              <button
                className="secondary-button"
                onClick={() =>
                  setShowEvaluationForm(
                    true
                  )
                }
              >
                Đánh giá kết quả
              </button>
            )}
        </div>
      </div>

      {/* ROLE */}

      <div className="detail-card">
        <h2>
          Vai trò mô phỏng
        </h2>

        <p>
          Chọn actor đang thao tác để
          kiểm thử luồng nghiệp vụ.
        </p>

        <div className="form-group">
          <label>
            Vai trò đang thao tác
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

        <div className="settings-note">
          Đang mô phỏng:{" "}
          <strong>
            {currentRoleLabel}
          </strong>
        </div>
      </div>

      {/* FLOW NOTICE */}

      {status ===
        "Chờ tiếp nhận" && (
        <div className="settings-note">
          Yêu cầu đang chờ{" "}
          <strong>
            Điều phối viên
          </strong>{" "}
          kiểm tra để phân công hoặc từ
          chối.
        </div>
      )}

      {status ===
        "Đã phân công" && (
        <div className="settings-note">
          Đã phân công cho{" "}
          <strong>
            {handlerDisplay ||
              "Người xử lý"}
          </strong>
          . Yêu cầu đang chờ Người xử lý
          tiếp nhận.
        </div>
      )}

      {status ===
        "Đang xử lý" && (
        <div className="settings-note">
          Người phụ trách xử lý:{" "}
          <strong>
            {handlerDisplay ||
              "Chưa xác định"}
          </strong>
        </div>
      )}

      {status ===
        "Chờ bổ sung thông tin" && (
        <div className="settings-note">
          Yêu cầu đang chờ{" "}
          <strong>
            Người yêu cầu
          </strong>{" "}
          bổ sung thông tin.
        </div>
      )}

      {/* PHÂN CÔNG */}

      {showAssignForm && (
        <div className="detail-card">
          <h2>
            Phân công người xử lý
          </h2>

          {suggestedHandler && (
            <div className="success-message">
              Định tuyến đề xuất:{" "}
              <strong>
                {suggestedHandler}
              </strong>
            </div>
          )}

          <div className="form-group">
            <label>
              Người xử lý *
            </label>

            <input
              type="text"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={
                selectedHandlerName
              }
              onChange={(e) =>
                setSelectedHandlerName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Phòng ban / đơn vị *
            </label>

            <input
              type="text"
              placeholder="Ví dụ: Phòng CNTT"
              value={
                selectedDepartment
              }
              onChange={(e) =>
                setSelectedDepartment(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setShowAssignForm(
                  false
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={
                handleAssign
              }
            >
              Xác nhận phân công
            </button>
          </div>
        </div>
      )}

      {/* TỪ CHỐI */}

      {showRejectForm && (
        <div className="detail-card">
          <h2>
            Từ chối yêu cầu
          </h2>

          <div className="form-group">
            <label>
              Lý do từ chối *
            </label>

            <textarea
              rows="4"
              value={rejectReason}
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

      {/* YÊU CẦU BỔ SUNG */}

      {showRequestSupplementForm && (
        <div className="detail-card">
          <h2>
            Yêu cầu bổ sung thông tin
          </h2>

          <div className="form-group">
            <label>
              Nội dung cần bổ sung *
            </label>

            <textarea
              rows="4"
              value={
                supplementReason
              }
              placeholder="Nhập thông tin cần CBNV bổ sung..."
              onChange={(e) =>
                setSupplementReason(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setShowRequestSupplementForm(
                  false
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={
                handleRequestSupplement
              }
            >
              Gửi yêu cầu bổ sung
            </button>
          </div>
        </div>
      )}

      {/* CBNV BỔ SUNG */}

      {showSupplementForm && (
        <div className="detail-card">
          <h2>
            Bổ sung thông tin
          </h2>

          <div className="form-group">
            <label>
              Nội dung bổ sung *
            </label>

            <textarea
              rows="5"
              value={
                supplementContent
              }
              placeholder="Nhập nội dung bổ sung..."
              onChange={(e) =>
                setSupplementContent(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setShowSupplementForm(
                  false
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={
                handleSupplement
              }
            >
              Gửi bổ sung
            </button>
          </div>
        </div>
      )}

      {/* Ý KIẾN */}

      {showCommentForm && (
        <div className="detail-card">
          <h2>
            Thêm ý kiến xử lý
          </h2>

          <div className="form-group">
            <label>
              Nội dung *
            </label>

            <textarea
              rows="4"
              value={commentText}
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

      {/* KẾT QUẢ */}

      {showResultForm && (
        <div className="detail-card">
          <h2>
            Phản hồi kết quả xử lý
          </h2>

          <div className="form-group">
            <label>
              Nội dung kết quả *
            </label>

            <textarea
              rows="5"
              value={resultText}
              placeholder="Nhập kết quả xử lý..."
              onChange={(e) =>
                setResultText(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setShowResultForm(
                  false
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={
                handleSubmitResult
              }
            >
              Gửi kết quả
            </button>
          </div>
        </div>
      )}

      {/* ĐÁNH GIÁ */}

      {showEvaluationForm && (
        <div className="detail-card">
          <h2>
            Đánh giá kết quả
          </h2>

          <div className="form-group">
            <label>
              Nội dung đánh giá
            </label>

            <textarea
              rows="4"
              value={
                evaluationText
              }
              placeholder="Nhập đánh giá nếu có..."
              onChange={(e) =>
                setEvaluationText(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setShowEvaluationForm(
                  false
                )
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={
                handleEvaluation
              }
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      )}

      {/* THÔNG TIN */}

      <div className="detail-card">
        <h2>
          Thông tin yêu cầu
        </h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Nội dung yêu cầu
            </span>

            <p>
              {request.title}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Danh mục
            </span>

            <p>
              {request.category}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người yêu cầu
            </span>

            <p>
              {request.requester}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Mức độ ưu tiên
            </span>

            <p
              style={getPriorityStyle()}
            >
              {request.priority ||
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
              Người / đơn vị xử lý
            </span>

            <p>
              <strong>
                {handlerDisplay ||
                  "Chưa phân công"}
              </strong>
            </p>
          </div>

          <div>
            <span className="detail-label">
              Ngày cập nhật
            </span>

            <p>
              {request.updatedAt}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Điều phối đề xuất
            </span>

            <p>
              {suggestedHandler ||
                "Chưa cấu hình"}
            </p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>
          Mô tả yêu cầu
        </h2>

        <p>
          {request.description}
        </p>
      </div>

      {/* FILE */}

      {request.fileName && (
        <div className="detail-card">
          <h2>
            Tài liệu đính kèm
          </h2>

          <div className="file-row">
            <div>
              <strong>
                {request.fileName}
              </strong>

              <p>
                {request.fileSize}
              </p>
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

      {/* TỪ CHỐI */}

      {status ===
        "Đã từ chối" &&
        rejectReasons[id] && (
          <div className="reject-message">
            <strong>
              Lý do từ chối:
            </strong>{" "}
            {rejectReasons[id]}
          </div>
        )}

      {/* LỊCH SỬ BỔ SUNG */}

      {supplements.length > 0 && (
        <div className="detail-card">
          <h2>
            Bổ sung thông tin
          </h2>

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
              {supplements.map(
                (
                  item,
                  index
                ) => (
                  <tr key={index}>
                    <td>
                      {item.author}
                    </td>

                    <td>
                      {item.content}
                    </td>

                    <td>
                      {item.date}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Ý KIẾN */}

      {comments.length > 0 && (
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
                  item,
                  index
                ) => (
                  <tr key={index}>
                    <td>
                      {item.author}
                    </td>

                    <td>
                      {item.content}
                    </td>

                    <td>
                      {item.date}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* KẾT QUẢ ĐÃ LƯU */}

      {savedResult && (
        <div className="detail-card">
          <h2>
            Kết quả xử lý
          </h2>

          <div className="detail-grid">
            <div>
              <span className="detail-label">
                Người phản hồi
              </span>

              <p>
                {savedResult.responder}
              </p>
            </div>

            <div>
              <span className="detail-label">
                Thời gian
              </span>

              <p>
                {
                  savedResult.respondedAt
                }
              </p>
            </div>
          </div>

          <p>
            {savedResult.content}
          </p>
        </div>
      )}

      {savedEvaluation && (
        <div className="detail-card">
          <h2>
            Đánh giá của người yêu cầu
          </h2>

          <p>
            {savedEvaluation.content}
          </p>

          <small>
            {savedEvaluation.evaluator} -{" "}
            {
              savedEvaluation.evaluatedAt
            }
          </small>
        </div>
      )}

      <div className="settings-note">
        <strong>
          Luồng prototype:
        </strong>{" "}
        Người yêu cầu tạo → Điều phối
        phân công → Người xử lý tiếp
        nhận → Đang xử lý → Phản hồi
        kết quả → Hoàn thành.
        <br />
        Yêu cầu bổ sung thông tin được
        thực hiện bởi Người xử lý trong
        quá trình xử lý.
      </div>
    </div>
  )
}

export default ServiceRequestDetailPage