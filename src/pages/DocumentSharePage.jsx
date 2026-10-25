import { useState } from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

function DocumentSharePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const prototypeUsers = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Nguyễn Văn B",
    "Trần Thị C",
    "Phạm Văn D",
  ]

  const defaultDocuments = [
    {
      id: "TL-0001",
      uploader: "Nguyễn Văn A",
    },
    {
      id: "TL-0002",
      uploader: "Trần Thị B",
    },
    {
      id: "TL-0003",
      uploader: "Lê Văn C",
    },
  ]

  const savedDocuments =
    JSON.parse(
      localStorage.getItem(
        "hlcDocuments"
      )
    ) || []

  const allDocuments = [
    ...defaultDocuments,
    ...savedDocuments,
  ]

  const document =
    allDocuments.find(
      (item) =>
        item.id === id
    )

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
      id: "user-03",
      name: "Phạm Văn D",
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
    {
      id: "department-03",
      name: "Phòng CNTT",
      type: "Phòng ban",
    },
  ]

  const savedPrototypeUser =
    localStorage.getItem(
      "hlcDocumentPrototypeUser"
    )

  const [
    currentUser,
    setCurrentUser,
  ] = useState(
    savedPrototypeUser ||
      document?.uploader ||
      "Nguyễn Văn A"
  )

  const storedShares =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentShares"
      )
    ) || {}

  const normalizeShares = (
    rawShares
  ) => {
    if (
      !Array.isArray(rawShares)
    ) {
      return []
    }

    return rawShares
      .map((share) => {
        // Tương thích dữ liệu cũ:
        // trước đây chỉ lưu ID người nhận.
        if (
          typeof share ===
          "string"
        ) {
          const option =
            shareOptions.find(
              (item) =>
                item.id === share
            )

          if (!option) {
            return null
          }

          return {
            recipientId:
              option.id,

            recipientName:
              option.name,

            recipientType:
              option.type,

            permissions: [
              "view",
              "download",
            ],
          }
        }

        return {
          recipientId:
            share.recipientId,

          recipientName:
            share.recipientName,

          recipientType:
            share.recipientType,

          permissions:
            Array.isArray(
              share.permissions
            )
              ? share.permissions
              : ["view"],
        }
      })
      .filter(Boolean)
  }

  const existingShares =
    normalizeShares(
      storedShares[id] || []
    )

  const [
    selectedShares,
    setSelectedShares,
  ] = useState(
    existingShares
  )

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("")

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("")

  if (!document) {
    return (
      <div>
        <h1>
          Không tìm thấy tài liệu
        </h1>

        <button
          onClick={() =>
            navigate(
              "/documents"
            )
          }
        >
          ← Quay lại danh sách
        </button>
      </div>
    )
  }

  // Prototype:
  // người tải lên được xem là người
  // đang có quyền chia sẻ.
  // Hệ thống thật sẽ kiểm tra quyền backend.
  const canShare =
    currentUser ===
    document.uploader

  const handleCurrentUserChange = (
    event
  ) => {
    const user =
      event.target.value

    setCurrentUser(user)

    localStorage.setItem(
      "hlcDocumentPrototypeUser",
      user
    )

    setSuccessMessage("")
    setErrorMessage("")
  }

  const isSelected = (
    recipientId
  ) =>
    selectedShares.some(
      (share) =>
        share.recipientId ===
        recipientId
    )

  const getSelectedShare = (
    recipientId
  ) =>
    selectedShares.find(
      (share) =>
        share.recipientId ===
        recipientId
    )

  const handleToggleRecipient = (
    option
  ) => {
    setSuccessMessage("")
    setErrorMessage("")

    if (
      isSelected(
        option.id
      )
    ) {
      setSelectedShares(
        selectedShares.filter(
          (share) =>
            share.recipientId !==
            option.id
        )
      )

      return
    }

    setSelectedShares([
      ...selectedShares,
      {
        recipientId:
          option.id,

        recipientName:
          option.name,

        recipientType:
          option.type,

        // Khi chia sẻ mới,
        // mặc định chỉ cấp quyền Xem.
        permissions: [
          "view",
        ],
      },
    ])
  }

  const handlePermissionToggle = (
    recipientId,
    permission
  ) => {
    setSuccessMessage("")
    setErrorMessage("")

    setSelectedShares(
      selectedShares.map(
        (share) => {
          if (
            share.recipientId !==
            recipientId
          ) {
            return share
          }

          const permissions = [
            ...share.permissions,
          ]

          const hasPermission =
            permissions.includes(
              permission
            )

          // Nếu bỏ quyền Xem
          // thì bỏ luôn Tải xuống.
          if (
            permission ===
            "view" &&
            hasPermission
          ) {
            return {
              ...share,
              permissions: [],
            }
          }

          if (
            permission ===
              "view" &&
            !hasPermission
          ) {
            return {
              ...share,
              permissions: [
                ...permissions,
                "view",
              ],
            }
          }

          // Nếu cấp quyền Tải xuống,
          // prototype tự giữ quyền Xem.
          if (
            permission ===
              "download" &&
            !hasPermission
          ) {
            const updated =
              permissions.includes(
                "view"
              )
                ? permissions
                : [
                    ...permissions,
                    "view",
                  ]

            return {
              ...share,
              permissions: [
                ...updated,
                "download",
              ],
            }
          }

          if (
            permission ===
              "download" &&
            hasPermission
          ) {
            return {
              ...share,

              permissions:
                permissions.filter(
                  (item) =>
                    item !==
                    "download"
                ),
            }
          }

          return share
        }
      )
    )
  }

  const arraysEqual = (
    a,
    b
  ) => {
    const first = [
      ...a,
    ].sort()

    const second = [
      ...b,
    ].sort()

    return (
      JSON.stringify(first) ===
      JSON.stringify(second)
    )
  }

  const sharesAreEquivalent =
    () => {
      if (
        existingShares.length !==
        selectedShares.length
      ) {
        return false
      }

      return selectedShares.every(
        (selected) => {
          const old =
            existingShares.find(
              (share) =>
                share.recipientId ===
                selected.recipientId
            )

          if (!old) {
            return false
          }

          return arraysEqual(
            old.permissions,
            selected.permissions
          )
        }
      )
    }

  const handleSave = () => {
    setSuccessMessage("")
    setErrorMessage("")

    if (!canShare) {
      setErrorMessage(
        "Bạn không có quyền chia sẻ tài liệu này."
      )

      return
    }

    if (
      selectedShares.length ===
      0
    ) {
      setErrorMessage(
        "Vui lòng chọn ít nhất một người hoặc đơn vị nhận."
      )

      return
    }

    const invalidShare =
      selectedShares.find(
        (share) =>
          share.permissions
            .length === 0
      )

    if (invalidShare) {
      setErrorMessage(
        `Vui lòng chọn ít nhất một quyền cho ${invalidShare.recipientName}.`
      )

      return
    }

    if (
      sharesAreEquivalent()
    ) {
      setSuccessMessage(
        "Người nhận đã có quyền tương đương. Quyền hiện tại không thay đổi."
      )

      return
    }

    const currentShares =
      JSON.parse(
        localStorage.getItem(
          "hlcDocumentShares"
        )
      ) || {}

    currentShares[id] =
      selectedShares

    localStorage.setItem(
      "hlcDocumentShares",
      JSON.stringify(
        currentShares
      )
    )

    setSuccessMessage(
      "Đã lưu quyền chia sẻ tài liệu."
    )
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            `/documents/${id}`
          )
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Chia sẻ tài liệu
        </h1>

        <p>
          Mã tài liệu: {id}
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Người dùng mô phỏng
        </h2>

        <p>
          Chọn người đang thực hiện thao
          tác để kiểm thử quyền chia sẻ.
        </p>

        <div className="form-group">
          <label>
            Người đang thao tác
          </label>

          <select
            value={
              currentUser
            }
            onChange={
              handleCurrentUserChange
            }
          >
            {prototypeUsers.map(
              (user) => (
                <option
                  key={user}
                  value={user}
                >
                  {user}
                </option>
              )
            )}
          </select>
        </div>

        <div className="settings-note">
          Chủ tài liệu / người tải lên:{" "}
          <strong>
            {document.uploader}
          </strong>
        </div>
      </div>

      {!canShare && (
        <div className="reject-message">
          <strong>
            Không có quyền chia sẻ.
          </strong>{" "}
          Quyền Xem hoặc Tải xuống không
          tự động bao gồm quyền Chia sẻ.
        </div>
      )}

      <div className="detail-card">
        <h2>
          Chọn người nhận và quyền
        </h2>

        <p className="share-description">
          Chọn cá nhân hoặc phòng ban nội
          bộ, sau đó chọn phạm vi quyền
          muốn cấp.
        </p>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="form-error">
            {errorMessage}
          </div>
        )}

        <div className="share-list">
          {shareOptions.map(
            (option) => {
              const selected =
                getSelectedShare(
                  option.id
                )

              return (
                <div
                  key={
                    option.id
                  }
                  className="share-item"
                  style={{
                    alignItems:
                      "flex-start",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(
                      selected
                    )}
                    disabled={
                      !canShare
                    }
                    onChange={() =>
                      handleToggleRecipient(
                        option
                      )
                    }
                  />

                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <strong>
                      {option.name}
                    </strong>

                    <span>
                      {option.type}
                    </span>

                    {selected && (
                      <div
                        style={{
                          marginTop:
                            "12px",

                          display:
                            "flex",

                          gap:
                            "20px",

                          flexWrap:
                            "wrap",
                        }}
                      >
                        <label
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap:
                              "7px",

                            cursor:
                              canShare
                                ? "pointer"
                                : "default",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selected.permissions.includes(
                              "view"
                            )}
                            disabled={
                              !canShare
                            }
                            onChange={() =>
                              handlePermissionToggle(
                                option.id,
                                "view"
                              )
                            }
                          />

                          Xem
                        </label>

                        <label
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap:
                              "7px",

                            cursor:
                              canShare
                                ? "pointer"
                                : "default",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selected.permissions.includes(
                              "download"
                            )}
                            disabled={
                              !canShare
                            }
                            onChange={() =>
                              handlePermissionToggle(
                                option.id,
                                "download"
                              )
                            }
                          />

                          Tải xuống
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )
            }
          )}
        </div>

        <div className="settings-note">
          <strong>
            Quy tắc prototype:
          </strong>

          <p>
            Quyền Tải xuống đi kèm quyền
            Xem. Quyền Xem/Tải xuống
            không đồng nghĩa với quyền
            Chia sẻ lại tài liệu.
          </p>
        </div>

        <div className="form-actions">
          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                `/documents/${id}`
              )
            }
          >
            Hủy
          </button>

          <button
            className="primary-button"
            disabled={!canShare}
            onClick={
              handleSave
            }
          >
            Lưu chia sẻ
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentSharePage