import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SettingsRequestCategoryPage() {
  const navigate = useNavigate()

  const defaultCategories = [
    {
      id: "CAT-001",
      name: "CNTT",
    },
    {
      id: "CAT-002",
      name: "Hành chính",
    },
    {
      id: "CAT-003",
      name: "Nhân sự",
    },
  ]

  const savedCategories = JSON.parse(
    localStorage.getItem("hlcRequestCategories")
  )

  const [categories, setCategories] = useState(
    savedCategories !== null
      ? savedCategories
      : defaultCategories
  )

  const [newCategory, setNewCategory] =
    useState("")

  const [editId, setEditId] =
    useState(null)

  const [editName, setEditName] =
    useState("")

  const [error, setError] =
    useState("")

  const saveCategories = (
    newCategories
  ) => {
    setCategories(newCategories)

    localStorage.setItem(
      "hlcRequestCategories",
      JSON.stringify(newCategories)
    )
  }

  const handleAdd = () => {
    const name =
      newCategory.trim()

    if (!name) {
      setError(
        "Vui lòng nhập tên danh mục."
      )
      return
    }

    const duplicated =
      categories.some(
        (item) =>
          item.name.toLowerCase() ===
          name.toLowerCase()
      )

    if (duplicated) {
      setError(
        "Danh mục này đã tồn tại."
      )
      return
    }

    const newItem = {
      id: `CAT-${Date.now()}`,
      name,
    }

    saveCategories([
      ...categories,
      newItem,
    ])

    setNewCategory("")
    setError("")
  }

  const handleStartEdit = (
    item
  ) => {
    setEditId(item.id)
    setEditName(item.name)
    setError("")
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditName("")
    setError("")
  }

  const handleSaveEdit = (
    id
  ) => {
    const name =
      editName.trim()

    if (!name) {
      setError(
        "Vui lòng nhập tên danh mục."
      )
      return
    }

    const duplicated =
      categories.some(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() ===
            name.toLowerCase()
      )

    if (duplicated) {
      setError(
        "Danh mục này đã tồn tại."
      )
      return
    }

    const updated =
      categories.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                name,
              }
            : item
      )

    saveCategories(updated)

    setEditId(null)
    setEditName("")
    setError("")
  }

  const handleDelete = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn xóa danh mục này?"
      )

    if (!confirmed) {
      return
    }

    const updated =
      categories.filter(
        (item) =>
          item.id !== id
      )

    saveCategories(updated)
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
          Cấu hình danh mục yêu cầu
        </h1>

        <p>
          Quản lý danh mục sử dụng khi
          tạo yêu cầu dịch vụ.
        </p>
      </div>

      <div className="detail-card">
        <h2>Thêm danh mục</h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Nhập tên danh mục..."
            value={newCategory}
            onChange={(e) =>
              setNewCategory(
                e.target.value
              )
            }
          />

          <button
            className="primary-button"
            onClick={handleAdd}
          >
            + Thêm danh mục
          </button>
        </div>
      </div>

      <div className="document-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {categories.map(
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

            {categories.length ===
              0 && (
              <tr>
                <td
                  colSpan="3"
                  className="empty-table"
                >
                  Chưa có danh mục yêu cầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SettingsRequestCategoryPage