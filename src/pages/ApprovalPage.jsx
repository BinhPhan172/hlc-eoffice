import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ApprovalPage() {
  const navigate = useNavigate()

  const defaultApprovals = [
    {
      id: "TK-0001",
      name: "Đề nghị mua sắm thiết bị",
      creator: "Nguyễn Văn A",
      updatedAt: "22/10/2026",
      priority: "Bình thường",
      status: "Chờ phê duyệt",
    },
    {
      id: "TK-0002",
      name: "Quyết định điều động nhân sự",
      creator: "Trần Thị B",
      updatedAt: "21/10/2026",
      priority: "Cao",
      status: "Chờ ký",
    },
    {
      id: "TK-0003",
      name: "Đề xuất kế hoạch đào tạo",
      creator: "Lê Văn C",
      updatedAt: "20/10/2026",
      priority: "Bình thường",
      status: "Hoàn tất",
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

  const getIdNumber = (
    approvalId
  ) => {
    const match =
      approvalId?.match(
        /(\d+)$/
      )

    return match
      ? Number(match[1])
      : 0
  }

  const approvals = [
    ...defaultApprovals,
    ...savedApprovals,
  ]
    .map((item) => ({
      ...item,

      priority:
        item.priority ||
        "Bình thường",

      status:
        statusOverrides[
          item.id
        ] ||
        item.status,
    }))
    .sort((a, b) => {
      const dateA =
        getDateValue(
          a.updatedAt
        )

      const dateB =
        getDateValue(
          b.updatedAt
        )

      if (
        dateA !== dateB
      ) {
        return dateB - dateA
      }

      return (
        getIdNumber(b.id) -
        getIdNumber(a.id)
      )
    })

  const [
    keyword,
    setKeyword,
  ] = useState("")

  const [
    status,
    setStatus,
  ] = useState("")

  const filteredApprovals =
    approvals.filter(
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
          item.name
            .toLowerCase()
            .includes(
              searchText
            )

        const matchStatus =
          status === "" ||
          item.status ===
            status

        return (
          matchKeyword &&
          matchStatus
        )
      }
    )

  const getStatusClass = (
    approvalStatus
  ) => {
    if (
      approvalStatus ===
      "Hoàn tất"
    ) {
      return "status processing"
    }

    if (
      approvalStatus ===
      "Chờ ký"
    ) {
      return "status waiting"
    }

    if (
      approvalStatus ===
        "Từ chối" ||
      approvalStatus ===
        "Đã thu hồi"
    ) {
      return "status rejected"
    }

    return "status pending"
  }

  const getPriorityStyle = (
    itemPriority
  ) => {
    if (
      itemPriority === "Khẩn"
    ) {
      return {
        background: "#fef2f2",
        color: "#b91c1c",
        border:
          "1px solid #fecaca",
      }
    }

    if (
      itemPriority === "Cao"
    ) {
      return {
        background: "#fff7ed",
        color: "#c2410c",
        border:
          "1px solid #fed7aa",
      }
    }

    return {
      background: "#f3f4f6",
      color: "#4b5563",
      border:
        "1px solid #e5e7eb",
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>
            Trình ký
          </h1>

          <p>
            Theo dõi và xử lý các hồ sơ
            trình ký.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            navigate(
              "/approval/create"
            )
          }
        >
          + Khởi tạo trình ký
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo mã hoặc tên hồ sơ..."
          value={keyword}
          onChange={(e) =>
            setKeyword(
              e.target.value
            )
          }
        />

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

          <option value="Chờ phê duyệt">
            Chờ phê duyệt
          </option>

          <option value="Chờ ký">
            Chờ ký
          </option>

          <option value="Hoàn tất">
            Hoàn tất
          </option>

          <option value="Từ chối">
            Từ chối
          </option>

          <option value="Đã thu hồi">
            Đã thu hồi
          </option>
        </select>
      </div>

      <div className="document-table">
        <table>
          <thead>
            <tr>
              <th>
                Mã hồ sơ
              </th>

              <th>
                Tên hồ sơ
              </th>

              <th>
                Người khởi tạo
              </th>

              <th>
                Mức độ ưu tiên
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
            {filteredApprovals.map(
              (item) => (
                <tr
                  key={
                    item.id
                  }
                >
                  <td>
                    {
                      item.id
                    }
                  </td>

                  <td className="document-name">
                    {
                      item.name
                    }
                  </td>

                  <td>
                    {
                      item.creator
                    }
                  </td>

                  <td>
                    <span
                      style={{
                        display:
                          "inline-block",

                        padding:
                          "6px 10px",

                        borderRadius:
                          "999px",

                        fontSize:
                          "13px",

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
                          `/approval/${item.id}`
                        )
                      }
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              )
            )}

            {filteredApprovals.length ===
              0 && (
              <tr>
                <td
                  colSpan="7"
                  className="empty-table"
                >
                  Không tìm thấy hồ sơ
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

export default ApprovalPage