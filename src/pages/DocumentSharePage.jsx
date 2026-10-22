import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

function DocumentSharePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const shareOptions = [
    {
      id: "user-01",
      name: "Nguyễn Văn B",
      type: "Cá nhân",
    },
    {
      id: "user-02",
      name: "Trần Thị C",
      type: "Cá nhân",
    },
    {
      id: "department-01",
      name: "Phòng Hành chính",
      type: "Phòng ban",
    },
    {
      id: "department-02",
      name: "Phòng Kinh doanh",
      type: "Phòng ban",
    },
  ]

  const savedShares =
    JSON.parse(
      localStorage.getItem("hlcDocumentShares")
    ) || {}

  const [selected, setSelected] = useState(
    savedShares[id] || []
  )

  const [success, setSuccess] = useState(false)

  const handleToggle = (itemId) => {
    if (selected.includes(itemId)) {
      setSelected(
        selected.filter((item) => item !== itemId)
      )
    } else {
      setSelected([...selected, itemId])
    }
  }

  const handleSave = () => {
    const currentShares =
      JSON.parse(
        localStorage.getItem("hlcDocumentShares")
      ) || {}

    currentShares[id] = selected

    localStorage.setItem(
      "hlcDocumentShares",
      JSON.stringify(currentShares)
    )

    setSuccess(true)
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate(`/documents/${id}`)
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>Chia sẻ tài liệu</h1>

        <p>
          Mã tài liệu: {id}
        </p>
      </div>

      <div className="detail-card">
        <h2>Chọn người nhận</h2>

        <p className="share-description">
          Chọn cá nhân hoặc phòng ban được chia sẻ tài liệu.
        </p>

        {success && (
          <div className="success-message">
            Đã lưu thông tin chia sẻ.
          </div>
        )}

        <div className="share-list">
          {shareOptions.map((item) => (
            <label
              key={item.id}
              className="share-item"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() =>
                  handleToggle(item.id)
                }
              />

              <div>
                <strong>
                  {item.name}
                </strong>

                <span>
                  {item.type}
                </span>
              </div>
            </label>
          ))}
        </div>

        <div className="form-actions">
          <button
            className="secondary-button"
            onClick={() =>
              navigate(`/documents/${id}`)
            }
          >
            Hủy
          </button>

          <button
            className="primary-button"
            onClick={handleSave}
          >
            Lưu chia sẻ
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentSharePage