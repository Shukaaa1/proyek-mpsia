import React from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminKPIs from '../components/AdminKPIs';
import OrdersTable from '../components/OrdersTable';
import InventoryTable from '../components/InventoryTable';
import PickupModal from '../components/PickupModal';

export default function AdminDashboardPage() {
  return (
    <section id="view-admin" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminHeader />
      <AdminKPIs />
      <OrdersTable />
      <InventoryTable />
      <PickupModal />
    </section>
  );
}
