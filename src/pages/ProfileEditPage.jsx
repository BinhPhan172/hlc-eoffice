import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ProfileEditPage() {
  const navigate = useNavigate()

  const defaultProfile = {
    fullName: "Nguyễn Văn A",
    employeeCode: "HLC-001",
    department: "Phòng Kinh doanh",
    position: "Chuyên viên",
    email: "nguyenvana@hlc.vn",
    phone: "0901234567",
  }

  const savedProfile =
    JSON.parse(
      localStorage.getItem("hlcProfile")
    ) || defaultProfile

  const [fullName, setFullName] =
    useState(savedProfile.fullName)

  const [email, setEmail] =
    useState(savedProfile.email)

  const [phone, setPhone] =
    useState(savedProfile.phone)

  const [error, setError] =
    useState("")

  const handleSave = () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setError(
        "Vui lòng nhập đầy đủ thông tin."
      )

      return
    }

    const updatedProfile = {
      ...savedProfile,
      fullName,
      email,
      phone,
    }

    localStorage.setItem(
      "hlcProfile",
      JSON.stringify(updatedProfile)
    )

    navigate("/profile")
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate("/profile")
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>Sửa thông tin cá nhân</h1>

        <p>
          Cập nhật thông tin cá nhân của bạn.
        </p>
      </div>

      <div className="detail-card">
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="upload-form">
          <div className="form-group">
            <label>Họ và tên *</label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Mã nhân viên
            </label>

            <input
              type="text"
              value={
                savedProfile.employeeCode
              }
              disabled
            />
          </div>

          <div className="form-group">
            <label>
              Phòng ban
            </label>

            <input
              type="text"
              value={
                savedProfile.department
              }
              disabled
            />
          </div>

          <div className="form-group">
            <label>
              Chức vụ
            </label>

            <input
              type="text"
              value={
                savedProfile.position
              }
              disabled
            />
          </div>

          <div className="form-group">
            <label>Email *</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Số điện thoại *
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                navigate("/profile")
              }
            >
              Hủy
            </button>

            <button
              className="primary-button"
              onClick={handleSave}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileEditPage