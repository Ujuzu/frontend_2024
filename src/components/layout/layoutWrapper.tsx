import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import TopBar from './topBar';

export default function LayoutWrapper() {
  return (
    <main className="min-h-max  bg-white ">
      <section className="max-w-screen-2xl mx-auto  h-screen flex">
        <Sidebar />
        <aside className=" flex-1 flex flex-col">
          <TopBar />
          <div className="bg-[#f5f7fa] flex-1 ">
            <Outlet />
          </div>
        </aside>
      </section>
    </main>
  );
}
