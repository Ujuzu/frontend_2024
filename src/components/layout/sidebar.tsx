import {
  ContentIcon,
  LogoutIcon,
  MonitorIcon,
  SubIcon,
  UsersIcon,
} from '@/assets/icons';
import logo from '@/assets/images/logo.png';
import { USER_MANAGEMENT_PATH } from '@/data/url.data';
import { NavLink, useLocation } from 'react-router-dom';

const links = [
  {
    title: 'Platform Monitoring',
    icon: <MonitorIcon className=" w-6" />,
    path: '/u/p',
  },
  {
    title: 'User Management',
    icon: <UsersIcon className=" w-6" />,
    path: USER_MANAGEMENT_PATH,
  },
  {
    title: 'Content Management',
    icon: <ContentIcon className=" w-6" />,
    path: '/u/c',
  },
  {
    title: 'Subscription Management',
    icon: <SubIcon className=" w-6" />,
    path: '/u/s',
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <section className=" w-[] h-full bg-[#000b17] ps-10 py-6 pe-4">
      <img src={logo} className="w-24" />

      <nav className=" pt-12 h-full">
        <ul className=" flex flex-col gap-y-2 h-full">
          {links.map(({ path, title, icon }) => {
            const questionMarkIndex = path.indexOf('?');
            const linkWithoutQuery =
              questionMarkIndex !== -1
                ? path.substring(0, questionMarkIndex)
                : path;

            const isActive = pathname.toLowerCase().includes(linkWithoutQuery);

            return (
              <li key={title}>
                <NavLink
                  className={`${
                    isActive ? 'bg-[#AC19AD]' : 'text-GRAY_04'
                  } font-medium capitalize  py-3 px-4 hover:bg-[#AC19AD] flex text-white items-center gap-2 `}
                  to={path}
                >
                  <span className={`${isActive ?? 'text-GREEN_01'}`}>
                    {icon}
                  </span>
                  <span>{title}</span>
                </NavLink>
              </li>
            );
          })}
          <li className=" my-auto pt-32">
            <button className="flex text-white gap-2 items-center">
              <LogoutIcon className="w-6 text-[#AC19AD] " />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
}
