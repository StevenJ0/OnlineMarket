// src/app/admin/products/page.tsx

import { AdminLayout } from "@/components/views/admin/admin-layout";
import AdminProductsView from "@/components/views/admin/admin-products-view";

const AdminProductsPage = () => {
  return (
    <AdminLayout>
      <AdminProductsView />
    </AdminLayout>
  );
};

export default AdminProductsPage;
