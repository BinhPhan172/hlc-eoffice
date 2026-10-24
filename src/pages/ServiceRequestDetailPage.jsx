import { useState } from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

function ServiceRequestDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // =========================
  // VAI TRÒ MÔ PHỎNG
  // =========================

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

  // =========================
  // DỮ LIỆU YÊU CẦU
  // =========================

  const defaultRequests = [
    {
      id: "SR-0001",
      title:
        "Cấp quyền sử dụng phần mềm",
      category: "CNTT",
      requester:
        "Nguyễn Văn A",
      description:
        "Yêu cầu cấp quyền sử dụng phần mềm phục vụ công việc.",
      updatedAt:
        "22/10/2026",
      status:
        "Chờ tiếp nhận",

      // Chưa tiếp nhận nên chưa có người xử lý
      handler: "",

      fileName: "",
      fileSize: "",
      fileData: "",
    },

    {
      id: "SR-0002",
      title:
        "Hỗ trợ sửa máy in",
      category: "CNTT",
      requester:
        "Trần Thị B",
      description:
        "Máy in tại phòng làm việc không thể in tài liệu.",
      updatedAt:
        "21/10/2026",
      status:
        "Đang xử lý",

      // Dữ liệu mẫu prototype
      handler:
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
      requester:
        "Lê Văn C",
      description:
        "Yêu cầu bổ sung văn phòng phẩm phục vụ công việc.",
      updatedAt:
        "20/10/2026",
      status:
        "Hoàn tất",

      // Dữ liệu mẫu prototype
      handler:
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

  const routingConfig =
    request
      ? routingList.find(
          (item) =>
            item.category ===
            request.category
        )
      : null

  const suggestedHandler =
    routingConfig?.handler || ""

  // Nếu dữ liệu cũ chưa có assignment
  // nhưng kết quả đã lưu người phản hồi,
  // dùng người phản hồi làm dữ liệu dự phòng.
  const savedResponder =
    results[id]?.responder || ""

  const handlerFromResult =
    savedResponder &&
    savedResponder !==
      "Người xử lý mô phỏng"
      ? savedResponder
      : ""

  const initialHandler =
    assignments[id] ||
    request?.handler ||
    handlerFromResult ||
    ""

  // =========================
  // STATE
  // =========================

  const [status, setStatus] =
    useState(
      request
        ? statusOverrides[id] ||
            request.status
        : ""
    )

  const [
    handler,
    setHandler,
  ] = useState(
    initialHandler
  )

  const [
    selectedHandler,
    setSelectedHandler,
  ] = useState(
    initialHandler ||
      suggestedHandler
  )

  const [
    resultText,
    setResultText,
  ] = useState(
    results[id]?.content || ""
  )

  const [
    rejectReason,
    setRejectReason,
  ] = useState("")

  const [
    evaluationText,
    setEvaluationText,
  ] = useState(
    evaluations[id]?.content || ""
  )

  const [
    supplementReason,
    setSupplementReason,
  ] = useState("")

  const [
    supplementContent,
    setSupplementContent,
  ] = useState("")

  const [
    supplements,
    setSupplements,
  ] = useState(
    storedSupplements[id] || []
  )

  const [
    comments,
    setComments,
  ] = useState(
    storedComments[id] || []
  )

  const [
    commentText,
    setCommentText,
  ] = useState("")

  const [
    showAssignForm,
    setShowAssignForm,
  ] = useState(false)

  const [
    showResultForm,
    setShowResultForm,
  ] = useState(false)

  const [
    showRejectForm,
    setShowRejectForm,
  ] = useState(false)

  const [
    showEvaluationForm,
    setShowEvaluationForm,
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
    showCommentForm,
    setShowCommentForm,
  ] = useState(false)

  // =========================
  // KHÔNG TÌM THẤY
  // =========================

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

  // =========================
  // LƯU TRẠNG THÁI
  // =========================

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
      JSON.stringify(current)
    )

    setStatus(newStatus)
  }

  // =========================
  // LƯU NGƯỜI XỬ LÝ
  // =========================

  const saveAssignment = (
    assignedHandler
  ) => {
    const cleanHandler =
      assignedHandler.trim()

    if (!cleanHandler) {
      return
    }

    // 1. Lưu bảng phân công
    const currentAssignments =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestAssignments"
        )
      ) || {}

    currentAssignments[id] =
      cleanHandler

    localStorage.setItem(
      "hlcServiceRequestAssignments",
      JSON.stringify(
        currentAssignments
      )
    )

    // 2. Đồng thời lưu vào chính
    // yêu cầu đã được người dùng tạo
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
                handler:
                  cleanHandler,
              }
            : item
      )

    localStorage.setItem(
      "hlcServiceRequests",
      JSON.stringify(
        updatedRequests
      )
    )

    setHandler(cleanHandler)
  }

  // =========================
  // LƯU BỔ SUNG
  // =========================

  const saveSupplements = (
    newSupplements
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestSupplements"
        )
      ) || {}

    current[id] =
      newSupplements

    localStorage.setItem(
      "hlcServiceRequestSupplements",
      JSON.stringify(current)
    )

    setSupplements(
      newSupplements
    )
  }

  // =========================
  // LƯU Ý KIẾN
  // =========================

  const saveComments = (
    newComments
  ) => {
    const current =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestComments"
        )
      ) || {}

    current[id] =
      newComments

    localStorage.setItem(
      "hlcServiceRequestComments",
      JSON.stringify(current)
    )

    setComments(
      newComments
    )
  }

  // =========================
  // ĐỔI VAI TRÒ MÔ PHỎNG
  // =========================

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
  // ĐIỀU PHỐI VIÊN
  // =========================

  const handleAccept = () => {
    saveStatus(
      "Chờ phân công"
    )
  }

  const handleRequestSupplement =
    () => {
      if (
        !supplementReason.trim()
      ) {
        return
      }

      const newItem = {
        type: "request",

        author:
          "Điều phối viên",

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
        "Chờ bổ sung"
      )

      setSupplementReason("")

      setShowRequestSupplementForm(
        false
      )
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
          "hlcServiceRequestRejectReasons"
        )
      ) || {}

    currentReasons[id] =
      rejectReason.trim()

    localStorage.setItem(
      "hlcServiceRequestRejectReasons",
      JSON.stringify(
        currentReasons
      )
    )

    saveStatus(
      "Từ chối"
    )

    setShowRejectForm(false)
    setRejectReason("")
  }

  const handleAssign = () => {
    const cleanHandler =
      selectedHandler.trim()

    if (!cleanHandler) {
      return
    }

    // Quan trọng:
    // lưu người xử lý trước
    saveAssignment(
      cleanHandler
    )

    // Sau đó mới chuyển trạng thái
    saveStatus(
      "Đang xử lý"
    )

    setShowAssignForm(false)
  }

  // =========================
  // NGƯỜI YÊU CẦU
  // =========================

  const handleSupplement = () => {
    if (
      !supplementContent.trim()
    ) {
      return
    }

    const newItem = {
      type: "response",

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
      "Chờ tiếp nhận"
    )

    setSupplementContent("")

    setShowSupplementForm(
      false
    )
  }

  const handleComplete = () => {
    const currentEvaluations =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestEvaluations"
        )
      ) || {}

    currentEvaluations[id] = {
      content:
        evaluationText.trim() ||
        "Đã xác nhận kết quả xử lý.",

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
        currentEvaluations
      )
    )

    // Chỉ đổi trạng thái.
    // Không xóa người xử lý.
    saveStatus(
      "Hoàn tất"
    )

    setShowEvaluationForm(false)
  }

  const handleReopen = () => {
    // Người xử lý đã phân công
    // vẫn được giữ nguyên.
    saveStatus(
      "Đang xử lý"
    )
  }

  // =========================
  // NGƯỜI XỬ LÝ
  // =========================

  const getHandlerName = () => {
    return (
      handler ||
      request.handler ||
      "Người xử lý mô phỏng"
    )
  }

  const handleAddComment = () => {
    if (
      !commentText.trim()
    ) {
      return
    }

    const newComment = {
      author:
        getHandlerName(),

      content:
        commentText.trim(),

      date:
        new Date().toLocaleString(
          "vi-VN"
        ),
    }

    saveComments([
      ...comments,
      newComment,
    ])

    setCommentText("")
    setShowCommentForm(false)
  }

  const handleSubmitResult = () => {
    if (
      !resultText.trim()
    ) {
      return
    }

    const currentResults =
      JSON.parse(
        localStorage.getItem(
          "hlcServiceRequestResults"
        )
      ) || {}

    currentResults[id] = {
      content:
        resultText.trim(),

      responder:
        getHandlerName(),

      respondedAt:
        new Date().toLocaleString(
          "vi-VN"
        ),
    }

    localStorage.setItem(
      "hlcServiceRequestResults",
      JSON.stringify(
        currentResults
      )
    )

    // Không thay đổi handler.
    saveStatus(
      "Chờ đánh giá"
    )

    setShowResultForm(false)
  }

  // =========================
  // FILE
  // =========================

  const handleDownload = () => {
    if (!request.fileData) {
      window.alert(
        "Yêu cầu này chưa có dữ liệu file để tải xuống. Hãy tạo một yêu cầu mới có tệp đính kèm để test chức năng này."
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

  // =========================
  // HIỂN THỊ
  // =========================

  const getStatusClass = () => {
    if (
      status === "Hoàn tất"
    ) {
      return "status processing"
    }

    if (
      status ===
        "Đang xử lý" ||
      status ===
        "Chờ đánh giá"
    ) {
      return "status waiting"
    }

    if (
      status === "Từ chối"
    ) {
      return "status rejected"
    }

    return "status pending"
  }

  const savedResult =
    results[id]

  const savedEvaluation =
    evaluations[id]

  const currentRoleLabel =
    prototypeRoles.find(
      (role) =>
        role.value ===
        currentRole
    )?.label || ""

  const isRequester =
    currentRole ===
    "requester"

  const isDispatcher =
    currentRole ===
    "dispatcher"

  const isHandler =
    currentRole ===
    "handler"

  const statusesNeedHandler = [
    "Đang xử lý",
    "Chờ đánh giá",
    "Hoàn tất",
  ]

  const handlerDisplay =
    handler ||
    request.handler ||
    (
      statusesNeedHandler.includes(
        status
      )
        ? "Chưa có dữ liệu phân công"
        : "Chưa phân công"
    )

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
          {/* ĐIỀU PHỐI VIÊN */}

          {isDispatcher &&
            status ===
              "Chờ tiếp nhận" && (
              <>
                <button
                  className="accept-button"
                  onClick={
                    handleAccept
                  }
                >
                  Tiếp nhận
                </button>

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

          {isDispatcher &&
            status ===
              "Chờ phân công" && (
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
            )}

          {/* NGƯỜI YÊU CẦU */}

          {isRequester &&
            status ===
              "Chờ bổ sung" && (
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
              "Chờ đánh giá" && (
              <>
                <button
                  className="secondary-button"
                  onClick={
                    handleReopen
                  }
                >
                  Mở lại yêu cầu
                </button>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowEvaluationForm(
                      true
                    )
                  }
                >
                  Đánh giá kết quả
                </button>
              </>
            )}

          {/* NGƯỜI XỬ LÝ */}

          {isHandler &&
            status ===
              "Đang xử lý" && (
              <>
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
        </div>
      </div>

      {/* VAI TRÒ MÔ PHỎNG */}

      <div className="detail-card">
        <h2>
          Vai trò mô phỏng
        </h2>

        <p>
          Chọn actor đang thao tác để
          kiểm thử luồng nghiệp vụ của
          yêu cầu dịch vụ.
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

      {/* THÔNG BÁO */}

      {status ===
        "Chờ tiếp nhận" &&
        !isDispatcher && (
          <div className="settings-note">
            Yêu cầu hiện đang chờ{" "}
            <strong>
              Điều phối viên
            </strong>{" "}
            kiểm tra và tiếp nhận.
          </div>
        )}

      {status ===
        "Chờ bổ sung" &&
        !isRequester && (
          <div className="settings-note">
            Yêu cầu hiện đang chờ{" "}
            <strong>
              Người yêu cầu
            </strong>{" "}
            bổ sung thông tin.
          </div>
        )}

      {status ===
        "Chờ phân công" &&
        !isDispatcher && (
          <div className="settings-note">
            Yêu cầu hiện đang chờ{" "}
            <strong>
              Điều phối viên
            </strong>{" "}
            phân công xử lý.
          </div>
        )}

      {status ===
        "Đang xử lý" &&
        !isHandler && (
          <div className="settings-note">
            Yêu cầu hiện đang được{" "}
            <strong>
              {handler ||
                request.handler ||
                "Người xử lý"}
            </strong>{" "}
            xử lý.
          </div>
        )}

      {status ===
        "Chờ đánh giá" &&
        !isRequester && (
          <div className="settings-note">
            Yêu cầu đã được{" "}
            <strong>
              {handler ||
                request.handler ||
                "Người xử lý"}
            </strong>{" "}
            phản hồi và đang chờ{" "}
            <strong>
              Người yêu cầu
            </strong>{" "}
            đánh giá kết quả.
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
              placeholder="Nhập thông tin cần người yêu cầu bổ sung..."
              value={
                supplementReason
              }
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

      {/* BỔ SUNG */}

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
              placeholder="Nhập thông tin bổ sung..."
              value={
                supplementContent
              }
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

      {/* PHÂN CÔNG */}

      {showAssignForm && (
        <div className="detail-card">
          <h2>
            Phân công xử lý
          </h2>

          {suggestedHandler && (
            <div className="success-message">
              Điều phối đề xuất cho danh mục{" "}
              <strong>
                {request.category}
              </strong>
              :{" "}
              <strong>
                {suggestedHandler}
              </strong>
            </div>
          )}

          <div className="form-group">
            <label>
              Người / đơn vị xử lý *
            </label>

            <input
              type="text"
              placeholder="Nhập người hoặc đơn vị xử lý"
              value={
                selectedHandler
              }
              onChange={(e) =>
                setSelectedHandler(
                  e.target.value
                )
              }
            />

            {!suggestedHandler && (
              <small>
                Chưa có cấu hình điều phối
                cho danh mục này.
              </small>
            )}
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

      {/* COMMENT */}

      {showCommentForm && (
        <div className="detail-card">
          <h2>
            Thêm ý kiến xử lý
          </h2>

          <div className="form-group">
            <label>
              Nội dung ý kiến *
            </label>

            <textarea
              rows="4"
              placeholder="Nhập ý kiến trong quá trình xử lý..."
              value={
                commentText
              }
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
              onClick={() => {
                setShowCommentForm(
                  false
                )

                setCommentText("")
              }}
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

      {/* PHẢN HỒI KẾT QUẢ */}

      {showResultForm && (
        <div className="detail-card">
          <h2>
            Phản hồi kết quả
          </h2>

          <div className="form-group">
            <label>
              Nội dung kết quả *
            </label>

            <textarea
              rows="5"
              placeholder="Nhập kết quả xử lý..."
              value={
                resultText
              }
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
              Nhận xét
            </label>

            <textarea
              rows="4"
              placeholder="Nhập nhận xét về kết quả xử lý..."
              value={
                evaluationText
              }
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
                handleComplete
              }
            >
              Hoàn tất yêu cầu
            </button>
          </div>
        </div>
      )}

      {/* LÝ DO TỪ CHỐI */}

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
                {handlerDisplay}
              </strong>
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

          <div>
            <span className="detail-label">
              Ngày cập nhật
            </span>

            <p>
              {request.updatedAt}
            </p>
          </div>
        </div>
      </div>

      {/* MÔ TẢ */}

      <div className="detail-card">
        <h2>
          Mô tả yêu cầu
        </h2>

        <p>
          {request.description ||
            "Không có mô tả."}
        </p>
      </div>

      {/* LỊCH SỬ BỔ SUNG */}

      {supplements.length > 0 && (
        <div className="detail-card">
          <h2>
            Lịch sử bổ sung thông tin
          </h2>

          <table>
            <thead>
              <tr>
                <th>
                  Loại
                </th>

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
                (item, index) => (
                  <tr key={index}>
                    <td>
                      {item.type ===
                      "request"
                        ? "Yêu cầu bổ sung"
                        : "Thông tin bổ sung"}
                    </td>

                    <td>
                      {item.author ||
                        "-"}
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

      {/* FILE */}

      {request.fileName && (
        <div className="detail-card">
          <h2>
            Tệp đính kèm
          </h2>

          <div className="file-row">
            <div>
              <strong>
                {request.fileName}
              </strong>

              {request.fileSize && (
                <p>
                  Dung lượng:{" "}
                  {request.fileSize}
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

      {/* KẾT QUẢ */}

      {savedResult && (
        <div className="detail-card">
          <h2>
            Kết quả xử lý
          </h2>

          <p>
            {savedResult.content}
          </p>

          <div className="detail-grid">
            <div>
              <span className="detail-label">
                Người phản hồi
              </span>

              <p>
                {
                  savedResult.responder
                }
              </p>
            </div>

            <div>
              <span className="detail-label">
                Thời gian phản hồi
              </span>

              <p>
                {
                  savedResult.respondedAt
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ĐÁNH GIÁ */}

      {savedEvaluation && (
        <div className="detail-card">
          <h2>
            Đánh giá kết quả
          </h2>

          <p>
            {
              savedEvaluation.content
            }
          </p>

          <div className="detail-grid">
            <div>
              <span className="detail-label">
                Người đánh giá
              </span>

              <p>
                {
                  savedEvaluation.evaluator
                }
              </p>
            </div>

            <div>
              <span className="detail-label">
                Thời gian đánh giá
              </span>

              <p>
                {
                  savedEvaluation.evaluatedAt
                }
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
          Vai trò mô phỏng chỉ dùng để
          kiểm thử luồng Use Case khi
          prototype chưa có đăng nhập và
          phân quyền thực tế.
        </p>
      </div>
    </div>
  )
}

export default ServiceRequestDetailPage