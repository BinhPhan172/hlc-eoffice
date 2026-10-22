import { useState } from "react"
import { useNavigate } from "react-router-dom"

function DocumentsPage() {
  const navigate = useNavigate()

  const defaultDocuments = [
    {
      id: "TL-0001",
      name: "Quy chế quản lý tài liệu nội bộ",
      category: "Quy chế",
      version: "v1.0",
      updatedAt: "22/10/2026",
      status: "Đã tiếp nhận",
    },
    {
      id: "TL-0002",
      name:
        "Hướng dẫn sử dụng hệ thống E-Office",
      category: "Hướng dẫn",
      version: "v2.1",
      updatedAt: "21/10/2026",
      status: "Đã tiếp nhận",
    },
    {
      id: "TL-0003",
      name:
        "Biên bản họp dự án tháng 10",
      category: "Biên bản",
      version: "v1.0",
      updatedAt: "20/10/2026",
      status: "Chờ tiếp nhận",
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

  const allDocuments = [
    ...defaultDocuments,
    ...savedDocuments,
  ].map((doc) => {
    const versions =
      versionHistory[doc.id] || []

    const latestVersion =
      versions.length > 0
        ? versions[
            versions.length - 1
          ]
        : null

    return {
      ...doc,

      status:
        statusOverrides[doc.id] ||
        doc.status,

      version:
        latestVersion?.version ||
        doc.version,

      updatedAt:
        latestVersion?.updatedAt ||
        doc.updatedAt,
    }
  })

  const [keyword, setKeyword] =
    useState("")

  const [category, setCategory] =
    useState("")

  const [status, setStatus] =
    useState("")

  const filteredDocuments =
    allDocuments.filter((doc) => {
      const matchKeyword =
        doc.id
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          ) ||
        doc.name
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          )

      const matchCategory =
        category === "" ||
        doc.category === category

      const matchStatus =
        status === "" ||
        doc.status === status

      return (
        matchKeyword &&
        matchCategory &&
        matchStatus
      )
    })

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
      documentStatus === "Từ chối"
    ) {
      return "status rejected"
    }

    return "status pending"
  }

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Tài liệu</h1>

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

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo mã hoặc tên tài liệu..."
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
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
        </select>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
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
              <th>Phiên bản</th>
              <th>Cập nhật</th>
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
                  </td>

                  <td>
                    {doc.category}
                  </td>

                  <td>
                    {doc.version}
                  </td>

                  <td>
                    {doc.updatedAt}
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
                  colSpan="7"
                  className="empty-table"
                >
                  Không tìm thấy tài liệu
                  phù hợp.
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