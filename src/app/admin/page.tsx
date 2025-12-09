// src/app/admin/page.tsx

import { AdminLayout } from "@/components/views/admin/admin-layout";
import DashboardView from "@/components/views/admin/dashboard-view";

const AdminPage = () => {
  return (
    <AdminLayout>
      <DashboardView />
    </AdminLayout>
  );
};

export default AdminPage;
