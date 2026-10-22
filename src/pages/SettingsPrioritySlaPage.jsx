import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SettingsPrioritySlaPage() {
  const navigate = useNavigate()

  const savedPriorities =
    JSON.parse(
      localStorage.getItem("hlcPrioritySla")
    ) || []

  const [priorities, setPriorities] =
    useState(savedPriorities)

  const [priorityName, setPriorityName] =
    useState("")

  const [slaValue, setSlaValue] =
    useState("")

  const [slaUnit, setSlaUnit] =
    useState("Giờ")

  const [editId, setEditId] =
    useState(null)

  const [editName, setEditName] =
    useState("")

  const [editSlaValue, setEditSlaValue] =
    useState("")

  const [editSlaUnit, setEditSlaUnit] =
    useState("Giờ")

  const [error, setError] =
    useState("")

  const savePriorities = (
    newPriorities
  ) => {
    setPriorities(newPriorities)

    localStorage.setItem(
      "hlcPrioritySla",
      JSON.stringify(newPriorities)
    )
  }

  const handleAdd = () => {
    const name =
      priorityName.trim()

    if (!name || !slaValue) {
      setError(
        "Vui lòng nhập mức ưu tiên và thời gian SLA."
      )
      return
    }

    if (Number(slaValue) <= 0) {
      setError(
        "Thời gian SLA phải lớn hơn 0."
      )
      return
    }

    const duplicated =
      priorities.some(
        (item) =>
          item.name.toLowerCase() ===
          name.toLowerCase()
      )

    if (duplicated) {
      setError(
        "Mức ưu tiên này đã tồn tại."
      )
      return
    }

    const newPriority = {
      id: `PRI-${Date.now()}`,
      name,
      slaValue: Number(slaValue),
      slaUnit,
    }

    savePriorities([
      ...priorities,
      newPriority,
    ])

    setPriorityName("")
    setSlaValue("")
    setSlaUnit("Giờ")
    setError("")
  }

  const handleStartEdit = (
    item
  ) => {
    setEditId(item.id)
    setEditName(item.name)
    setEditSlaValue(
      item.slaValue
    )
    setEditSlaUnit(
      item.slaUnit
    )
    setError("")
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditName("")
    setEditSlaValue("")
    setEditSlaUnit("Giờ")
    setError("")
  }

  const handleSaveEdit = (
    id
  ) => {
    const name =
      editName.trim()

    if (
      !name ||
      !editSlaValue
    ) {
      setError(
        "Vui lòng nhập đầy đủ thông tin."
      )
      return
    }

    if (
      Number(editSlaValue) <= 0
    ) {
      setError(
        "Thời gian SLA phải lớn hơn 0."
      )
      return
    }

    const duplicated =
      priorities.some(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() ===
            name.toLowerCase()
      )

    if (duplicated) {
      setError(
        "Mức ưu tiên này đã tồn tại."
      )
      return
    }

    const updated =
      priorities.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                name,
                slaValue:
                  Number(
                    editSlaValue
                  ),
                slaUnit:
                  editSlaUnit,
              }
            : item
      )

    savePriorities(updated)

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
      priorities.filter(
        (item) =>
          item.id !== id
      )

    savePriorities(updated)
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
          Cấu hình mức ưu tiên / SLA
        </h1>

        <p>
          Thiết lập mức ưu tiên và thời gian
          SLA cho hệ thống.
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Thêm cấu hình
        </h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="upload-form">
          <div className="form-group">
            <label>
              Tên mức ưu tiên *
            </label>

            <input
              type="text"
              placeholder="Nhập tên mức ưu tiên"
              value={priorityName}
              onChange={(e) =>
                setPriorityName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Thời gian SLA *
            </label>

            <input
              type="number"
              min="1"
              placeholder="Nhập thời gian"
              value={slaValue}
              onChange={(e) =>
                setSlaValue(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Đơn vị *
            </label>

            <select
              value={slaUnit}
              onChange={(e) =>
                setSlaUnit(
                  e.target.value
                )
              }
            >
              <option value="Giờ">
                Giờ
              </option>

              <option value="Ngày">
                Ngày
              </option>
            </select>
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
                Mức ưu tiên
              </th>
              <th>
                Thời gian SLA
              </th>
              <th>
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {priorities.map(
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
                      <div
                        style={{
                          display:
                            "flex",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="number"
                          min="1"
                          value={
                            editSlaValue
                          }
                          onChange={(
                            e
                          ) =>
                            setEditSlaValue(
                              e.target
                                .value
                            )
                          }
                          style={{
                            width:
                              "100px",
                            padding:
                              "8px 10px",
                            border:
                              "1px solid #d1d5db",
                            borderRadius:
                              "6px",
                          }}
                        />

                        <select
                          value={
                            editSlaUnit
                          }
                          onChange={(
                            e
                          ) =>
                            setEditSlaUnit(
                              e.target
                                .value
                            )
                          }
                          style={{
                            padding:
                              "8px 10px",
                            border:
                              "1px solid #d1d5db",
                            borderRadius:
                              "6px",
                          }}
                        >
                          <option value="Giờ">
                            Giờ
                          </option>

                          <option value="Ngày">
                            Ngày
                          </option>
                        </select>
                      </div>
                    ) : (
                      <>
                        {item.slaValue}{" "}
                        {item.slaUnit}
                      </>
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

            {priorities.length ===
              0 && (
              <tr>
                <td
                  colSpan="4"
                  className="empty-table"
                >
                  Chưa có cấu hình mức ưu tiên /
                  SLA.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SettingsPrioritySlaPage