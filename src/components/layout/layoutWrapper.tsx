import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import TopBar from './topBar';

export default function LayoutWrapper() {
  return (
    <main className="min-h-screen bg-white">
      <section className="flex h-screen">
        <Sidebar />
        <aside className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <div className="bg-[#f5f7fa] flex-1 overflow-auto">
            <Outlet />
          </div>
        </aside>
      </section>
    </main>
  );
}
