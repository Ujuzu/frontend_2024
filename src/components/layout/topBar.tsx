import { BellIcon, ChatIcon, FillCaretIcon } from '@/assets/icons';
import SearchInput from '../input/searchInput';
import Badge from '../badge';
import avatar from '@/assets/images/avatar.png';

export default function TopBar() {
  return (
    <section className=" ">
      <nav className=" h-18 px-8">
        <ol className=" flex justify-between items-center h-full">
          <li>
            <div className="">
              <p className=" text-sm font-light">Good Morning</p>
              <p className="  font-medium">Dashboard</p>
            </div>
          </li>
          <li>
            <div className=" shadow rounded-md w-[25rem] py-1">
              <SearchInput sz="sm" placeholder="Search Dashboard" />
            </div>
          </li>
          <li className=" flex items-center gap-3">
            <button className=" cursor-pointer p-2.5 rounded bg-[#FFEEE8]">
              <ChatIcon className=" w-6 h-6" />
            </button>
            <button className="  cursor-pointer p-2.5 rounded bg-[#F5F7FA]">
              <span className="relative inline-block">
                <Badge className="!w-2 !h-2" />
                <BellIcon className="w-7 h-7 " />
              </span>
            </button>
            <button className=" cursor-pointer flex items-center gap-2">
              <img
                className="w-10 h-10 object-cover rounded-full"
                src={avatar}
              />
              <FillCaretIcon className=" w-6 h-6 text-black" />
            </button>
          </li>
        </ol>
      </nav>
    </section>
  );
}
