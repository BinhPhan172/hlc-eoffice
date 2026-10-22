import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ServiceRequestPage() {
  const navigate = useNavigate()

  const defaultRequests = [
    {
      id: "SR-0001",
      title:
        "Cấp quyền sử dụng phần mềm",
      category: "CNTT",
      requester: "Nguyễn Văn A",
      updatedAt: "22/10/2026",
      status: "Chờ tiếp nhận",
    },
    {
      id: "SR-0002",
      title:
        "Hỗ trợ sửa máy in",
      category: "CNTT",
      requester: "Trần Thị B",
      updatedAt: "21/10/2026",
      status: "Đang xử lý",
    },
    {
      id: "SR-0003",
      title:
        "Yêu cầu cấp văn phòng phẩm",
      category: "Hành chính",
      requester: "Lê Văn C",
      updatedAt: "20/10/2026",
      status: "Hoàn tất",
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

  const requests = [
    ...defaultRequests,
    ...savedRequests,
  ].map((item) => ({
    ...item,
    status:
      statusOverrides[item.id] ||
      item.status,
  }))

  const categoryOptions = [
    ...new Set(
      requests.map(
        (item) =>
          item.category
      )
    ),
  ]

  const [keyword, setKeyword] =
    useState("")

  const [category, setCategory] =
    useState("")

  const [status, setStatus] =
    useState("")

  const filteredRequests =
    requests.filter((item) => {
      const matchKeyword =
        item.id
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          ) ||
        item.title
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          )

      const matchCategory =
        category === "" ||
        item.category === category

      const matchStatus =
        status === "" ||
        item.status === status

      return (
        matchKeyword &&
        matchCategory &&
        matchStatus
      )
    })

  const getStatusClass = (
    requestStatus
  ) => {
    if (
      requestStatus ===
      "Hoàn tất"
    ) {
      return "status processing"
    }

    if (
      requestStatus ===
        "Đang xử lý" ||
      requestStatus ===
        "Chờ đánh giá"
    ) {
      return "status waiting"
    }

    if (
      requestStatus ===
      "Từ chối"
    ) {
      return "status rejected"
    }

    return "status pending"
  }

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>
            Yêu cầu dịch vụ
          </h1>

          <p>
            Theo dõi và xử lý các yêu cầu
            dịch vụ nội bộ.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            navigate(
              "/service-requests/create"
            )
          }
        >
          + Tạo yêu cầu
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo mã hoặc nội dung yêu cầu..."
          value={keyword}
          onChange={(e) =>
            setKeyword(
              e.target.value
            )
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        >
          <option value="">
            Tất cả danh mục
          </option>

          {categoryOptions.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
        >
          <option value="">
            Tất cả trạng thái
          </option>

          <option value="Chờ tiếp nhận">
            Chờ tiếp nhận
          </option>

          <option value="Chờ bổ sung">
            Chờ bổ sung
          </option>

          <option value="Chờ phân công">
            Chờ phân công
          </option>

          <option value="Đang xử lý">
            Đang xử lý
          </option>

          <option value="Chờ đánh giá">
            Chờ đánh giá
          </option>

          <option value="Hoàn tất">
            Hoàn tất
          </option>

          <option value="Từ chối">
            Từ chối
          </option>
        </select>
      </div>

      <div className="document-table">
        <table>
          <thead>
            <tr>
              <th>Mã yêu cầu</th>
              <th>Nội dung</th>
              <th>Danh mục</th>
              <th>Người yêu cầu</th>
              <th>Cập nhật</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map(
              (item) => (
                <tr key={item.id}>
                  <td>
                    {item.id}
                  </td>

                  <td className="document-name">
                    {item.title}
                  </td>

                  <td>
                    {item.category}
                  </td>

                  <td>
                    {item.requester}
                  </td>

                  <td>
                    {item.updatedAt}
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
                      onClick={() =>
                        navigate(
                          `/service-requests/${item.id}`
                        )
                      }
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              )
            )}

            {filteredRequests.length ===
              0 && (
              <tr>
                <td
                  colSpan="7"
                  className="empty-table"
                >
                  Không tìm thấy yêu cầu phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ServiceRequestPage