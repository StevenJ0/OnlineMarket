// src/app/admin/store/page.tsx

import { AdminLayout } from "@/components/views/admin/admin-layout";
import AdminStoreView from "@/components/views/admin/admin-store-view";

const AdminStorePage = () => {
  return (
    <AdminLayout>
      <AdminStoreView />
    </AdminLayout>
  );
};

export default AdminStorePage;
