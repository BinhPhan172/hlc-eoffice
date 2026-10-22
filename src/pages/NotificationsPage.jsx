import { useState } from "react"

function NotificationsPage() {
  const defaultNotifications = [
    {
      id: "TB-0001",
      title: "Hồ sơ trình ký đang chờ bạn xử lý",
      content:
        "Hồ sơ TK-0001 đang chờ bạn thực hiện xử lý trên hệ thống.",
      date: "22/10/2026",
      read: false,
    },
    {
      id: "TB-0002",
      title: "Yêu cầu dịch vụ đã được xử lý",
      content:
        "Yêu cầu dịch vụ SR-0002 đã có kết quả xử lý mới.",
      date: "22/10/2026",
      read: false,
    },
    {
      id: "TB-0003",
      title: "Tài liệu mới được chia sẻ",
      content:
        "Bạn vừa được chia sẻ một tài liệu trên hệ thống HLC E-Office.",
      date: "21/10/2026",
      read: true,
    },
  ]

  const savedNotifications = JSON.parse(
    localStorage.getItem("hlcNotifications")
  )

  const [notifications, setNotifications] = useState(
    savedNotifications !== null
      ? savedNotifications
      : defaultNotifications
  )

  const [filter, setFilter] = useState("all")
  const [selectedNotification, setSelectedNotification] =
    useState(null)

  const saveNotifications = (newNotifications) => {
    setNotifications(newNotifications)

    localStorage.setItem(
      "hlcNotifications",
      JSON.stringify(newNotifications)
    )
  }

  const handleView = (notification) => {
    setSelectedNotification(notification)
  }

  const handleMarkRead = (id) => {
    const updated = notifications.map((item) =>
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
      selectedNotification.id === id
    ) {
      setSelectedNotification({
        ...selectedNotification,
        read: true,
      })
    }
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa thông báo này?"
    )

    if (!confirmed) {
      return
    }

    const updated = notifications.filter(
      (item) => item.id !== id
    )

    saveNotifications(updated)

    if (
      selectedNotification &&
      selectedNotification.id === id
    ) {
      setSelectedNotification(null)
    }
  }

  const filteredNotifications = notifications.filter(
    (item) => {
      if (filter === "unread") {
        return !item.read
      }

      if (filter === "read") {
        return item.read
      }

      return true
    }
  )

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Thông báo</h1>

          <p>
            Theo dõi các thông báo trên hệ thống
            HLC E-Office.
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
            setFilter(e.target.value)
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
              <th>Mã</th>
              <th>Tiêu đề</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredNotifications.map(
              (item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td className="document-name">
                    {item.title}
                  </td>

                  <td>{item.date}</td>

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
                          handleView(item)
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
            marginTop: "20px",
          }}
        >
          <div className="detail-header-actions">
            <div>
              <h2>
                {selectedNotification.title}
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