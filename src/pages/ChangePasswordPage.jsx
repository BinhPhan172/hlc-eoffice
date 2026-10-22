import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ChangePasswordPage() {
  const navigate = useNavigate()

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("")

  const [
    newPassword,
    setNewPassword,
  ] = useState("")

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("")

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const handleChangePassword = () => {
    setError("")
    setSuccess("")

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Vui lòng nhập đầy đủ thông tin."
      )

      return
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Mật khẩu xác nhận không khớp."
      )

      return
    }

    if (
      newPassword ===
      currentPassword
    ) {
      setError(
        "Mật khẩu mới phải khác mật khẩu hiện tại."
      )

      return
    }

    /*
      Prototype frontend:
      chưa có backend để kiểm tra
      mật khẩu hiện tại thực tế.
    */

    setSuccess(
      "Đổi mật khẩu thành công."
    )

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
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
        <h1>Đổi mật khẩu</h1>

        <p>
          Cập nhật mật khẩu đăng nhập E-Office.
        </p>
      </div>

      <div className="detail-card">
        <div className="upload-form">
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <div className="form-group">
            <label>
              Mật khẩu hiện tại *
            </label>

            <input
              type="password"
              value={
                currentPassword
              }
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Mật khẩu mới *
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Xác nhận mật khẩu mới *
            </label>

            <input
              type="password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
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
              onClick={
                handleChangePassword
              }
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPage