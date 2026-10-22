import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SettingsProcessingRulesPage() {
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

  const savedRules =
    JSON.parse(
      localStorage.getItem("hlcProcessingRules")
    ) || []

  const [rules, setRules] =
    useState(savedRules)

  const [ruleName, setRuleName] =
    useState("")

  const [category, setCategory] =
    useState("")

  const [ruleContent, setRuleContent] =
    useState("")

  const [editId, setEditId] =
    useState(null)

  const [editName, setEditName] =
    useState("")

  const [
    editCategory,
    setEditCategory,
  ] = useState("")

  const [
    editContent,
    setEditContent,
  ] = useState("")

  const [error, setError] =
    useState("")

  const saveRules = (
    newRules
  ) => {
    setRules(newRules)

    localStorage.setItem(
      "hlcProcessingRules",
      JSON.stringify(newRules)
    )
  }

  const handleAdd = () => {
    const name =
      ruleName.trim()

    const content =
      ruleContent.trim()

    if (
      !name ||
      !category ||
      !content
    ) {
      setError(
        "Vui lòng nhập đầy đủ tên quy tắc, danh mục áp dụng và nội dung quy tắc."
      )

      return
    }

    const duplicated =
      rules.some(
        (item) =>
          item.name.toLowerCase() ===
          name.toLowerCase()
      )

    if (duplicated) {
      setError(
        "Tên quy tắc này đã tồn tại."
      )

      return
    }

    const newRule = {
      id: `RULE-${Date.now()}`,
      name,
      category,
      content,
    }

    saveRules([
      ...rules,
      newRule,
    ])

    setRuleName("")
    setCategory("")
    setRuleContent("")
    setError("")
  }

  const handleStartEdit = (
    item
  ) => {
    setEditId(item.id)

    setEditName(
      item.name
    )

    setEditCategory(
      item.category
    )

    setEditContent(
      item.content
    )

    setError("")
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditName("")
    setEditCategory("")
    setEditContent("")
    setError("")
  }

  const handleSaveEdit = (
    id
  ) => {
    const name =
      editName.trim()

    const content =
      editContent.trim()

    if (
      !name ||
      !editCategory ||
      !content
    ) {
      setError(
        "Vui lòng nhập đầy đủ thông tin quy tắc."
      )

      return
    }

    const duplicated =
      rules.some(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() ===
            name.toLowerCase()
      )

    if (duplicated) {
      setError(
        "Tên quy tắc này đã tồn tại."
      )

      return
    }

    const updatedRules =
      rules.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                name,
                category:
                  editCategory,
                content,
              }
            : item
      )

    saveRules(
      updatedRules
    )

    handleCancelEdit()
  }

  const handleDelete = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn xóa quy tắc này?"
      )

    if (!confirmed) {
      return
    }

    const updatedRules =
      rules.filter(
        (item) =>
          item.id !== id
      )

    saveRules(
      updatedRules
    )
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
          Cấu hình quy tắc xử lý
        </h1>

        <p>
          Quản lý các quy tắc phục vụ quá trình
          xử lý yêu cầu dịch vụ.
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Thêm quy tắc
        </h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="upload-form">
          <div className="form-group">
            <label>
              Tên quy tắc *
            </label>

            <input
              type="text"
              placeholder="Nhập tên quy tắc"
              value={ruleName}
              onChange={(e) =>
                setRuleName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Danh mục áp dụng *
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
              Nội dung quy tắc *
            </label>

            <textarea
              rows="5"
              placeholder="Nhập nội dung quy tắc xử lý..."
              value={ruleContent}
              onChange={(e) =>
                setRuleContent(
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
              + Thêm quy tắc
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
                Tên quy tắc
              </th>
              <th>
                Danh mục áp dụng
              </th>
              <th>
                Nội dung
              </th>
              <th>
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {rules.map(
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
                      <select
                        value={
                          editCategory
                        }
                        onChange={(
                          e
                        ) =>
                          setEditCategory(
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
                      >
                        <option value="">
                          Chọn danh mục
                        </option>

                        {categories.map(
                          (
                            categoryItem
                          ) => (
                            <option
                              key={
                                categoryItem.id
                              }
                              value={
                                categoryItem.name
                              }
                            >
                              {
                                categoryItem.name
                              }
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      item.category
                    )}
                  </td>

                  <td>
                    {editId ===
                    item.id ? (
                      <textarea
                        rows="3"
                        value={
                          editContent
                        }
                        onChange={(
                          e
                        ) =>
                          setEditContent(
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
                      item.content
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

            {rules.length ===
              0 && (
              <tr>
                <td
                  colSpan="5"
                  className="empty-table"
                >
                  Chưa có quy tắc xử lý.
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
          Các quy tắc ở đây hiện chỉ được lưu
          và quản lý. Hệ thống chưa tự động thực
          thi chúng vì điều kiện và cách áp dụng
          quy tắc chưa được xác nhận trong
          requirement.
        </p>
      </div>
    </div>
  )
}

export default SettingsProcessingRulesPage