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
      priority:
        "Bình thường",
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
      priority: "Cao",
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
      priority:
        "Bình thường",
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

  const workflowStates =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalWorkflowStates"
      )
    ) || {}

  const normalizeStatus = (
    value
  ) => {
    if (
      value === "Hoàn tất"
    ) {
      return "Hoàn thành"
    }

    if (
      value === "Từ chối"
    ) {
      return "Bị từ chối"
    }

    if (
      value ===
      "Chờ phê duyệt"
    ) {
      return "Đang kiểm soát"
    }

    if (
      value === "Chờ ký"
    ) {
      return "Đang phê duyệt"
    }

    return value
  }

  const deriveWorkflowStatus = (
    approval
  ) => {
    const workflow =
      approval.approvalFlow

    const stored =
      workflowStates[
        approval.id
      ]

    if (
      !Array.isArray(
        workflow
      ) ||
      workflow.length ===
        0 ||
      !stored?.handlerStates
    ) {
      return normalizeStatus(
        statusOverrides[
          approval.id
        ] ||
          approval.status
      )
    }

    const states =
      stored.handlerStates

    const completed = (
      handler
    ) =>
      states[
        handler.id
      ]?.status ===
      "completed"

    const currentStep =
      workflow.find(
        (step) =>
          !(
            step.handlers ||
            []
          ).every(
            (handler) =>
              completed(
                handler
              )
          )
      )

    if (!currentStep) {
      return "Hoàn thành"
    }

    const pending =
      (
        currentStep.handlers ||
        []
      ).filter(
        (handler) =>
          !completed(handler)
      )

    const active =
      currentStep.flowType ===
      "Song song"
        ? pending
        : pending.slice(0, 1)

    const types = [
      ...new Set(
        active.map(
          (handler) =>
            handler.actionType
        )
      ),
    ]

    if (
      types.length !== 1
    ) {
      return "Đang xử lý"
    }

    if (
      types[0] ===
      "Kiểm soát"
    ) {
      return "Đang kiểm soát"
    }

    if (
      types[0] ===
      "Tham mưu"
    ) {
      return "Đang tham mưu"
    }

    if (
      types[0] ===
      "Ký duyệt"
    ) {
      return "Đang phê duyệt"
    }

    return "Đang xử lý"
  }

  const getDateValue = (
    value
  ) => {
    if (!value) {
      return 0
    }

    const [
      day,
      month,
      year,
    ] = value
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
    value
  ) => {
    const match =
      value?.match(
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
        deriveWorkflowStatus(
          item
        ),
    }))
    .sort((a, b) => {
      const dateDiff =
        getDateValue(
          b.updatedAt
        ) -
        getDateValue(
          a.updatedAt
        )

      if (dateDiff !== 0) {
        return dateDiff
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
        const text =
          keyword
            .trim()
            .toLowerCase()

        const matchKeyword =
          item.id
            .toLowerCase()
            .includes(text) ||
          item.name
            .toLowerCase()
            .includes(text)

        const matchStatus =
          !status ||
          item.status ===
            status

        return (
          matchKeyword &&
          matchStatus
        )
      }
    )

  const getStatusClass = (
    value
  ) => {
    if (
      value ===
      "Hoàn thành"
    ) {
      return "status processing"
    }

    if (
      value ===
        "Bị từ chối" ||
      value ===
        "Đã thu hồi"
    ) {
      return "status rejected"
    }

    if (
      [
        "Đang kiểm soát",
        "Đang tham mưu",
        "Đang phê duyệt",
        "Đang xử lý",
      ].includes(value)
    ) {
      return "status waiting"
    }

    return "status pending"
  }

  const getPriorityStyle = (
    value
  ) => {
    if (value === "Khẩn") {
      return {
        background:
          "#fef2f2",
        color: "#b91c1c",
        border:
          "1px solid #fecaca",
      }
    }

    if (value === "Cao") {
      return {
        background:
          "#fff7ed",
        color: "#c2410c",
        border:
          "1px solid #fed7aa",
      }
    }

    return {
      background:
        "#f3f4f6",
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
            Theo dõi và xử lý hồ sơ
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
          + Tạo trình ký
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo mã hoặc nội dung trình ký..."
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

          <option value="Đang kiểm soát">
            Đang kiểm soát
          </option>

          <option value="Đang tham mưu">
            Đang tham mưu
          </option>

          <option value="Đang phê duyệt">
            Đang phê duyệt
          </option>

          <option value="Đang xử lý">
            Đang xử lý
          </option>

          <option value="Hoàn thành">
            Hoàn thành
          </option>

          <option value="Bị từ chối">
            Bị từ chối
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
                Mã trình ký
              </th>

              <th>
                Nội dung
              </th>

              <th>
                Người tạo
              </th>

              <th>
                Mức độ ưu tiên
              </th>

              <th>
                Ngày tạo
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
                      {item.priority}
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
                  colSpan="7"
                  className="empty-table"
                >
                  Không tìm thấy hồ sơ
                  trình ký phù hợp.
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