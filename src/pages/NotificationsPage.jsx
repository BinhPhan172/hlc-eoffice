import { useState } from "react"
import { useNavigate } from "react-router-dom"

function NotificationsPage() {
  const navigate = useNavigate()

  const defaultNotifications = [
    {
      id: "TB-0001",
      title:
        "Hồ sơ trình ký đang chờ bạn xử lý",
      content:
        "Hồ sơ TK-0001 đang chờ bạn thực hiện xử lý trên hệ thống.",
      date: "22/10/2026",
      read: false,
      targetType: "approval",
      targetId: "TK-0001",
    },
    {
      id: "TB-0002",
      title:
        "Yêu cầu dịch vụ đã được xử lý",
      content:
        "Yêu cầu dịch vụ SR-0002 đã có kết quả xử lý mới.",
      date: "22/10/2026",
      read: false,
      targetType:
        "service-request",
      targetId: "SR-0002",
    },
    {
      id: "TB-0003",
      title:
        "Tài liệu mới được chia sẻ",
      content:
        "Bạn vừa được chia sẻ một tài liệu trên hệ thống HLC E-Office.",
      date: "21/10/2026",
      read: true,
      targetType: "documents",
      targetId: "",
    },
  ]

  const savedNotifications =
    JSON.parse(
      localStorage.getItem(
        "hlcNotifications"
      )
    )

  const [
    notifications,
    setNotifications,
  ] = useState(
    savedNotifications !== null
      ? savedNotifications
      : defaultNotifications
  )

  const [filter, setFilter] =
    useState("all")

  const [
    selectedNotification,
    setSelectedNotification,
  ] = useState(null)

  const saveNotifications = (
    newNotifications
  ) => {
    setNotifications(
      newNotifications
    )

    localStorage.setItem(
      "hlcNotifications",
      JSON.stringify(
        newNotifications
      )
    )
  }

  // =========================
  // TARGET DETECTION
  // =========================

  const getNotificationTarget = (
    notification
  ) => {
    // Ưu tiên dữ liệu target
    // nếu thông báo mới đã lưu sẵn.
    if (
      notification.targetType ===
        "approval" &&
      notification.targetId
    ) {
      return `/approval/${notification.targetId}`
    }

    if (
      notification.targetType ===
        "service-request" &&
      notification.targetId
    ) {
      return `/service-requests/${notification.targetId}`
    }

    if (
      notification.targetType ===
        "document" &&
      notification.targetId
    ) {
      return `/documents/${notification.targetId}`
    }

    if (
      notification.targetType ===
      "documents"
    ) {
      return "/documents"
    }

    // Tương thích dữ liệu thông báo cũ
    // đang nằm trong localStorage.
    const searchableText =
      `${notification.title || ""} ${
        notification.content || ""
      }`

    const approvalMatch =
      searchableText.match(
        /TK-\d+/i
      )

    if (approvalMatch) {
      return `/approval/${approvalMatch[0].toUpperCase()}`
    }

    const requestMatch =
      searchableText.match(
        /SR-\d+/i
      )

    if (requestMatch) {
      return `/service-requests/${requestMatch[0].toUpperCase()}`
    }

    const documentMatch =
      searchableText.match(
        /TL-\d+/i
      )

    if (documentMatch) {
      return `/documents/${documentMatch[0].toUpperCase()}`
    }

    // Nếu thông báo nói về tài liệu
    // nhưng chưa có mã TL cụ thể,
    // đưa người dùng về thư viện tài liệu.
    if (
      searchableText
        .toLowerCase()
        .includes("tài liệu")
    ) {
      return "/documents"
    }

    return null
  }

  // =========================
  // VIEW
  // =========================

  const handleView = (
    notification
  ) => {
    const target =
      getNotificationTarget(
        notification
      )

    if (target) {
      navigate(target)
      return
    }

    // Thông báo không gắn với
    // nghiệp vụ cụ thể thì vẫn xem
    // chi tiết ngay trong trang.
    setSelectedNotification(
      notification
    )
  }

  // =========================
  // MARK READ
  // =========================

  const handleMarkRead = (
    id
  ) => {
    const updated =
      notifications.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                read: true,
              }
            : item
      )

    saveNotifications(updated)

    if (
      selectedNotification &&
      selectedNotification.id ===
        id
    ) {
      setSelectedNotification({
        ...selectedNotification,
        read: true,
      })
    }
  }

  // =========================
  // DELETE
  // =========================

  const handleDelete = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn xóa thông báo này?"
      )

    if (!confirmed) {
      return
    }

    const updated =
      notifications.filter(
        (item) =>
          item.id !== id
      )

    saveNotifications(updated)

    if (
      selectedNotification &&
      selectedNotification.id ===
        id
    ) {
      setSelectedNotification(
        null
      )
    }
  }

  // =========================
  // FILTER
  // =========================

  const filteredNotifications =
    notifications.filter(
      (item) => {
        if (
          filter ===
          "unread"
        ) {
          return !item.read
        }

        if (
          filter ===
          "read"
        ) {
          return item.read
        }

        return true
      }
    )

  const unreadCount =
    notifications.filter(
      (item) =>
        !item.read
    ).length

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>
            Thông báo
          </h1>

          <p>
            Theo dõi các thông báo
            trên hệ thống HLC
            E-Office.
          </p>
        </div>

        <div>
          <span className="status waiting">
            {unreadCount} chưa đọc
          </span>
        </div>
      </div>

      <div className="filter-bar">
        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
        >
          <option value="all">
            Tất cả thông báo
          </option>

          <option value="unread">
            Chưa đọc
          </option>

          <option value="read">
            Đã đọc
          </option>
        </select>
      </div>

      <div className="document-table">
        <table>
          <thead>
            <tr>
              <th>
                Mã
              </th>

              <th>
                Tiêu đề
              </th>

              <th>
                Ngày
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
            {filteredNotifications.map(
              (item) => (
                <tr
                  key={
                    item.id
                  }
                >
                  <td>
                    {item.id}
                  </td>

                  <td className="document-name">
                    {
                      item.title
                    }
                  </td>

                  <td>
                    {item.date}
                  </td>

                  <td>
                    {item.read ? (
                      <span className="status processing">
                        Đã đọc
                      </span>
                    ) : (
                      <span className="status pending">
                        Chưa đọc
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="detail-action-buttons">
                      <button
                        className="secondary-button"
                        onClick={() =>
                          handleView(
                            item
                          )
                        }
                      >
                        Xem
                      </button>

                      {!item.read && (
                        <button
                          className="primary-button"
                          onClick={() =>
                            handleMarkRead(
                              item.id
                            )
                          }
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}

                      <button
                        className="reject-button"
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}

            {filteredNotifications
              .length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="empty-table"
                >
                  Không có thông báo
                  phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedNotification && (
        <div
          className="detail-card"
          style={{
            marginTop:
              "20px",
          }}
        >
          <div className="detail-header-actions">
            <div>
              <h2>
                {
                  selectedNotification.title
                }
              </h2>

              <p>
                {
                  selectedNotification.date
                }
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={() =>
                setSelectedNotification(
                  null
                )
              }
            >
              Đóng
            </button>
          </div>

          <p>
            {
              selectedNotification.content
            }
          </p>

          <div
            className="form-actions"
            style={{
              justifyContent:
                "flex-start",
            }}
          >
            {!selectedNotification.read && (
              <button
                className="primary-button"
                onClick={() =>
                  handleMarkRead(
                    selectedNotification.id
                  )
                }
              >
                Đánh dấu đã đọc
              </button>
            )}

            <button
              className="reject-button"
              onClick={() =>
                handleDelete(
                  selectedNotification.id
                )
              }
            >
              Xóa thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsPage