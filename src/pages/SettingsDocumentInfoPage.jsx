import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SettingsDocumentInfoPage() {
  const navigate = useNavigate()

  // =========================
  // CẤU HÌNH THÔNG TIN
  // =========================

  const savedItems =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentInfoSettings"
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

  // =========================
  // DANH MỤC TÀI LIỆU
  // =========================

  const defaultCategories = [
    {
      id: "DOC-CAT-001",
      name: "Quy chế",
    },
    {
      id: "DOC-CAT-002",
      name: "Hướng dẫn",
    },
    {
      id: "DOC-CAT-003",
      name: "Biên bản",
    },
    {
      id: "DOC-CAT-004",
      name: "Khác",
    },
  ]

  const savedCategories =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentCategories"
      )
    )

  const [
    categories,
    setCategories,
  ] = useState(
    savedCategories !== null
      ? savedCategories
      : defaultCategories
  )

  const [
    categoryName,
    setCategoryName,
  ] = useState("")

  const [
    editCategoryId,
    setEditCategoryId,
  ] = useState(null)

  const [
    editCategoryName,
    setEditCategoryName,
  ] = useState("")

  const [error, setError] =
    useState("")

  const [categoryError, setCategoryError] =
    useState("")

  // =========================
  // THÔNG TIN TÀI LIỆU
  // =========================

  const saveItems = (
    newItems
  ) => {
    setItems(newItems)

    localStorage.setItem(
      "hlcDocumentInfoSettings",
      JSON.stringify(newItems)
    )
  }

  const handleAdd = () => {
    const cleanName =
      name.trim()

    if (!cleanName) {
      setError(
        "Vui lòng nhập tên thông tin tài liệu."
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
      id: `DOCINFO-${Date.now()}`,
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
        "Vui lòng nhập tên thông tin tài liệu."
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

  // =========================
  // DANH MỤC TÀI LIỆU
  // =========================

  const saveCategories = (
    newCategories
  ) => {
    setCategories(
      newCategories
    )

    localStorage.setItem(
      "hlcDocumentCategories",
      JSON.stringify(
        newCategories
      )
    )
  }

  const handleAddCategory = () => {
    const cleanName =
      categoryName.trim()

    if (!cleanName) {
      setCategoryError(
        "Vui lòng nhập tên danh mục."
      )
      return
    }

    const duplicated =
      categories.some(
        (item) =>
          item.name.toLowerCase() ===
          cleanName.toLowerCase()
      )

    if (duplicated) {
      setCategoryError(
        "Danh mục này đã tồn tại."
      )
      return
    }

    const newCategory = {
      id: `DOC-CAT-${Date.now()}`,
      name: cleanName,
    }

    saveCategories([
      ...categories,
      newCategory,
    ])

    setCategoryName("")
    setCategoryError("")
  }

  const handleStartCategoryEdit = (
    item
  ) => {
    setEditCategoryId(
      item.id
    )

    setEditCategoryName(
      item.name
    )

    setCategoryError("")
  }

  const handleCancelCategoryEdit =
    () => {
      setEditCategoryId(null)
      setEditCategoryName("")
      setCategoryError("")
    }

  const handleSaveCategoryEdit = (
    id
  ) => {
    const cleanName =
      editCategoryName.trim()

    if (!cleanName) {
      setCategoryError(
        "Vui lòng nhập tên danh mục."
      )
      return
    }

    const duplicated =
      categories.some(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() ===
            cleanName.toLowerCase()
      )

    if (duplicated) {
      setCategoryError(
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
                name: cleanName,
              }
            : item
      )

    saveCategories(updated)
    handleCancelCategoryEdit()
  }

  const handleDeleteCategory = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn xóa danh mục tài liệu này?"
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
          Cấu hình thông tin tài liệu
        </h1>

        <p>
          Quản lý cấu hình và danh mục
          sử dụng trong phân hệ Tài liệu.
        </p>
      </div>

      {/* DANH MỤC TÀI LIỆU */}

      <div className="detail-card">
        <h2>
          Danh mục tài liệu
        </h2>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Danh sách này được sử dụng khi
          tải tài liệu mới lên hệ thống.
        </p>

        {categoryError && (
          <div className="form-error">
            {categoryError}
          </div>
        )}

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Nhập tên danh mục tài liệu..."
            value={categoryName}
            onChange={(e) =>
              setCategoryName(
                e.target.value
              )
            }
          />

          <button
            className="primary-button"
            onClick={
              handleAddCategory
            }
          >
            + Thêm danh mục
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>
                Tên danh mục
              </th>
              <th>
                Thao tác
              </th>
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
                    {editCategoryId ===
                    item.id ? (
                      <input
                        type="text"
                        value={
                          editCategoryName
                        }
                        onChange={(e) =>
                          setEditCategoryName(
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
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
                      {editCategoryId ===
                      item.id ? (
                        <>
                          <button
                            onClick={() =>
                              handleSaveCategoryEdit(
                                item.id
                              )
                            }
                          >
                            Lưu
                          </button>

                          <button
                            className="secondary-button"
                            onClick={
                              handleCancelCategoryEdit
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
                              handleStartCategoryEdit(
                                item
                              )
                            }
                          >
                            Sửa
                          </button>

                          <button
                            className="reject-button"
                            onClick={() =>
                              handleDeleteCategory(
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
                  Chưa có danh mục tài liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* THÔNG TIN CẤU HÌNH */}

      <div className="detail-card">
        <h2>
          Thông tin cấu hình khác
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
                        onChange={(e) =>
                          setEditName(
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
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
                        onChange={(e) =>
                          setEditDescription(
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
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
                  Chưa có cấu hình thông tin tài liệu khác.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SettingsDocumentInfoPage