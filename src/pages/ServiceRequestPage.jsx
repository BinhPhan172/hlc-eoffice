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
      priority: "Cao",
      requester:
        "Nguyễn Văn A",
      updatedAt:
        "22/10/2026",
      status:
        "Chờ tiếp nhận",
    },
    {
      id: "SR-0002",
      title:
        "Hỗ trợ sửa máy in",
      category: "CNTT",
      priority: "Khẩn",
      requester:
        "Trần Thị B",
      updatedAt:
        "21/10/2026",
      status:
        "Đang xử lý",
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
      updatedAt:
        "20/10/2026",
      status:
        "Hoàn thành",
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

  const getDateValue = (
    dateString
  ) => {
    if (!dateString) {
      return 0
    }

    const [
      day,
      month,
      year,
    ] = dateString
      .split("/")
      .map(Number)

    if (
      !day ||
      !month ||
      !year
    ) {
      return 0
    }

    return new Date(
      year,
      month - 1,
      day
    ).getTime()
  }

  const requests = [
    ...defaultRequests,
    ...savedRequests,
  ]
    .map((item) => ({
      ...item,

      priority:
        item.priority ||
        "Bình thường",

      status:
        normalizeStatus(
          statusOverrides[
            item.id
          ] ||
            item.status
        ),
    }))
    .sort(
      (a, b) =>
        getDateValue(
          b.updatedAt
        ) -
        getDateValue(
          a.updatedAt
        )
    )

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
    requests.filter(
      (item) => {
        const searchText =
          keyword
            .trim()
            .toLowerCase()

        const matchKeyword =
          item.id
            .toLowerCase()
            .includes(
              searchText
            ) ||
          item.title
            .toLowerCase()
            .includes(
              searchText
            )

        const matchCategory =
          category === "" ||
          item.category ===
            category

        const matchStatus =
          status === "" ||
          item.status ===
            status

        return (
          matchKeyword &&
          matchCategory &&
          matchStatus
        )
      }
    )

  const getStatusClass = (
    requestStatus
  ) => {
    if (
      requestStatus ===
      "Hoàn thành"
    ) {
      return "status processing"
    }

    if (
      requestStatus ===
        "Đang xử lý" ||
      requestStatus ===
        "Đã phân công"
    ) {
      return "status waiting"
    }

    if (
      requestStatus ===
      "Đã từ chối"
    ) {
      return "status rejected"
    }

    return "status pending"
  }

  const getPriorityStyle = (
    requestPriority
  ) => {
    if (
      requestPriority ===
      "Khẩn"
    ) {
      return {
        background:
          "#fef2f2",
        color:
          "#b91c1c",
        border:
          "1px solid #fecaca",
      }
    }

    if (
      requestPriority ===
      "Cao"
    ) {
      return {
        background:
          "#fff7ed",
        color:
          "#c2410c",
        border:
          "1px solid #fed7aa",
      }
    }

    return {
      background:
        "#f3f4f6",
      color:
        "#4b5563",
      border:
        "1px solid #e5e7eb",
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>
            Yêu cầu dịch vụ
          </h1>

          <p>
            Theo dõi và xử lý các yêu
            cầu dịch vụ nội bộ.
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

          <option value="Đã phân công">
            Đã phân công
          </option>

          <option value="Đang xử lý">
            Đang xử lý
          </option>

          <option value="Chờ bổ sung thông tin">
            Chờ bổ sung thông tin
          </option>

          <option value="Hoàn thành">
            Hoàn thành
          </option>

          <option value="Đã từ chối">
            Đã từ chối
          </option>
        </select>
      </div>

      <div className="document-table">
        <table>
          <thead>
            <tr>
              <th>
                Mã yêu cầu
              </th>

              <th>
                Nội dung
              </th>

              <th>
                Danh mục
              </th>

              <th>
                Mức ưu tiên
              </th>

              <th>
                Người yêu cầu
              </th>

              <th>
                Cập nhật
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
                    {
                      item.category
                    }
                  </td>

                  <td>
                    <span
                      style={{
                        display:
                          "inline-block",
                        padding:
                          "5px 9px",
                        borderRadius:
                          "999px",
                        fontSize:
                          "12px",
                        fontWeight:
                          "600",

                        ...getPriorityStyle(
                          item.priority
                        ),
                      }}
                    >
                      {
                        item.priority
                      }
                    </span>
                  </td>

                  <td>
                    {
                      item.requester
                    }
                  </td>

                  <td>
                    {
                      item.updatedAt
                    }
                  </td>

                  <td>
                    <span
                      className={getStatusClass(
                        item.status
                      )}
                    >
                      {
                        item.status
                      }
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
                  colSpan="8"
                  className="empty-table"
                >
                  Không tìm thấy yêu cầu
                  phù hợp.
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