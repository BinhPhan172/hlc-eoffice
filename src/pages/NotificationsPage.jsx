import { useState } from "react"

function NotificationsPage() {
  const defaultNotifications = [
    {
      id: "TB-0001",
      title: "Hồ sơ trình ký đang chờ bạn xử lý",
      content:
        "Hồ sơ TK-0001 - Đề nghị mua sắm thiết bị đang chờ phê duyệt.",
      type: "Trình ký",
      createdAt: "22/10/2026 09:30",
      read: false,
    },

    {
      id: "TB-0002",
      title: "Yêu cầu dịch vụ đã được xử lý",
      content:
        "Yêu cầu SR-0002 - Hỗ trợ sửa máy in đã có kết quả xử lý.",
      type: "Yêu cầu dịch vụ",
      createdAt: "22/10/2026 08:15",
      read: false,
    },

    {
      id: "TB-0003",
      title: "Tài liệu mới được chia sẻ",
      content:
        "Tài liệu TL-0001 - Quy chế quản lý tài liệu nội bộ đã được chia sẻ với bạn.",
      type: "Tài liệu",
      createdAt: "21/10/2026 16:20",
      read: true,
    },
  ]

  const getInitialNotifications = () => {
    const saved =
      JSON.parse(
        localStorage.getItem(
          "hlcNotifications"
        )
      ) || null

    return saved || defaultNotifications
  }

  const [notifications, setNotifications] =
    useState(
      getInitialNotifications
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

  const handleOpen = (
    notification
  ) => {
    setSelectedNotification(
      notification
    )

    // Khi mở thông báo, prototype này
    // đánh dấu thông báo là đã đọc.
    const updated =
      notifications.map(
        (item) =>
          item.id ===
          notification.id
            ? {
                ...item,
                read: true,
              }
            : item
      )

    saveNotifications(updated)
  }

  const handleMarkAsRead = (
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
  }

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
      selectedNotification?.id ===
      id
    ) {
      setSelectedNotification(
        null
      )
    }
  }

  const filteredNotifications =
    notifications.filter(
      (item) => {
        if (
          filter === "unread"
        ) {
          return !item.read
        }

        if (
          filter === "read"
        ) {
          return item.read
        }

        return true
      }
    )

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Thông báo</h1>

          <p>
            Theo dõi các thông báo
            từ hệ thống.
          </p>
        </div>

        <div>
          Chưa đọc:{" "}
          <strong>
            {unreadCount}
          </strong>
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
              <th>Trạng thái</th>
              <th>Nội dung</th>
              <th>Loại</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredNotifications.map(
              (item) => (
                <tr key={item.id}>
                  <td>
                    <span
                      className={
                        item.read
                          ? "status processing"
                          : "status pending"
                      }
                    >
                      {item.read
                        ? "Đã đọc"
                        : "Chưa đọc"}
                    </span>
                  </td>

                  <td>
                    <strong>
                      {item.title}
                    </strong>

                    <p
                      style={{
                        margin:
                          "5px 0 0",
                        color:
                          "#6b7280",
                      }}
                    >
                      {item.content}
                    </p>
                  </td>

                  <td>
                    {item.type}
                  </td>

                  <td>
                    {
                      item.createdAt
                    }
                  </td>

                  <td>
                    <div
                      style={{
                        display:
                          "flex",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleOpen(
                            item
                          )
                        }
                      >
                        Xem
                      </button>

                      {!item.read && (
                        <button
                          className="secondary-button"
                          onClick={() =>
                            handleMarkAsRead(
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

            {filteredNotifications.length ===
              0 && (
              <tr>
                <td
                  colSpan="5"
                  className="empty-table"
                >
                  Không có thông báo phù hợp.
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
                  selectedNotification.createdAt
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
            className="detail-grid"
            style={{
              marginTop:
                "20px",
            }}
          >
            <div>
              <span className="detail-label">
                Loại thông báo
              </span>

              <p>
                {
                  selectedNotification.type
                }
              </p>
            </div>

            <div>
              <span className="detail-label">
                Trạng thái
              </span>

              <p>
                Đã đọc
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsPage