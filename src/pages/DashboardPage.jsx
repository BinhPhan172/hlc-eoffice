import { useNavigate } from "react-router-dom"

function DashboardPage() {
  const navigate = useNavigate()

  const defaultProfile = {
    fullName: "Nguyễn Văn A",
  }

  const profile =
    JSON.parse(
      localStorage.getItem("hlcProfile")
    ) || defaultProfile

  // =========================
  // TÀI LIỆU
  // =========================

  const defaultDocuments = [
    {
      id: "TL-0001",
      name: "Quy chế quản lý tài liệu nội bộ",
      status: "Đã tiếp nhận",
    },
    {
      id: "TL-0002",
      name: "Hướng dẫn sử dụng hệ thống E-Office",
      status: "Đã tiếp nhận",
    },
    {
      id: "TL-0003",
      name: "Biên bản họp dự án tháng 10",
      status: "Chờ tiếp nhận",
    },
  ]

  const savedDocuments =
    JSON.parse(
      localStorage.getItem("hlcDocuments")
    ) || []

  const documentStatuses =
    JSON.parse(
      localStorage.getItem("hlcDocumentStatus")
    ) || {}

  const documents = [
    ...defaultDocuments,
    ...savedDocuments,
  ].map((item) => ({
    ...item,
    status:
      documentStatuses[item.id] ||
      item.status,
  }))

  const pendingDocuments =
    documents.filter(
      (item) =>
        item.status ===
        "Chờ tiếp nhận"
    )

  // =========================
  // TRÌNH KÝ
  // =========================

  const defaultApprovals = [
    {
      id: "TK-0001",
      name: "Đề nghị mua sắm thiết bị",
      status: "Chờ phê duyệt",
    },
    {
      id: "TK-0002",
      name: "Quyết định điều động nhân sự",
      status: "Chờ ký",
    },
    {
      id: "TK-0003",
      name: "Đề xuất kế hoạch đào tạo",
      status: "Hoàn tất",
    },
  ]

  const savedApprovals =
    JSON.parse(
      localStorage.getItem("hlcApprovals")
    ) || []

  const approvalStatuses =
    JSON.parse(
      localStorage.getItem("hlcApprovalStatus")
    ) || {}

  const approvals = [
    ...defaultApprovals,
    ...savedApprovals,
  ].map((item) => ({
    ...item,
    status:
      approvalStatuses[item.id] ||
      item.status,
  }))

  const pendingApprovals =
    approvals.filter(
      (item) =>
        item.status ===
          "Chờ phê duyệt" ||
        item.status === "Chờ ký"
    )

  // =========================
  // YÊU CẦU DỊCH VỤ
  // =========================

  const defaultRequests = [
    {
      id: "SR-0001",
      title: "Cấp quyền sử dụng phần mềm",
      status: "Chờ tiếp nhận",
    },
    {
      id: "SR-0002",
      title: "Hỗ trợ sửa máy in",
      status: "Đang xử lý",
    },
    {
      id: "SR-0003",
      title: "Yêu cầu cấp văn phòng phẩm",
      status: "Hoàn tất",
    },
  ]

  const savedRequests =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequests"
      )
    ) || []

  const requestStatuses =
    JSON.parse(
      localStorage.getItem(
        "hlcServiceRequestStatus"
      )
    ) || {}

  const requests = [
    ...defaultRequests,
    ...savedRequests,
  ].map((item) => ({
    ...item,
    status:
      requestStatuses[item.id] ||
      item.status,
  }))

  const activeRequests =
    requests.filter(
      (item) =>
        item.status !== "Hoàn tất" &&
        item.status !== "Từ chối"
    )

  // =========================
  // THÔNG BÁO
  // =========================

  const defaultNotifications = [
    {
      id: "TB-0001",
      read: false,
    },
    {
      id: "TB-0002",
      read: false,
    },
    {
      id: "TB-0003",
      read: true,
    },
  ]

  const savedNotifications =
    JSON.parse(
      localStorage.getItem(
        "hlcNotifications"
      )
    )

  const notifications =
    savedNotifications !== null
      ? savedNotifications
      : defaultNotifications

  const unreadNotifications =
    notifications.filter(
      (item) => !item.read
    )

  // =========================
  // VIỆC CẦN XỬ LÝ
  // =========================

  const documentTasks =
    pendingDocuments.map((item) => ({
      id: item.id,
      title: item.name,
      module: "Tài liệu",
      status: item.status,
      route: `/documents/${item.id}`,
    }))

  const approvalTasks =
    pendingApprovals.map((item) => ({
      id: item.id,
      title: item.name,
      module: "Trình ký",
      status: item.status,
      route: `/approval/${item.id}`,
    }))

  const requestTasks =
    activeRequests.map((item) => ({
      id: item.id,
      title: item.title,
      module: "Yêu cầu dịch vụ",
      status: item.status,
      route: `/service-requests/${item.id}`,
    }))

  const workItems = [
    ...documentTasks,
    ...approvalTasks,
    ...requestTasks,
  ].slice(0, 8)

  const getStatusClass = (
    status
  ) => {
    if (
      status === "Hoàn tất" ||
      status === "Đã tiếp nhận"
    ) {
      return "status processing"
    }

    if (
      status === "Chờ ký" ||
      status === "Đang xử lý" ||
      status === "Chờ đánh giá"
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

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">
            HLC E-OFFICE
          </p>

          <h1>
            Xin chào,{" "}
            {profile.fullName}
          </h1>

          <p className="dashboard-subtitle">
            Theo dõi nhanh công việc cần
            xử lý và trạng thái các phân hệ.
          </p>
        </div>

        <div className="dashboard-date-box">
          <span>
            Tổng công việc
          </span>

          <strong>
            {workItems.length}
          </strong>

          <small>
            cần theo dõi
          </small>
        </div>
      </div>

      <div className="dashboard-cards modern-dashboard-cards">
        <div
          className="dashboard-stat-card document-stat"
          onClick={() =>
            navigate("/documents")
          }
        >
          <div className="stat-icon">
            📄
          </div>

          <div className="stat-content">
            <p>
              Tài liệu chờ tiếp nhận
            </p>

            <h2>
              {pendingDocuments.length}
            </h2>

            <span>
              Xem danh sách tài liệu →
            </span>
          </div>
        </div>

        <div
          className="dashboard-stat-card approval-stat"
          onClick={() =>
            navigate("/approval")
          }
        >
          <div className="stat-icon">
            ✍️
          </div>

          <div className="stat-content">
            <p>
              Hồ sơ trình ký chờ xử lý
            </p>

            <h2>
              {pendingApprovals.length}
            </h2>

            <span>
              Xem hồ sơ trình ký →
            </span>
          </div>
        </div>

        <div
          className="dashboard-stat-card request-stat"
          onClick={() =>
            navigate(
              "/service-requests"
            )
          }
        >
          <div className="stat-icon">
            🛠️
          </div>

          <div className="stat-content">
            <p>
              Yêu cầu dịch vụ đang mở
            </p>

            <h2>
              {activeRequests.length}
            </h2>

            <span>
              Xem yêu cầu dịch vụ →
            </span>
          </div>
        </div>

        <div
          className="dashboard-stat-card notification-stat"
          onClick={() =>
            navigate(
              "/notifications"
            )
          }
        >
          <div className="stat-icon">
            🔔
          </div>

          <div className="stat-content">
            <p>
              Thông báo chưa đọc
            </p>

            <h2>
              {unreadNotifications.length}
            </h2>

            <span>
              Xem thông báo →
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="work-section dashboard-work-section">
          <div className="section-heading">
            <div>
              <h2>
                Việc cần xử lý
              </h2>

              <p>
                Các công việc đang cần
                bạn theo dõi hoặc xử lý.
              </p>
            </div>

            <span className="work-count">
              {workItems.length} việc
            </span>
          </div>

          {workItems.length === 0 ? (
            <div className="dashboard-empty">
              <div className="empty-icon">
                ✓
              </div>

              <h3>
                Không có công việc chờ xử lý
              </h3>

              <p>
                Các công việc hiện tại đã được xử lý.
              </p>
            </div>
          ) : (
            <div className="dashboard-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Nội dung</th>
                    <th>Phân hệ</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {workItems.map(
                    (item) => (
                      <tr
                        key={`${item.module}-${item.id}`}
                      >
                        <td>
                          <strong className="task-code">
                            {item.id}
                          </strong>
                        </td>

                        <td className="document-name">
                          {item.title}
                        </td>

                        <td>
                          <span className="module-label">
                            {item.module}
                          </span>
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              item.status
                            )}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="dashboard-action-button"
                            onClick={() =>
                              navigate(
                                item.route
                              )
                            }
                          >
                            Xử lý
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dashboard-side-panel">
          <div className="dashboard-side-card">
            <h3>
              Công việc theo phân hệ
            </h3>

            <div className="module-summary-row">
              <div>
                <span className="summary-dot document-dot"></span>
                Tài liệu
              </div>

              <strong>
                {pendingDocuments.length}
              </strong>
            </div>

            <div className="module-summary-row">
              <div>
                <span className="summary-dot approval-dot"></span>
                Trình ký
              </div>

              <strong>
                {pendingApprovals.length}
              </strong>
            </div>

            <div className="module-summary-row">
              <div>
                <span className="summary-dot request-dot"></span>
                Yêu cầu dịch vụ
              </div>

              <strong>
                {activeRequests.length}
              </strong>
            </div>
          </div>

          <div className="dashboard-side-card">
            <h3>
              Truy cập nhanh
            </h3>

            <button
              className="quick-action"
              onClick={() =>
                navigate(
                  "/documents/upload"
                )
              }
            >
              <span>＋</span>
              Tải lên tài liệu
            </button>

            <button
              className="quick-action"
              onClick={() =>
                navigate(
                  "/approval/create"
                )
              }
            >
              <span>＋</span>
              Khởi tạo trình ký
            </button>

            <button
              className="quick-action"
              onClick={() =>
                navigate(
                  "/service-requests/create"
                )
              }
            >
              <span>＋</span>
              Tạo yêu cầu dịch vụ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage