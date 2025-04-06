import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'; 
const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: number;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface UserFormData {
  username?: string;
  email?: string;
  password?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<User[]>([]); // Store all fetched users
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  
  // Dialog states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isBlockUserOpen, setIsBlockUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<UserFormData>({});
  
  // Filter state
  const [filterText, setFilterText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Function to fetch all users from Strapi
  const fetchUsers = async (filter = '') => {
    setIsLoading(true);
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      // First try to get total count to determine pagination strategy
      const countResponse = await axios.get(`${API_URL}/api/users/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => ({ data: null })); // Gracefully handle if count endpoint doesn't exist
      
      let allFetchedUsers: User[] = [];
      
      // If filter is provided, use search query
      if (filter) {
        const response = await axios.get<User[]>(
          `${API_URL}/api/users?filters[$or][0][username][$containsi]=${filter}&filters[$or][1][email][$containsi]=${filter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        allFetchedUsers = response.data;
      } else {
        // If total count is small enough or count endpoint doesn't exist, fetch all users at once
        if (!countResponse.data || countResponse.data < 100) {
          const response = await axios.get<User[]>(
            `${API_URL}/api/users?pagination[pageSize]=100`, // Get a reasonably large batch
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          allFetchedUsers = response.data;
        } else {
          // For large datasets, implement batched fetching
          let page = 1;
          let hasMore = true;
          
          while (hasMore) {
            const response = await axios.get<User[]>(
              `${API_URL}/api/users?pagination[page]=${page}&pagination[pageSize]=100`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            if (response.data.length > 0) {
              allFetchedUsers = [...allFetchedUsers, ...response.data];
              page++;
            } else {
              hasMore = false;
            }
            
            // Safety check to prevent infinite loops
            if (page > 10) hasMore = false;
          }
        }
      }
      
      // Store all users for client-side pagination and filtering
      setAllUsers(allFetchedUsers);
      setFilteredUsers(allFetchedUsers);
      
      // Apply client-side pagination
      applyPagination(allFetchedUsers, 1);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply pagination to the filtered users array
  const applyPagination = (usersList: User[], page: number) => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    setUsers(usersList.slice(startIndex, endIndex));
  };
  
  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Handle filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterText) {
        // Apply client-side filtering
        const lowercasedFilter = filterText.toLowerCase();
        const filtered = allUsers.filter(user => 
          user.username.toLowerCase().includes(lowercasedFilter) || 
          user.email.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page when filtering
        applyPagination(filtered, 1);
      } else {
        // If filter is cleared, restore all users
        setFilteredUsers(allUsers);
        applyPagination(allUsers, 1);
        setCurrentPage(1);
      }
    }, 500); // Debounce for 500ms
    return () => clearTimeout(timer);
  }, [filterText, allUsers]);
  
  // Handle page changes
  useEffect(() => {
    applyPagination(filteredUsers, currentPage);
  }, [currentPage, filteredUsers]);
  
  const handleAddUser = () => {
    setFormData({});
    setIsAddUserOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email
    });
    setIsEditUserOpen(true);
  };
  
  const handleToggleBlockUser = (user: User) => {
    setSelectedUser(user);
    setIsBlockUserOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const saveUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (isAddUserOpen) {
        // Create new user
        // Match structure required by Strapi
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password
        };
        
        await axios.post(
          `${API_URL}/api/auth/local/register`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        toast.success('User created successfully!');
        setIsAddUserOpen(false);
      } else if (isEditUserOpen && selectedUser) {
        // Update existing user
        // Note: password update might require different endpoint
        const userData = {
          username: formData.username,
          email: formData.email
        };
        
        // Only include password if it was entered
        if (formData.password && formData.password.trim() !== '') {
          (userData as any).password = formData.password;
        }
        
        await axios.put(
          `${API_URL}/api/users/${selectedUser.id}`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        toast.success('User updated successfully!');
        setIsEditUserOpen(false);
      }
      
      // Refresh the user list
      fetchUsers(filterText);
      
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user. Please try again.');
    }
    
    setFormData({});
    setSelectedUser(null);
  };
  
  const confirmToggleBlock = async () => {
    if (selectedUser) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.put(
          `${API_URL}/api/users/${selectedUser.id}`,
          { blocked: !selectedUser.blocked },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        toast.success(`User ${selectedUser.blocked ? 'activated' : 'blocked'} successfully!`);
        
        // Refresh the user list
        fetchUsers(filterText);
        
      } catch (error) {
        console.error('Error updating user block status:', error);
        toast.error('Failed to update user status. Please try again.');
      }
      
      setIsBlockUserOpen(false);
      setSelectedUser(null);
    }
  };
  
  const totalResults = filteredUsers.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
    
  return (
    <div className="container mx-auto p-6">
      {/* Add Toaster component for notifications */}
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <Button 
            onClick={handleAddUser}
            className="bg-[#AC19AD] hover:bg-[#8A1489] text-white"
          >
            Add User
            <span className="ml-2">+</span>
          </Button>
        </div>
        
        {/* Filter bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-48">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <Input
              className="pl-10 py-2 pr-4 border rounded-md"
              placeholder="Filter By"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
        
        {/* Users Table - Updated to match Strapi response */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AC19AD]"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confirmed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blocked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.provider}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.confirmed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.confirmed ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                         user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {user.blocked ? 'True' : 'False'}
                      </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleBlockUser(user)}
                          className={user.blocked ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"}
                        >
                          {user.blocked ? 'Activate' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{totalResults > 0 ? (currentPage - 1) * resultsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * resultsPerPage, totalResults)}</span> of{' '}
                <span className="font-medium">{totalResults}</span> results
              </p>
            </div>
            <div>
              {totalPages > 0 && (
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    &lt;
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                    let pageNumber;
                    
                    if (totalPages <= 5) {
                      // If we have 5 or fewer pages, show all pages
                      pageNumber = idx + 1;
                    } else if (currentPage <= 3) {
                      // If we're near the start, show pages 1-5
                      pageNumber = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // If we're near the end, show the last 5 pages
                      pageNumber = totalPages - 4 + idx;
                    } else {
                      // Otherwise show 2 before and 2 after current page
                      pageNumber = currentPage - 2 + idx;
                    }
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => goToPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNumber
                            ? 'bg-[#AC19AD] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AC19AD]'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    &gt;
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add User Dialog - Simplified */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="password" className="text-right text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUser} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog - Simplified */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-username" className="text-right text-sm font-medium">
                Username
              </label>
              <Input
                id="edit-username"
                name="username"
                value={formData.username || ''}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-password" className="text-right text-sm font-medium">
                Password
              </label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={formData.password || ''}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUser} className="bg-[#AC19AD] hover:bg-[#8A1489] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Block/Activate User Dialog */}
      <Dialog open={isBlockUserOpen} onOpenChange={setIsBlockUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.blocked ? 'Confirm Activation' : 'Confirm Block'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to {selectedUser?.blocked ? 'activate' : 'block'} this user?
              {selectedUser?.blocked 
                ? ' The user will regain access to the system.' 
                : ' The user will no longer be able to access the system.'}
            </p>
            {selectedUser && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p><strong>Username:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>ID:</strong> {selectedUser.id}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockUserOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmToggleBlock} 
              className={selectedUser?.blocked 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {selectedUser?.blocked ? 'Activate' : 'Block'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
