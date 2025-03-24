import { FilterIcon } from '@/assets/icons';
import table_avatar from '@/assets/images/table_avatar.png';
import { Popover } from 'flowbite';
const tableData = [
  {
    name: 'Asam Manny',
    email: 'ujuzi@gmail.com',
    id_num: 'UZ/2025/345',
    role: 'Admin',
    status: true,
  },
  {
    name: 'Asam Manny',
    email: 'ujuzi@gmail.com',
    id_num: 'UZ/2025/345',
    role: 'Admin',
    status: true,
  },
  {
    name: 'Asam Manny',
    email: 'ujuzi@gmail.com',
    id_num: 'UZ/2025/345',
    role: 'Admin',
    status: false,
  },
];

export default function UserManagement() {
  return (
    <section className="p-3">
      <aside className=" min-w-[50rem] ">
        <div className="flex justify-between items-center py-10">
          <Popover
            placement="bottom"
            className=" bg-white  shadow"
            content={
              <div className="w-32 text-sm  ">
                <div className="">
                  <ul className="flex flex-col py-1">
                    <li className="hover:bg-gray-50 p-2">Status</li>
                    <li className="hover:bg-gray-50 p-2">Role</li>
                  </ul>
                </div>
              </div>
            }
          >
            <button className=" flex py-2 px-6 gap-2 rounded bg-black items-center text-white">
              <span>Filter By</span>
              <FilterIcon className="w-4 h-4" />
            </button>
          </Popover>

          <button className=" flex py-2 px-6 gap-2 rounded bg-black items-center text-white">
            <span>Add User By</span>+
          </button>
        </div>

        <div className="mt-16">
          <h1 className=" mb-6 font-semibold text-lg">Users</h1>
          <div className=" overflow-auto  w-full   bg-white rounded-lg border-2 border-gray-200">
            <div className="rounded-lg">
              <table className="w-full  text-sm text-left rtl:text-right rounded-lg text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Name
                    </th>

                    <th scope="col" className="px-4 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-3">
                      ID Number
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3 ">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 ">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map(
                    ({ name, email, id_num, status, role }, inx) => (
                      <tr
                        key={inx}
                        className="border-b  border-gray-300 text-sm   text-nowrap"
                      >
                        <th
                          scope="row"
                          className="ps-5 py-2.5 font-medium text-gray-900 whitespace-nowrap "
                        >
                          <div className="flex items-center gap-2">
                            <img
                              className="w-10 h-10 object-cover rounded-full"
                              src={table_avatar}
                            />
                            <span>{name}</span>
                          </div>
                        </th>
                        <td className="px-4 py-2.5">{email}</td>
                        <td className="px-4 py-2.5">{id_num}</td>
                        <td className="px-4 py-2.5">{role}</td>
                        <td
                          className={`px-4 py-1.5 ${
                            status ? ' text-[#19B23A]' : ''
                          } `}
                        >
                          {status ? 'Active' : 'Inactive'}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-x-5 font-medium">
                            <button className="text-[#1e57c7]">Edit</button>
                            <button className=" text-[#CC0909]">Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              <div className=" p-8 flex items-center ">
                Showing 1 to 10 of 97 results
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
