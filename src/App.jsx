import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { AdminAuthProvider } from './context/AdminAuthContext'
import AdminGuard from './components/AdminGuard/AdminGuard'
import Homepage from './pages/Homepage'
import ContactPage from './pages/ContactPage'
import DealerInquiryPage from './pages/DealerInquiryPage'
import BlogsPage from './pages/BlogsPage'
import BlogInnerPage from './pages/BlogInnerPage'
import CareerPage from './pages/CareerPage'
import JobDetailPage from './pages/JobDetailPage'
import JobApplicationPage from './pages/JobApplicationPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminBlogsListPage from './pages/admin/AdminBlogsListPage'
import AdminBlogEditorPage from './pages/admin/AdminBlogEditorPage'
import AdminJobsListPage from './pages/admin/AdminJobsListPage'
import AdminJobEditorPage from './pages/admin/AdminJobEditorPage'
import AdminJobApplicationsPage from './pages/admin/AdminJobApplicationsPage'
import AdminContactEnquiriesPage from './pages/admin/AdminContactEnquiriesPage'
import AdminDealerEnquiriesPage from './pages/admin/AdminDealerEnquiriesPage'
import AdminBrochurePage from './pages/admin/AdminBrochurePage'

// The marketing chrome (fixed header, Lenis-driven footer) only wraps the
// public site — the admin panel is a plain dashboard with its own layout.
const PublicLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
)

function App() {

  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dealer-inquiry" element={<DealerInquiryPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogInnerPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/career/:slug" element={<JobDetailPage />} />
            <Route path="/career/:slug/apply" element={<JobApplicationPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="blogs" element={<AdminBlogsListPage />} />
              <Route path="blogs/new" element={<AdminBlogEditorPage />} />
              <Route path="blogs/:id" element={<AdminBlogEditorPage />} />
              <Route path="jobs" element={<AdminJobsListPage />} />
              <Route path="jobs/new" element={<AdminJobEditorPage />} />
              <Route path="jobs/:id" element={<AdminJobEditorPage />} />
              <Route path="applications" element={<AdminJobApplicationsPage />} />
              <Route path="contact-enquiries" element={<AdminContactEnquiriesPage />} />
              <Route path="dealer-enquiries" element={<AdminDealerEnquiriesPage />} />
              <Route path="brochure" element={<AdminBrochurePage />} />
            </Route>
          </Route>
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App
