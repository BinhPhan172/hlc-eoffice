import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SettingsApprovalInfoPage() {
  const navigate = useNavigate()

  const savedItems =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalInfoSettings"
      )
    ) || []

  const [items, setItems] =
    useState(savedItems)

  const [name, setName] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [editId, setEditId] =
    useState(null)

  const [editName, setEditName] =
    useState("")

  const [
    editDescription,
    setEditDescription,
  ] = useState("")

  const [error, setError] =
    useState("")

  const saveItems = (
    newItems
  ) => {
    setItems(newItems)

    localStorage.setItem(
      "hlcApprovalInfoSettings",
      JSON.stringify(newItems)
    )
  }

  const handleAdd = () => {
    const cleanName =
      name.trim()

    if (!cleanName) {
      setError(
        "Vui lòng nhập tên thông tin trình ký."
      )
      return
    }

    const duplicated =
      items.some(
        (item) =>
          item.name.toLowerCase() ===
          cleanName.toLowerCase()
      )

    if (duplicated) {
      setError(
        "Thông tin này đã tồn tại."
      )
      return
    }

    const newItem = {
      id: `APPINFO-${Date.now()}`,
      name: cleanName,
      description:
        description.trim(),
    }

    saveItems([
      ...items,
      newItem,
    ])

    setName("")
    setDescription("")
    setError("")
  }

  const handleStartEdit = (
    item
  ) => {
    setEditId(item.id)
    setEditName(item.name)
    setEditDescription(
      item.description || ""
    )
    setError("")
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditName("")
    setEditDescription("")
    setError("")
  }

  const handleSaveEdit = (
    id
  ) => {
    const cleanName =
      editName.trim()

    if (!cleanName) {
      setError(
        "Vui lòng nhập tên thông tin trình ký."
      )
      return
    }

    const duplicated =
      items.some(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() ===
            cleanName.toLowerCase()
      )

    if (duplicated) {
      setError(
        "Thông tin này đã tồn tại."
      )
      return
    }

    const updated =
      items.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                name: cleanName,
                description:
                  editDescription.trim(),
              }
            : item
      )

    saveItems(updated)
    handleCancelEdit()
  }

  const handleDelete = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn xóa cấu hình này?"
      )

    if (!confirmed) {
      return
    }

    const updated =
      items.filter(
        (item) =>
          item.id !== id
      )

    saveItems(updated)
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
          Cấu hình thông tin trình ký
        </h1>

        <p>
          Quản lý các thông tin cấu hình
          phục vụ chức năng trình ký.
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Thêm thông tin cấu hình
        </h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="upload-form">
          <div className="form-group">
            <label>
              Tên thông tin *
            </label>

            <input
              type="text"
              placeholder="Nhập tên thông tin"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Mô tả
            </label>

            <textarea
              rows="4"
              placeholder="Nhập mô tả..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              onClick={handleAdd}
            >
              + Thêm cấu hình
            </button>
          </div>
        </div>
      </div>

      <div className="document-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>
                Tên thông tin
              </th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {items.map(
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
                        value={
                          editName
                        }
                        onChange={(
                          e
                        ) =>
                          setEditName(
                            e.target
                              .value
                          )
                        }
                        style={{
                          width:
                            "100%",
                          padding:
                            "8px 10px",
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
                    {editId ===
                    item.id ? (
                      <textarea
                        rows="3"
                        value={
                          editDescription
                        }
                        onChange={(
                          e
                        ) =>
                          setEditDescription(
                            e.target
                              .value
                          )
                        }
                        style={{
                          width:
                            "100%",
                          padding:
                            "8px 10px",
                          border:
                            "1px solid #d1d5db",
                          borderRadius:
                            "6px",
                          fontFamily:
                            "inherit",
                        }}
                      />
                    ) : (
                      item.description ||
                      "-"
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

            {items.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="empty-table"
                >
                  Chưa có cấu hình thông tin trình ký.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="settings-note"
        style={{
          marginTop: "20px",
        }}
      >
        <strong>
          Lưu ý về prototype
        </strong>

        <p>
          Danh sách cấu hình hiện được lưu
          nhưng chưa tự động thay đổi form
          Khởi tạo trình ký vì cách áp dụng
          từng trường chưa được xác nhận.
        </p>
      </div>
    </div>
  )
}

export default SettingsApprovalInfoPage