import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Eye, Edit, Lock, Unlock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AddUserDialog from './dialogs/AddUserDialog';
import EditUserDialog from './dialogs/EditUserDialog';
import BlockUserDialog from './dialogs/BlockUserDialog';
import ViewUserDialog from './dialogs/ViewUserDialog';

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
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
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
  
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewUserOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const saveUser = async (userData: UserFormData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (isAddUserOpen) {
        // Create new user
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
  
  // Generate array of page numbers to display in pagination
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      // Near the start
      return [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    } else {
      // In the middle
      return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
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
          <div className="relative w-64">
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
        
        {/* Users Table with shadcn/ui Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AC19AD]"></div>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="font-bold px-6">ID</TableHead>
                  <TableHead className="font-bold px-6">Username</TableHead>
                  <TableHead className="font-bold px-6">Email</TableHead>
                  <TableHead className="font-bold px-6">Provider</TableHead>
                  <TableHead className="font-bold px-6">Confirmed</TableHead>
                  <TableHead className="font-bold px-6">Blocked</TableHead>
                  <TableHead className="font-bold px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={user.id} className={index === 0 ? "bg-gray-50" : "hover:bg-gray-50"}>
                      <TableCell className="font-medium px-6">{user.id}</TableCell>
                      <TableCell className="px-6">{user.username}</TableCell>
                      <TableCell className="px-6">{user.email}</TableCell>
                      <TableCell className="px-6">{user.provider}</TableCell>
                      <TableCell className="px-6">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.confirmed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.confirmed ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                         user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.blocked ? 'True' : 'False'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full p-1.5"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="h-8 w-8 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded-full p-1.5"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleBlockUser(user)}
                            className={`h-8 w-8 ${
                              user.blocked 
                                ? "text-green-600 hover:text-green-900 hover:bg-green-50"
                                : "text-red-600 hover:text-red-900 hover:bg-red-50"
                            }rounded-full p-1.5 `}
                            title={user.blocked ? "Activate User" : "Block User"}
                          >
                            {user.blocked ? <Unlock size={18} /> : <Lock size={18} />}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Pagination with shadcn/ui Pagination */}
        <div className="mt-6 flex flex-col items-center justify-between space-y-4 border-t pt-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{totalResults > 0 ? (currentPage - 1) * resultsPerPage + 1 : 0}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * resultsPerPage, totalResults)}</span> of{" "}
            <span className="font-medium">{totalResults}</span> results
          </div>
          
          {totalPages > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => goToPage(currentPage - 1)}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer text-[#AC19AD]"}`}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {/* First page */}
                {currentPage > 3 && totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => goToPage(1)}
                        className="text-[#AC19AD] hover:bg-purple-50"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis className="text-[#AC19AD]" />
                      </PaginationItem>
                    )} 
                  </>
                )}
                
                {/* Page numbers */}
                {getPageNumbers().map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      onClick={() => goToPage(pageNum)} 
                      isActive={pageNum === currentPage}
                      className={pageNum === currentPage ? "bg-[#AC19AD] text-white" : "text-[#AC19AD] hover:bg-purple-50"}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {/* Last page */}
                {currentPage < totalPages - 2 && totalPages > 5 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis className="text-[#AC19AD]" />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => goToPage(totalPages)}
                        className="text-[#AC19AD] hover:bg-purple-50"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => goToPage(currentPage + 1)}
                    className={`${currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer text-[#AC19AD]"}`}
                    aria-disabled={currentPage === totalPages || totalPages === 0}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
      
      {/* Import the dialog components */}
      <AddUserDialog 
        isOpen={isAddUserOpen} 
        onOpenChange={setIsAddUserOpen}
        formData={formData}
        onFormChange={handleFormChange}
        onSave={() => saveUser(formData)}
      />
      
      <EditUserDialog 
        isOpen={isEditUserOpen} 
        onOpenChange={setIsEditUserOpen}
        formData={formData}
        onFormChange={handleFormChange}
        onSave={() => saveUser(formData)}
      />
      
      <BlockUserDialog 
        isOpen={isBlockUserOpen} 
        onOpenChange={setIsBlockUserOpen}
        selectedUser={selectedUser}
        onConfirm={confirmToggleBlock}
      />
      
      <ViewUserDialog
        isOpen={isViewUserOpen}
        onOpenChange={setIsViewUserOpen}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagement;
