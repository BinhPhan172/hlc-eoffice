import { useNavigate } from "react-router-dom"

function SettingsPage() {
  const navigate = useNavigate()

  const settings = [
    {
      id: "document-info",
      title:
        "Cấu hình thông tin tài liệu",
      description:
        "Thiết lập các thông tin sử dụng trong chức năng tài liệu.",
      route:
        "/settings/document-info",
    },

    {
      id: "approval-info",
      title:
        "Cấu hình thông tin trình ký",
      description:
        "Thiết lập các thông tin sử dụng trong chức năng trình ký.",
      route:
        "/settings/approval-info",
    },

    {
      id: "digital-signature",
      title:
        "Cấu hình danh sách chữ ký số",
      description:
        "Thiết lập danh sách chữ ký số phục vụ chức năng ký tài liệu.",
      route:
        "/settings/digital-signatures",
    },

    {
      id: "request-category",
      title:
        "Cấu hình danh mục yêu cầu",
      description:
        "Thiết lập các danh mục sử dụng khi tạo yêu cầu dịch vụ.",
      route:
        "/settings/request-categories",
    },

    {
      id: "request-routing",
      title:
        "Cấu hình điều phối yêu cầu",
      description:
        "Thiết lập thông tin phục vụ việc điều phối yêu cầu dịch vụ.",
      route:
        "/settings/request-routing",
    },

    {
      id: "priority-sla",
      title:
        "Cấu hình mức ưu tiên / SLA",
      description:
        "Thiết lập mức ưu tiên và thông tin SLA cho yêu cầu dịch vụ.",
      route:
        "/settings/priority-sla",
    },

    {
      id: "processing-rules",
      title:
        "Cấu hình quy tắc xử lý",
      description:
        "Thiết lập các quy tắc phục vụ quá trình xử lý yêu cầu.",
      route:
        "/settings/processing-rules",
    },
  ]

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>
            Thiết lập hệ thống
          </h1>

          <p>
            Quản lý các cấu hình phục vụ
            hoạt động của HLC E-Office.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {settings.map(
          (item) => (
            <div
              key={item.id}
              className="setting-card"
            >
              <div>
                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  navigate(
                    item.route
                  )
                }
              >
                Thiết lập
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default SettingsPage