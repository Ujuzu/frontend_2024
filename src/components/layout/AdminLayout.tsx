// src/components/layout/AdminLayout.tsx
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Add admin-specific header/sidebar here */}
      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

export default AdminLayout;
