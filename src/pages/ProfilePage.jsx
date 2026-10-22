import { useNavigate } from "react-router-dom"

function ProfilePage() {
  const navigate = useNavigate()

  const defaultProfile = {
    fullName: "Nguyễn Văn A",
    employeeCode: "HLC-001",
    department: "Phòng Kinh doanh",
    position: "Chuyên viên",
    email: "nguyenvana@hlc.vn",
    phone: "0901234567",
  }

  const profile =
    JSON.parse(
      localStorage.getItem("hlcProfile")
    ) || defaultProfile

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Thông tin cá nhân</h1>

          <p>
            Xem và cập nhật thông tin tài khoản của bạn.
          </p>
        </div>

        <div className="detail-action-buttons">
          <button
            className="secondary-button"
            onClick={() =>
              navigate("/change-password")
            }
          >
            Đổi mật khẩu
          </button>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/profile/edit")
            }
          >
            Sửa thông tin
          </button>
        </div>
      </div>

      <div className="detail-card">
        <h2>Thông tin nhân viên</h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Họ và tên
            </span>

            <p>{profile.fullName}</p>
          </div>

          <div>
            <span className="detail-label">
              Mã nhân viên
            </span>

            <p>{profile.employeeCode}</p>
          </div>

          <div>
            <span className="detail-label">
              Phòng ban
            </span>

            <p>{profile.department}</p>
          </div>

          <div>
            <span className="detail-label">
              Chức vụ
            </span>

            <p>{profile.position}</p>
          </div>

          <div>
            <span className="detail-label">
              Email
            </span>

            <p>{profile.email}</p>
          </div>

          <div>
            <span className="detail-label">
              Số điện thoại
            </span>

            <p>{profile.phone}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage