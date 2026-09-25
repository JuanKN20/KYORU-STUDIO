import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Juegos from './pages/Juegos';
import Contact from './pages/Contact';
import Noticias from './pages/Noticias';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Usuarios from './components/Usuarios';
import Trabajos from './pages/Trabajos';
import Yorutsugi from './pages/Yorutsugi';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import AdminLayout from './admin/AdminLayout';
import AdminGuard from './admin/AdminGuard';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminProjects from './admin/projects/AdminProjects';
import AdminServices from './admin/services/AdminServices';
import AdminProducts from './admin/products/AdminProducts';
import AdminContacts from './admin/contacts/AdminContacts';
import AdminRootRedirect from './admin/AdminRootRedirect';

function AppContent() {
  const showInternalRoutes = import.meta.env.VITE_SHOW_INTERNAL_ROUTES === 'true';
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="akai-shell flex min-h-screen flex-col">
      {!isAdminPath ? <Navbar /> : null}
      <main className="w-full flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/trabajos" element={<Trabajos />} />
          <Route path="/trabajos/yorutsugi" element={<Yorutsugi />} />
          <Route path="/juegos" element={<Juegos />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route path="/usuarios" element={showInternalRoutes ? <Usuarios /> : <Navigate to="/" replace />} />
          <Route path="/login" element={showInternalRoutes ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/noticias" element={showInternalRoutes ? <Noticias /> : <Navigate to="/" replace />} />

          {showInternalRoutes ? (
            <>
              <Route path="/admin/login" element={<AdminLogin showInternalRoutes={showInternalRoutes} />} />
              <Route
                path="/admin"
                element={
                  <AdminGuard showInternalRoutes={showInternalRoutes}>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<AdminRootRedirect />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
            </>
          ) : (
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPath ? <Footer /> : null}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
