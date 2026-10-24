import "./App.css"

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  useEffect,
  useState,
} from "react"

import DashboardPage from "./pages/DashboardPage"

import DocumentsPage from "./pages/DocumentsPage"
import DocumentDetailPage from "./pages/DocumentDetailPage"
import DocumentUploadPage from "./pages/DocumentUploadPage"
import DocumentVersionPage from "./pages/DocumentVersionPage"
import DocumentSharePage from "./pages/DocumentSharePage"

import ApprovalPage from "./pages/ApprovalPage"
import ApprovalCreatePage from "./pages/ApprovalCreatePage"
import ApprovalDetailPage from "./pages/ApprovalDetailPage"
import ApprovalSignPage from "./pages/ApprovalSignPage"

import ServiceRequestPage from "./pages/ServiceRequestPage"
import ServiceRequestCreatePage from "./pages/ServiceRequestCreatePage"
import ServiceRequestDetailPage from "./pages/ServiceRequestDetailPage"

import NotificationsPage from "./pages/NotificationsPage"

import ProfilePage from "./pages/ProfilePage"
import ProfileEditPage from "./pages/ProfileEditPage"
import ChangePasswordPage from "./pages/ChangePasswordPage"

import SettingsPage from "./pages/SettingsPage"
import SettingsDocumentInfoPage from "./pages/SettingsDocumentInfoPage"
import SettingsApprovalInfoPage from "./pages/SettingsApprovalInfoPage"
import SettingsDigitalSignaturePage from "./pages/SettingsDigitalSignaturePage"
import SettingsRequestCategoryPage from "./pages/SettingsRequestCategoryPage"
import SettingsRequestRoutingPage from "./pages/SettingsRequestRoutingPage"
import SettingsPrioritySlaPage from "./pages/SettingsPrioritySlaPage"
import SettingsProcessingRulesPage from "./pages/SettingsProcessingRulesPage"

