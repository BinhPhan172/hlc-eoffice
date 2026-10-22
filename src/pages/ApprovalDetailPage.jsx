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

  const [currentUser, setCurrentUser] =
    useState(savedPrototypeUser)

  const defaultApprovals = [
    {
      id: "TK-0001",
      name: "Đề nghị mua sắm thiết bị",
      description:
        "Đề nghị phê duyệt kế hoạch mua sắm thiết bị phục vụ công việc.",
      creator: "Nguyễn Văn A",
      approver: "Trần Thị B",
      updatedAt: "22/10/2026",
      status: "Chờ phê duyệt",
      fileName:
        "de-nghi-mua-sam-thiet-bi.pdf",
      fileSize: "2.1 MB",
      fileData: "",
    },
    {
      id: "TK-0002",
      name:
        "Quyết định điều động nhân sự",
      description:
        "Hồ sơ quyết định điều động nhân sự.",
      creator: "Trần Thị B",
      approver: "Lê Văn C",
      updatedAt: "21/10/2026",
      status: "Chờ ký",
      fileName:
        "quyet-dinh-dieu-dong.pdf",
      fileSize: "1.5 MB",
      fileData: "",
    },
    {
      id: "TK-0003",
      name:
        "Đề xuất kế hoạch đào tạo",
      description:
        "Đề xuất kế hoạch đào tạo nội bộ.",
      creator: "Lê Văn C",
      approver: "Phạm Văn D",
      updatedAt: "20/10/2026",
      status: "Hoàn tất",
      fileName:
        "ke-hoach-dao-tao.pdf",
      fileSize: "3.0 MB",
      fileData: "",
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
      (item) => item.id === id
    )

  const [status, setStatus] =
    useState(
      approval
        ? statusOverrides[id] ||
            approval.status
        : ""
    )

  const [comments, setComments] =
    useState(
      savedComments[id] || []
    )

  const [
    commentText,
    setCommentText,
  ] = useState("")

  const [
    rejectReason,
    setRejectReason,
  ] = useState("")

  const [delegate, setDelegate] =
    useState(
      savedDelegates[id] || ""
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
            navigate("/approval")
          }
        >
          ← Quay lại danh sách
        </button>
      </div>
    )
  }

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
  }

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
          "hlcApprovalComments"
        )
      ) || {}

    current[id] =
      newComments

    localStorage.setItem(
      "hlcApprovalComments",
      JSON.stringify(current)
    )

    setComments(newComments)
  }

  const handleApprove = () => {
    saveStatus("Chờ ký")

    const newComment = {
      author: currentUser,
      content:
        "Đã phê duyệt hồ sơ.",
      date:
        new Date().toLocaleString(
          "vi-VN"
        ),
    }

    saveComments([
      ...comments,
      newComment,
    ])
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      return
    }

    saveStatus("Từ chối")

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

    const newComment = {
      author: currentUser,
      content: `Từ chối: ${rejectReason.trim()}`,
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

  const handleAddComment = () => {
    if (!commentText.trim()) {
      return
    }

    const newComment = {
      author: currentUser,
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

  const handleDelegate = () => {
    if (!selectedDelegate) {
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
      JSON.stringify(current)
    )

    setDelegate(
      selectedDelegate
    )

    const newComment = {
      author: currentUser,
      content:
        `Đã ủy quyền ký cho ${selectedDelegate}.`,
      date:
        new Date().toLocaleString(
          "vi-VN"
        ),
    }

    saveComments([
      ...comments,
      newComment,
    ])

    setSelectedDelegate("")
    setShowDelegateForm(false)
  }

  const handleWithdraw = () => {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn thu hồi hồ sơ trình ký này?"
      )

    if (!confirmed) {
      return
    }

    saveStatus("Đã thu hồi")

    const newComment = {
      author: currentUser,
      content:
        "Đã thu hồi hồ sơ trình ký.",
      date:
        new Date().toLocaleString(
          "vi-VN"
        ),
    }

    saveComments([
      ...comments,
      newComment,
    ])
  }

  const handleDownload = () => {
    if (!approval.fileData) {
      window.alert(
        "File mẫu hoặc hồ sơ cũ chưa có dữ liệu tải xuống. Hãy tạo một hồ sơ trình ký mới để test chức năng này."
      )

      return
    }

    const link =
      document.createElement("a")

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

  const getStatusClass = () => {
    if (
      status === "Hoàn tất"
    ) {
      return "status processing"
    }

    if (
      status === "Chờ ký"
    ) {
      return "status waiting"
    }

    if (
      status === "Từ chối" ||
      status === "Đã thu hồi"
    ) {
      return "status rejected"
    }

    return "status pending"
  }

  const signature =
    signatures[id]

  const signer =
    delegate ||
    approval.approver

  const canWithdraw =
    currentUser ===
      approval.creator &&
    status !== "Hoàn tất" &&
    status !== "Từ chối" &&
    status !== "Đã thu hồi"

  const canApprove =
    status ===
      "Chờ phê duyệt" &&
    currentUser ===
      approval.approver

  const canReject =
    status ===
      "Chờ phê duyệt" &&
    currentUser ===
      approval.approver

  const canDelegate =
    status === "Chờ ký" &&
    currentUser ===
      approval.approver

  const canSign =
    status === "Chờ ký" &&
    currentUser === signer

  return (
    <div>
      <button
        onClick={() =>
          navigate("/approval")
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

      <div className="detail-card">
        <h2>
          Người dùng mô phỏng
        </h2>

        <p>
          Chọn người đang thao tác để
          kiểm thử đúng vai trò trong
          prototype.
        </p>

        <div className="form-group">
          <label>
            Người đang thao tác
          </label>

          <select
            value={currentUser}
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

      {status ===
        "Chờ phê duyệt" &&
        !canApprove && (
          <div className="settings-note">
            Hồ sơ đang chờ{" "}
            <strong>
              {approval.approver}
            </strong>{" "}
            phê duyệt.
          </div>
        )}

      {status ===
        "Chờ ký" &&
        !canSign && (
          <div className="settings-note">
            Hồ sơ đang chờ{" "}
            <strong>
              {signer}
            </strong>{" "}
            ký.
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
            <label>
              Nội dung
            </label>

            <textarea
              rows="4"
              placeholder="Nhập ý kiến..."
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
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
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
                Chọn người được ủy quyền
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
              Người khởi tạo
            </span>

            <p>
              {approval.creator}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người phê duyệt
            </span>

            <p>
              {approval.approver ||
                "Chưa xác định"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người ký hiện tại
            </span>

            <p>
              {signer ||
                "Chưa xác định"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người được ủy quyền ký
            </span>

            <p>
              {delegate ||
                "Chưa có"}
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

      {signature && (
        <div className="detail-card">
          <h2>
            Thông tin ký số
          </h2>

          <div className="detail-grid">
            <div>
              <span className="detail-label">
                Người ký
              </span>

              <p>
                {signature.signer}
              </p>
            </div>

            <div>
              <span className="detail-label">
                Phương thức
              </span>

              <p>
                {signature.method}
              </p>
            </div>

            <div>
              <span className="detail-label">
                Thời gian ký
              </span>

              <p>
                {signature.signedAt}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="detail-card">
        <h2>
          Nội dung trình ký
        </h2>

        <p>
          {approval.description ||
            "Không có mô tả."}
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Tệp trình ký
        </h2>

        <div className="file-row">
          <div>
            <strong>
              {approval.fileName ||
                "Không có tệp"}
            </strong>

            {approval.fileSize && (
              <p>
                Dung lượng:{" "}
                {approval.fileSize}
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

      <div className="detail-card">
        <h2>
          Ý kiến xử lý
        </h2>

        {comments.length === 0 ? (
          <p>
            Chưa có ý kiến xử lý.
          </p>
        ) : (
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
        )}
      </div>

      <div className="settings-note">
        <strong>
          Ghi chú prototype
        </strong>

        <p>
          Người dùng mô phỏng chỉ phục vụ
          kiểm thử luồng nghiệp vụ khi chưa
          có hệ thống đăng nhập thực tế.
          Việc phân quyền chi tiết cần được
          xác nhận trong requirement.
        </p>
      </div>
    </div>
  )
}

export default ApprovalDetailPage