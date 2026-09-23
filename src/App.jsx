import React from 'react';
import { useRental } from './context/RentalContext';
import ToastContainer from './shared/Toast';

// Customer / User Modules
import UserHeader from './user/components/UserHeader';
import UserFooter from './user/components/UserFooter';
import CatalogPage from './user/pages/CatalogPage';
import BookingPage from './user/pages/BookingPage';
import OrderSuccessPage from './user/pages/OrderSuccessPage';
import OnRentNoticeModal from './user/components/OnRentNoticeModal';
import EquipmentDetailModal from './user/components/EquipmentDetailModal';
import CartDrawer from './user/components/CartDrawer';

// Admin Modules
import AdminNavbar from './admin/components/AdminNavbar';
import AdminFooter from './admin/components/AdminFooter';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';

export default function App() {
  const { activeView, toasts, dismissToast } = useRental();

  const renderActivePage = () => {
    switch (activeView) {
      case 'booking':
        return <BookingPage />;
      case 'success':
        return <OrderSuccessPage />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'catalog':
      default:
        return <CatalogPage />;
    }
  };

  const isAdminView = activeView === 'admin' || activeView === 'admin-login';

  return (
    <div className="min-h-screen flex flex-col antialiased bg-slate-50">
      {!isAdminView && <UserHeader />}
      {activeView === 'admin' && <AdminNavbar />}
      <main className="flex-1">{renderActivePage()}</main>
      {!isAdminView && <UserFooter />}
      {activeView === 'admin' && <AdminFooter />}
      <OnRentNoticeModal />
      <EquipmentDetailModal />
      <CartDrawer />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