function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  const defaultProfile = {
    fullName: "Nguyễn Văn A",
  }

  const getStoredProfile = () => {
    return (
      JSON.parse(
        localStorage.getItem(
          "hlcProfile"
        )
      ) || defaultProfile
    )
  }

  const [profile, setProfile] =
    useState(
      getStoredProfile()
    )

  // =========================
  // TỰ ĐƯA TRANG VỀ ĐẦU
  // KHI CHUYỂN ROUTE
  // =========================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    })

    const content =
      document.querySelector(
        ".content"
      )

    if (content) {
      content.scrollTop = 0
      content.scrollLeft = 0
    }

    const main =
      document.querySelector(
        ".main"
      )

    if (main) {
      main.scrollTop = 0
      main.scrollLeft = 0
    }
  }, [location.pathname])

  // =========================
  // CẬP NHẬT PROFILE
  // =========================

  useEffect(() => {
    const handleProfileUpdated = (
      event
    ) => {
      if (event.detail) {
        setProfile(
          event.detail
        )
      } else {
        setProfile(
          getStoredProfile()
        )
      }
    }

    window.addEventListener(
      "hlcProfileUpdated",
      handleProfileUpdated
    )

    return () => {
      window.removeEventListener(
        "hlcProfileUpdated",
        handleProfileUpdated
      )
    }
  }, [])

  const titles = {
    "/": "Tổng quan",

    "/documents":
      "Tài liệu",

    "/approval":
      "Trình ký",

    "/service-requests":
      "Yêu cầu dịch vụ",

    "/notifications":
      "Thông báo",

    "/profile":
      "Thông tin cá nhân",

    "/profile/edit":
      "Sửa thông tin cá nhân",

    "/change-password":
      "Đổi mật khẩu",

    "/settings":
      "Thiết lập hệ thống",

    "/settings/document-info":
      "Cấu hình thông tin tài liệu",

    "/settings/approval-info":
      "Cấu hình thông tin trình ký",

    "/settings/digital-signatures":
      "Cấu hình danh sách chữ ký số",

    "/settings/request-categories":
      "Cấu hình danh mục yêu cầu",

    "/settings/request-routing":
      "Cấu hình điều phối yêu cầu",

    "/settings/priority-sla":
      "Cấu hình mức ưu tiên / SLA",

    "/settings/processing-rules":
      "Cấu hình quy tắc xử lý",
  }

  const getPageTitle = () => {
    if (
      location.pathname ===
      "/documents/upload"
    ) {
      return "Tải lên tài liệu"
    }

    if (
      location.pathname.endsWith(
        "/version"
      )
    ) {
      return "Cập nhật phiên bản"
    }

    if (
      location.pathname.endsWith(
        "/share"
      )
    ) {
      return "Chia sẻ tài liệu"
    }

    if (
      location.pathname.startsWith(
        "/documents/"
      )
    ) {
      return "Chi tiết tài liệu"
    }

    if (
      location.pathname ===
      "/approval/create"
    ) {
      return "Khởi tạo trình ký"
    }

    if (
      location.pathname.endsWith(
        "/sign"
      )
    ) {
      return "Ký tài liệu"
    }

    if (
      location.pathname.startsWith(
        "/approval/"
      )
    ) {
      return "Chi tiết trình ký"
    }

    if (
      location.pathname ===
      "/service-requests/create"
    ) {
      return "Tạo yêu cầu dịch vụ"
    }

    if (
      location.pathname.startsWith(
        "/service-requests/"
      )
    ) {
      return "Chi tiết yêu cầu"
    }

    return (
      titles[
        location.pathname
      ] || "HLC E-Office"
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          HLC E-OFFICE
        </div>

        <nav>
          <NavLink to="/">
            Tổng quan
          </NavLink>

          <NavLink to="/documents">
            Tài liệu
          </NavLink>

          <NavLink to="/approval">
            Trình ký
          </NavLink>

          <NavLink to="/service-requests">
            Yêu cầu dịch vụ
          </NavLink>

          <NavLink to="/notifications">
            Thông báo
          </NavLink>

          <NavLink to="/settings">
            Thiết lập hệ thống
          </NavLink>
        </nav>
      </aside>

      <div className="main">
        <header className="header">
          <h2>
            {getPageTitle()}
          </h2>

          <div
            className="user"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
            style={{
              cursor: "pointer",
            }}
          >
            {profile.fullName}
          </div>
        </header>

        <main className="content">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage />
              }
            />

            <Route
              path="/documents"
              element={
                <DocumentsPage />
              }
            />

            <Route
              path="/documents/upload"
              element={
                <DocumentUploadPage />
              }
            />

            <Route
              path="/documents/:id/version"
              element={
                <DocumentVersionPage />
              }
            />

            <Route
              path="/documents/:id/share"
              element={
                <DocumentSharePage />
              }
            />

            <Route
              path="/documents/:id"
              element={
                <DocumentDetailPage />
              }
            />

            <Route
              path="/approval"
              element={
                <ApprovalPage />
              }
            />

            <Route
              path="/approval/create"
              element={
                <ApprovalCreatePage />
              }
            />

            <Route
              path="/approval/:id/sign"
              element={
                <ApprovalSignPage />
              }
            />

            <Route
              path="/approval/:id"
              element={
                <ApprovalDetailPage />
              }
            />

            <Route
              path="/service-requests"
              element={
                <ServiceRequestPage />
              }
            />

            <Route
              path="/service-requests/create"
              element={
                <ServiceRequestCreatePage />
              }
            />

            <Route
              path="/service-requests/:id"
              element={
                <ServiceRequestDetailPage />
              }
            />

            <Route
              path="/notifications"
              element={
                <NotificationsPage />
              }
            />

            <Route
              path="/profile"
              element={
                <ProfilePage />
              }
            />

            <Route
              path="/profile/edit"
              element={
                <ProfileEditPage />
              }
            />

            <Route
              path="/change-password"
              element={
                <ChangePasswordPage />
              }
            />

            <Route
              path="/settings"
              element={
                <SettingsPage />
              }
            />

            <Route
              path="/settings/document-info"
              element={
                <SettingsDocumentInfoPage />
              }
            />

            <Route
              path="/settings/approval-info"
              element={
                <SettingsApprovalInfoPage />
              }
            />

            <Route
              path="/settings/digital-signatures"
              element={
                <SettingsDigitalSignaturePage />
              }
            />

            <Route
              path="/settings/request-categories"
              element={
                <SettingsRequestCategoryPage />
              }
            />

            <Route
              path="/settings/request-routing"
              element={
                <SettingsRequestRoutingPage />
              }
            />

            <Route
              path="/settings/priority-sla"
              element={
                <SettingsPrioritySlaPage />
              }
            />

            <Route
              path="/settings/processing-rules"
              element={
                <SettingsProcessingRulesPage />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App