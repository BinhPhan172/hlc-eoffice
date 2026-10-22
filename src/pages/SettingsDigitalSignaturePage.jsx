import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SettingsDigitalSignaturePage() {
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
    localStorage.getItem("hlcDigitalSignatures")
  )

  const [signatures, setSignatures] = useState(
    savedSignatures !== null
      ? savedSignatures
      : defaultSignatures
  )

  const [newName, setNewName] = useState("")
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [error, setError] = useState("")

  const saveSignatures = (newList) => {
    setSignatures(newList)

    localStorage.setItem(
      "hlcDigitalSignatures",
      JSON.stringify(newList)
    )
  }

  const handleAdd = () => {
    const name = newName.trim()

    if (!name) {
      setError(
        "Vui lòng nhập tên chữ ký số."
      )
      return
    }

    const duplicated = signatures.some(
      (item) =>
        item.name.toLowerCase() ===
        name.toLowerCase()
    )

    if (duplicated) {
      setError(
        "Chữ ký số này đã tồn tại."
      )
      return
    }

    const newItem = {
      id: `SIGN-${Date.now()}`,
      name,
    }

    saveSignatures([
      ...signatures,
      newItem,
    ])

    setNewName("")
    setError("")
  }

  const handleStartEdit = (item) => {
    setEditId(item.id)
    setEditName(item.name)
    setError("")
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditName("")
    setError("")
  }

  const handleSaveEdit = (id) => {
    const name = editName.trim()

    if (!name) {
      setError(
        "Vui lòng nhập tên chữ ký số."
      )
      return
    }

    const duplicated = signatures.some(
      (item) =>
        item.id !== id &&
        item.name.toLowerCase() ===
          name.toLowerCase()
    )

    if (duplicated) {
      setError(
        "Chữ ký số này đã tồn tại."
      )
      return
    }

    const updated = signatures.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              name,
            }
          : item
    )

    saveSignatures(updated)

    setEditId(null)
    setEditName("")
    setError("")
  }

  const handleDelete = (id) => {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn xóa chữ ký số này?"
      )

    if (!confirmed) {
      return
    }

    const updated = signatures.filter(
      (item) => item.id !== id
    )

    saveSignatures(updated)
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate("/settings")
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Cấu hình danh sách chữ ký số
        </h1>

        <p>
          Quản lý danh sách phương thức chữ ký số
          sử dụng trong chức năng trình ký.
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Thêm chữ ký số
        </h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Nhập tên chữ ký số..."
            value={newName}
            onChange={(e) =>
              setNewName(e.target.value)
            }
          />

          <button
            className="primary-button"
            onClick={handleAdd}
          >
            + Thêm chữ ký số
          </button>
        </div>
      </div>

      <div className="document-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>
                Tên chữ ký số
              </th>
              <th>
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {signatures.map(
              (item, index) => (
                <tr key={item.id}>
                  <td>
                    {index + 1}
                  </td>

                  <td>
                    {editId ===
                    item.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) =>
                          setEditName(
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border:
                            "1px solid #d1d5db",
                          borderRadius:
                            "6px",
                        }}
                      />
                    ) : (
                      <strong>
                        {item.name}
                      </strong>
                    )}
                  </td>

                  <td>
                    <div className="detail-action-buttons">
                      {editId ===
                      item.id ? (
                        <>
                          <button
                            className="primary-button"
                            onClick={() =>
                              handleSaveEdit(
                                item.id
                              )
                            }
                          >
                            Lưu
                          </button>

                          <button
                            className="secondary-button"
                            onClick={
                              handleCancelEdit
                            }
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="secondary-button"
                            onClick={() =>
                              handleStartEdit(
                                item
                              )
                            }
                          >
                            Sửa
                          </button>

                          <button
                            className="reject-button"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}

            {signatures.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="empty-table"
                >
                  Chưa có chữ ký số được cấu hình.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SettingsDigitalSignaturePage