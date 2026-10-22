import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ApprovalPage() {
  const navigate = useNavigate()

  const defaultApprovals = [
    {
      id: "TK-0001",
      name:
        "Đề nghị mua sắm thiết bị",
      creator:
        "Nguyễn Văn A",
      updatedAt:
        "22/10/2026",
      status:
        "Chờ phê duyệt",
    },

    {
      id: "TK-0002",
      name:
        "Quyết định điều động nhân sự",
      creator:
        "Trần Thị B",
      updatedAt:
        "21/10/2026",
      status:
        "Chờ ký",
    },

    {
      id: "TK-0003",
      name:
        "Đề xuất kế hoạch đào tạo",
      creator:
        "Lê Văn C",
      updatedAt:
        "20/10/2026",
      status:
        "Hoàn tất",
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

  const approvals = [
    ...defaultApprovals,
    ...savedApprovals,
  ].map((item) => ({
    ...item,

    status:
      statusOverrides[item.id] ||
      item.status,
  }))

  const [keyword, setKeyword] =
    useState("")

  const [status, setStatus] =
    useState("")

  const filteredApprovals =
    approvals.filter((item) => {
      const matchKeyword =
        item.id
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          ) ||
        item.name
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          )

      const matchStatus =
        status === "" ||
        item.status === status

      return (
        matchKeyword &&
        matchStatus
      )
    })

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
              <th>Mã hồ sơ</th>
              <th>Tên hồ sơ</th>
              <th>
                Người khởi tạo
              </th>
              <th>Cập nhật</th>
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
                <tr key={item.id}>
                  <td>
                    {item.id}
                  </td>

                  <td className="document-name">
                    {item.name}
                  </td>

                  <td>
                    {item.creator}
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
                  colSpan="6"
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