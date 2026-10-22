import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SettingsRequestRoutingPage() {
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

  const categories =
    savedCategories !== null
      ? savedCategories
      : defaultCategories

  const savedRouting =
    JSON.parse(
      localStorage.getItem("hlcRequestRouting")
    ) || []

  const [routingList, setRoutingList] =
    useState(savedRouting)

  const [category, setCategory] =
    useState("")

  const [handler, setHandler] =
    useState("")

  const [editId, setEditId] =
    useState(null)

  const [editHandler, setEditHandler] =
    useState("")

  const [error, setError] =
    useState("")

  const saveRouting = (newList) => {
    setRoutingList(newList)

    localStorage.setItem(
      "hlcRequestRouting",
      JSON.stringify(newList)
    )
  }

  const handleAdd = () => {
    if (!category || !handler.trim()) {
      setError(
        "Vui lòng chọn danh mục và nhập người/đơn vị xử lý."
      )
      return
    }

    const existed =
      routingList.some(
        (item) =>
          item.category === category
      )

    if (existed) {
      setError(
        "Danh mục này đã có cấu hình điều phối."
      )
      return
    }

    const newRouting = {
      id: `ROUTE-${Date.now()}`,
      category,
      handler: handler.trim(),
    }

    saveRouting([
      ...routingList,
      newRouting,
    ])

    setCategory("")
    setHandler("")
    setError("")
  }

  const handleStartEdit = (
    item
  ) => {
    setEditId(item.id)
    setEditHandler(
      item.handler
    )
    setError("")
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditHandler("")
    setError("")
  }

  const handleSaveEdit = (
    id
  ) => {
    if (!editHandler.trim()) {
      setError(
        "Vui lòng nhập người/đơn vị xử lý."
      )
      return
    }

    const updated =
      routingList.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                handler:
                  editHandler.trim(),
              }
            : item
      )

    saveRouting(updated)

    setEditId(null)
    setEditHandler("")
    setError("")
  }

  const handleDelete = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn xóa cấu hình điều phối này?"
      )

    if (!confirmed) {
      return
    }

    const updated =
      routingList.filter(
        (item) =>
          item.id !== id
      )

    saveRouting(updated)
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
          Cấu hình điều phối yêu cầu
        </h1>

        <p>
          Thiết lập thông tin điều phối theo
          danh mục yêu cầu dịch vụ.
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Thêm cấu hình điều phối
        </h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="upload-form">
          <div className="form-group">
            <label>
              Danh mục yêu cầu *
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >
              <option value="">
                Chọn danh mục
              </option>

              {categories.map(
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

            {categories.length ===
              0 && (
              <small>
                Chưa có danh mục yêu cầu.
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              Người / đơn vị xử lý đề xuất *
            </label>

            <input
              type="text"
              placeholder="Nhập người hoặc đơn vị xử lý"
              value={handler}
              onChange={(e) =>
                setHandler(
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
                Danh mục yêu cầu
              </th>
              <th>
                Người / đơn vị xử lý đề xuất
              </th>
              <th>
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {routingList.map(
              (item, index) => (
                <tr key={item.id}>
                  <td>
                    {index + 1}
                  </td>

                  <td>
                    <strong>
                      {item.category}
                    </strong>
                  </td>

                  <td>
                    {editId ===
                    item.id ? (
                      <input
                        type="text"
                        value={
                          editHandler
                        }
                        onChange={(
                          e
                        ) =>
                          setEditHandler(
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
                      item.handler
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

            {routingList.length ===
              0 && (
              <tr>
                <td
                  colSpan="4"
                  className="empty-table"
                >
                  Chưa có cấu hình điều phối.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SettingsRequestRoutingPage