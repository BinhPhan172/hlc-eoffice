import { useState } from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

function ApprovalSignPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const defaultSignatures = [
    {
      id: "SIGN-001",
      name: "SmartCA",
    },
    {
      id: "SIGN-002",
      name: "USB Token",
    },
  ]

  const savedSignatures = JSON.parse(
    localStorage.getItem(
      "hlcDigitalSignatures"
    )
  )

  const signatureMethods =
    savedSignatures !== null
      ? savedSignatures
      : defaultSignatures

  const [signMethod, setSignMethod] =
    useState("")

  const [error, setError] =
    useState("")

  const defaultApprovals = [
    {
      id: "TK-0001",
      name:
        "Đề nghị mua sắm thiết bị",
      creator:
        "Nguyễn Văn A",
      approver:
        "Trần Thị B",
      updatedAt:
        "22/10/2026",
      status:
        "Chờ phê duyệt",
      fileName:
        "de-nghi-mua-sam-thiet-bi.pdf",
    },

    {
      id: "TK-0002",
      name:
        "Quyết định điều động nhân sự",
      creator:
        "Trần Thị B",
      approver:
        "Lê Văn C",
      updatedAt:
        "21/10/2026",
      status:
        "Chờ ký",
      fileName:
        "quyet-dinh-dieu-dong.pdf",
    },

    {
      id: "TK-0003",
      name:
        "Đề xuất kế hoạch đào tạo",
      creator:
        "Lê Văn C",
      approver:
        "Phạm Văn D",
      updatedAt:
        "20/10/2026",
      status:
        "Hoàn tất",
      fileName:
        "ke-hoach-dao-tao.pdf",
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

  const allApprovals = [
    ...defaultApprovals,
    ...savedApprovals,
  ]

  const approval =
    allApprovals.find(
      (item) =>
        item.id === id
    )

  if (!approval) {
    return (
      <div>
        <h1>
          Không tìm thấy hồ sơ
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

  const currentStatus =
    statusOverrides[id] ||
    approval.status

  const handleSign = () => {
    if (!signMethod) {
      setError(
        "Vui lòng chọn phương thức ký số."
      )
      return
    }

    if (
      currentStatus !==
      "Chờ ký"
    ) {
      setError(
        "Hồ sơ hiện không ở trạng thái chờ ký."
      )
      return
    }

    const currentStatuses =
      JSON.parse(
        localStorage.getItem(
          "hlcApprovalStatus"
        )
      ) || {}

    currentStatuses[id] =
      "Hoàn tất"

    localStorage.setItem(
      "hlcApprovalStatus",
      JSON.stringify(
        currentStatuses
      )
    )

    const signatures =
      JSON.parse(
        localStorage.getItem(
          "hlcApprovalSignatures"
        )
      ) || {}

    signatures[id] = {
      signer:
        "Nguyễn Văn A",

      method:
        signMethod,

      signedAt:
        new Date().toLocaleString(
          "vi-VN"
        ),
    }

    localStorage.setItem(
      "hlcApprovalSignatures",
      JSON.stringify(
        signatures
      )
    )

    const savedComments =
      JSON.parse(
        localStorage.getItem(
          "hlcApprovalComments"
        )
      ) || {}

    const oldComments =
      savedComments[id] || []

    savedComments[id] = [
      ...oldComments,
      {
        author:
          "Nguyễn Văn A",

        content:
          `Đã ký tài liệu bằng ${signMethod}.`,

        date:
          new Date().toLocaleDateString(
            "vi-VN"
          ),
      },
    ]

    localStorage.setItem(
      "hlcApprovalComments",
      JSON.stringify(
        savedComments
      )
    )

    navigate(
      `/approval/${id}`
    )
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            `/approval/${id}`
          )
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Ký tài liệu
        </h1>

        <p>
          Mã hồ sơ:{" "}
          {approval.id}
        </p>
      </div>

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
              <span className="status waiting">
                {currentStatus}
              </span>
            </p>
          </div>

          <div>
            <span className="detail-label">
              Tệp trình ký
            </span>

            <p>
              {approval.fileName ||
                "Không có tệp"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người ký
            </span>

            <p>
              Nguyễn Văn A
            </p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>
          Chọn phương thức ký số
        </h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>
            Phương thức ký *
          </label>

          <select
            value={signMethod}
            onChange={(e) => {
              setSignMethod(
                e.target.value
              )

              setError("")
            }}
          >
            <option value="">
              Chọn phương thức ký
            </option>

            {signatureMethods.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.name}
                >
                  {item.name}
                </option>
              )
            )}
          </select>

          {signatureMethods.length ===
            0 && (
            <small>
              Chưa có chữ ký số được cấu hình.
            </small>
          )}
        </div>

        <div className="form-actions">
          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                `/approval/${id}`
              )
            }
          >
            Hủy
          </button>

          <button
            className="primary-button"
            onClick={handleSign}
          >
            Ký tài liệu
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApprovalSignPage