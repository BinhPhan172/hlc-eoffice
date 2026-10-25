import { useState } from "react"
import { useNavigate } from "react-router-dom"

function DocumentsPage() {
  const navigate = useNavigate()

  const prototypeUsers = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Nguyễn Văn B",
    "Trần Thị C",
    "Phạm Văn D",
  ]

  const prototypeRoles = [
    {
      value: "employee",
      label: "CBNV",
    },
    {
      value: "records_clerk",
      label: "Văn thư",
    },
  ]

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
  ]

  const defaultDocuments = [
    {
      id: "TL-0001",
      name:
        "Quy chế quản lý tài liệu nội bộ",
      category: "Quy chế",
      documentScope:
        "Dùng chung",
      version: "v1.0",
      updatedAt:
        "22/10/2026",
      status:
        "Đã tiếp nhận",
      uploader:
        "Nguyễn Văn A",
    },
    {
      id: "TL-0002",
      name:
        "Hướng dẫn sử dụng hệ thống E-Office",
      category:
        "Hướng dẫn",
      documentScope:
        "Dùng chung",
      version: "v2.1",
      updatedAt:
        "21/10/2026",
      status:
        "Đã tiếp nhận",
      uploader:
        "Trần Thị B",
    },
    {
      id: "TL-0003",
      name:
        "Biên bản họp dự án tháng 10",
      category:
        "Biên bản",
      documentScope:
        "Dùng chung",
      version: "v1.0",
      updatedAt:
        "20/10/2026",
      status:
        "Chờ tiếp nhận",
      uploader:
        "Lê Văn C",
    },
  ]

  const savedDocuments =
    JSON.parse(
      localStorage.getItem(
        "hlcDocuments"
      )
    ) || []

  const statusOverrides =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentStatus"
      )
    ) || {}

  const versionHistory =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentVersions"
      )
    ) || {}

  const storedShares =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentShares"
      )
    ) || {}

  const savedPrototypeUser =
    localStorage.getItem(
      "hlcDocumentPrototypeUser"
    )

  const savedPrototypeRole =
    localStorage.getItem(
      "hlcDocumentPrototypeRole"
    ) || "employee"

  const [
    currentUser,
    setCurrentUser,
  ] = useState(
    savedPrototypeUser ||
      "Nguyễn Văn A"
  )

  const [
    currentRole,
    setCurrentRole,
  ] = useState(
    savedPrototypeRole
  )

  const [keyword, setKeyword] =
    useState("")

  const [category, setCategory] =
    useState("")

  const [scope, setScope] =
    useState("")

  const [status, setStatus] =
    useState("")

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

  const normalizeVersionStatus = (
    version
  ) =>
    version.status ||
    "Đã tiếp nhận"

  const getDateValue = (
    dateString
  ) => {
    if (!dateString) {
      return 0
    }

    const [
      day,
      month,
      year,
    ] = dateString
      .split("/")
      .map(Number)

    if (
      !day ||
      !month ||
      !year
    ) {
      return 0
    }

    return new Date(
      year,
      month - 1,
      day
    ).getTime()
  }

  const getIdNumber = (
    value
  ) => {
    const match =
      value?.match(
        /(\d+)$/
      )

    return match
      ? Number(match[1])
      : 0
  }

  const allDocuments = [
    ...defaultDocuments,
    ...savedDocuments,
  ]
    .map((doc) => {
      const versions =
        versionHistory[
          doc.id
        ] || []

      const acceptedVersions =
        versions.filter(
          (version) =>
            normalizeVersionStatus(
              version
            ) ===
            "Đã tiếp nhận"
        )

      const activeVersion =
        acceptedVersions.length >
        0
          ? acceptedVersions[
              acceptedVersions.length -
                1
            ]
          : null

      const pendingVersions =
        versions.filter(
          (version) =>
            normalizeVersionStatus(
              version
            ) ===
            "Chờ tiếp nhận"
        )

      return {
        ...doc,

        documentScope:
          doc.documentScope ||
          "Dùng chung",

        status:
          statusOverrides[
            doc.id
          ] ||
          doc.status,

        version:
          activeVersion
            ?.version ||
          doc.version,

        updatedAt:
          activeVersion?.date ||
          doc.updatedAt ||
          doc.date,

        pendingVersionCount:
          pendingVersions.length,
      }
    })
    .sort((a, b) => {
      const dateDiff =
        getDateValue(
          b.updatedAt
        ) -
        getDateValue(
          a.updatedAt
        )

      if (dateDiff !== 0) {
        return dateDiff
      }

      return (
        getIdNumber(b.id) -
        getIdNumber(a.id)
      )
    })

  const isRecordsClerk =
    currentRole ===
    "records_clerk"

  const getAccessInfo = (
    doc
  ) => {
    if (
      isRecordsClerk &&
      doc.documentScope ===
        "Dùng chung"
    ) {
      return {
        canView: true,
        canDownload: true,
        accessLabel:
          "Văn thư",
        permissionLabel:
          "Xem, Tải xuống, Tiếp nhận/Từ chối",
      }
    }

    const isOwner =
      doc.uploader ===
      currentUser

    if (isOwner) {
      return {
        canView: true,
        canDownload: true,
        accessLabel:
          "Chủ tài liệu",
        permissionLabel:
          "Xem, Tải xuống, Chia sẻ",
      }
    }

    const shares =
      normalizeShares(
        storedShares[
          doc.id
        ] || []
      )

    const userShare =
      shares.find(
        (share) =>
          share.recipientType ===
            "Cá nhân" &&
          share.recipientName ===
            currentUser
      )

    if (!userShare) {
      return {
        canView: false,
        canDownload: false,
        accessLabel: "",
        permissionLabel: "",
      }
    }

    const canView =
      userShare.permissions.includes(
        "view"
      )

    const canDownload =
      userShare.permissions.includes(
        "download"
      )

    const permissions = []

    if (canView) {
      permissions.push(
        "Xem"
      )
    }

    if (canDownload) {
      permissions.push(
        "Tải xuống"
      )
    }

    return {
      canView,
      canDownload,
      accessLabel:
        "Được chia sẻ",
      permissionLabel:
        permissions.join(", "),
    }
  }

  const accessibleDocuments =
    allDocuments
      .map((doc) => ({
        ...doc,
        access:
          getAccessInfo(doc),
      }))
      .filter(
        (doc) =>
          doc.access.canView
      )

  const filteredDocuments =
    accessibleDocuments.filter(
      (doc) => {
        const searchText =
          keyword
            .trim()
            .toLowerCase()

        const matchKeyword =
          doc.id
            .toLowerCase()
            .includes(
              searchText
            ) ||
          doc.name
            .toLowerCase()
            .includes(
              searchText
            )

        const matchCategory =
          category === "" ||
          doc.category ===
            category

        const matchScope =
          scope === "" ||
          doc.documentScope ===
            scope

        const matchStatus =
          status === "" ||
          doc.status ===
            status

        return (
          matchKeyword &&
          matchCategory &&
          matchScope &&
          matchStatus
        )
      }
    )

  const handleUserChange = (
    event
  ) => {
    const user =
      event.target.value

    setCurrentUser(user)

    localStorage.setItem(
      "hlcDocumentPrototypeUser",
      user
    )
  }

  const handleRoleChange = (
    event
  ) => {
    const role =
      event.target.value

    setCurrentRole(role)

    localStorage.setItem(
      "hlcDocumentPrototypeRole",
      role
    )
  }

  const getStatusClass = (
    documentStatus
  ) => {
    if (
      documentStatus ===
      "Đã tiếp nhận"
    ) {
      return "status processing"
    }

    if (
      documentStatus ===
      "Từ chối"
    ) {
      return "status rejected"
    }

    return "status pending"
  }

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>
            Tài liệu
          </h1>

          <p>
            Tra cứu và quản lý tài liệu
            trong hệ thống.
          </p>
        </div>

        {!isRecordsClerk && (
          <button
            className="primary-button"
            onClick={() =>
              navigate(
                "/documents/upload"
              )
            }
          >
            + Tải lên tài liệu
          </button>
        )}
      </div>

      <div className="detail-card">
        <h2>
          Vai trò mô phỏng
        </h2>

        <div className="detail-grid">
          <div className="form-group">
            <label>
              Người đang truy cập
            </label>

            <select
              value={currentUser}
              onChange={
                handleUserChange
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

          <div className="form-group">
            <label>
              Vai trò
            </label>

            <select
              value={currentRole}
              onChange={
                handleRoleChange
              }
            >
              {prototypeRoles.map(
                (role) => (
                  <option
                    key={
                      role.value
                    }
                    value={
                      role.value
                    }
                  >
                    {role.label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo mã hoặc tên tài liệu..."
          value={keyword}
          onChange={(e) =>
            setKeyword(
              e.target.value
            )
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        >
          <option value="">
            Tất cả danh mục
          </option>

          <option value="Quy chế">
            Quy chế
          </option>

          <option value="Hướng dẫn">
            Hướng dẫn
          </option>

          <option value="Biên bản">
            Biên bản
          </option>

          <option value="Khác">
            Khác
          </option>
        </select>

        <select
          value={scope}
          onChange={(e) =>
            setScope(
              e.target.value
            )
          }
        >
          <option value="">
            Tất cả phạm vi
          </option>

          <option value="Phòng ban">
            Phòng ban
          </option>

          <option value="Dùng chung">
            Dùng chung
          </option>
        </select>

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
        >
          <option value="">
            Tất cả trạng thái
          </option>

          <option value="Đã tiếp nhận">
            Đã tiếp nhận
          </option>

          <option value="Chờ tiếp nhận">
            Chờ tiếp nhận
          </option>

          <option value="Từ chối">
            Từ chối
          </option>
        </select>
      </div>

      <div className="document-table">
        <table>
          <thead>
            <tr>
              <th>Mã tài liệu</th>
              <th>Tên tài liệu</th>
              <th>Danh mục</th>
              <th>Phạm vi</th>
              <th>Phiên bản hiện hành</th>
              <th>Cập nhật</th>
              <th>Quyền truy cập</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredDocuments.map(
              (doc) => (
                <tr key={doc.id}>
                  <td>
                    {doc.id}
                  </td>

                  <td className="document-name">
                    {doc.name}

                    {doc.pendingVersionCount >
                      0 && (
                      <div
                        style={{
                          marginTop:
                            "5px",
                          fontSize:
                            "12px",
                          color:
                            "#b45309",
                        }}
                      >
                        Có{" "}
                        {
                          doc.pendingVersionCount
                        }{" "}
                        phiên bản đang
                        chờ tiếp nhận
                      </div>
                    )}
                  </td>

                  <td>
                    {doc.category}
                  </td>

                  <td>
                    {
                      doc.documentScope
                    }
                  </td>

                  <td>
                    <strong>
                      {doc.version}
                    </strong>
                  </td>

                  <td>
                    {doc.updatedAt}
                  </td>

                  <td>
                    <strong>
                      {
                        doc.access
                          .accessLabel
                      }
                    </strong>

                    <div
                      style={{
                        marginTop:
                          "4px",
                        fontSize:
                          "13px",
                        color:
                          "#6b7280",
                      }}
                    >
                      {
                        doc.access
                          .permissionLabel
                      }
                    </div>
                  </td>

                  <td>
                    <span
                      className={getStatusClass(
                        doc.status
                      )}
                    >
                      {doc.status}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(
                          `/documents/${doc.id}`
                        )
                      }
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              )
            )}

            {filteredDocuments.length ===
              0 && (
              <tr>
                <td
                  colSpan="9"
                  className="empty-table"
                >
                  Không có tài liệu phù
                  hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DocumentsPage