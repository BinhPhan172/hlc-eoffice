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

  const defaultDocuments = [
    {
      id: "TL-0001",

      name:
        "Quy chế quản lý tài liệu nội bộ",

      category:
        "Quy chế",

      version:
        "v1.0",

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

      version:
        "v2.1",

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

      version:
        "v1.0",

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

  const [
    currentUser,
    setCurrentUser,
  ] = useState(
    savedPrototypeUser ||
      "Nguyễn Văn A"
  )

  const [keyword, setKeyword] =
    useState("")

  const [category, setCategory] =
    useState("")

  const [status, setStatus] =
    useState("")

  // =========================
  // HỖ TRỢ DỮ LIỆU CHIA SẺ CŨ
  // =========================

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
        // Dữ liệu cũ chỉ lưu ID
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

  // =========================
  // GHÉP TÀI LIỆU
  // =========================

  const allDocuments = [
    ...defaultDocuments,
    ...savedDocuments,
  ].map((doc) => {
    const versions =
      versionHistory[
        doc.id
      ] || []

    const latestVersion =
      versions.length > 0
        ? versions[
            versions.length - 1
          ]
        : null

    return {
      ...doc,

      status:
        statusOverrides[
          doc.id
        ] ||
        doc.status,

      version:
        latestVersion
          ?.version ||
        doc.version,

      updatedAt:
        latestVersion
          ?.updatedAt ||
        latestVersion
          ?.date ||
        doc.updatedAt ||
        doc.date,
    }
  })

  // =========================
  // KIỂM TRA QUYỀN
  // =========================

  const getAccessInfo = (
    doc
  ) => {
    const isOwner =
      doc.uploader ===
      currentUser

    if (isOwner) {
      return {
        canView: true,
        canDownload: true,
        isOwner: true,
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
        isOwner: false,
        accessLabel:
          "",
        permissionLabel:
          "",
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
      isOwner: false,

      accessLabel:
        "Được chia sẻ",

      permissionLabel:
        permissions.join(
          ", "
        ),
    }
  }

  // Chỉ lấy tài liệu user
  // hiện tại thực sự được xem.
  const accessibleDocuments =
    allDocuments
      .map((doc) => ({
        ...doc,
        access:
          getAccessInfo(
            doc
          ),
      }))
      .filter(
        (doc) =>
          doc.access.canView
      )

  // =========================
  // FILTER
  // =========================

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

        const matchStatus =
          status === "" ||
          doc.status ===
            status

        return (
          matchKeyword &&
          matchCategory &&
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
      </div>

      {/* USER MÔ PHỎNG */}

      <div className="detail-card">
        <h2>
          Người dùng mô phỏng
        </h2>

        <p>
          Chọn người đang truy cập để
          kiểm thử danh sách tài liệu
          theo quyền được cấp.
        </p>

        <div className="form-group">
          <label>
            Người đang truy cập
          </label>

          <select
            value={
              currentUser
            }
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

        <div className="settings-note">
          Đang hiển thị tài liệu mà{" "}
          <strong>
            {currentUser}
          </strong>{" "}
          sở hữu hoặc được chia sẻ quyền
          Xem.
        </div>
      </div>

      {/* FILTER */}

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

      {/* TABLE */}

      <div className="document-table">
        <table>
          <thead>
            <tr>
              <th>
                Mã tài liệu
              </th>

              <th>
                Tên tài liệu
              </th>

              <th>
                Danh mục
              </th>

              <th>
                Phiên bản
              </th>

              <th>
                Cập nhật
              </th>

              <th>
                Quyền truy cập
              </th>

              <th>
                Trạng thái
              </th>

              <th>
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredDocuments.map(
              (doc) => (
                <tr
                  key={doc.id}
                >
                  <td>
                    {doc.id}
                  </td>

                  <td className="document-name">
                    {doc.name}
                  </td>

                  <td>
                    {
                      doc.category
                    }
                  </td>

                  <td>
                    {
                      doc.version
                    }
                  </td>

                  <td>
                    {
                      doc.updatedAt
                    }
                  </td>

                  <td>
                    <div>
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

                          color:
                            "#6b7280",

                          fontSize:
                            "13px",
                        }}
                      >
                        {
                          doc.access
                            .permissionLabel
                        }
                      </div>
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
                  colSpan="8"
                  className="empty-table"
                >
                  {currentUser} hiện chưa
                  có tài liệu nào được
                  phép xem.
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