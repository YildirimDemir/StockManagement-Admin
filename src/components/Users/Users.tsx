'use client';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IUser } from '@/models/userModel';
import { deleteUserById, getAllUsers } from '@/services/apiUsers';
import Style from './users.module.css'
import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import { FaSearch } from "react-icons/fa";

export default function Users() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof IUser; direction: 'asc' | 'desc' } | null>(null);
  
    const filteredUsers = React.useMemo(() => {
      if (!searchQuery) return users;
      return users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [searchQuery, users]);
    
    const sortedUsers = React.useMemo(() => {
        if (!sortConfig) return filteredUsers;
      
        const sorted = [...filteredUsers];
      
        sorted.sort((a, b) => {
          const key = sortConfig.key;
          const valueA = a[key]?.toString() || '';
          const valueB = b[key]?.toString() || '';
          return sortConfig.direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        });
      
        return sorted;
      }, [filteredUsers, sortConfig]);
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    };  

    useEffect(() => {
        const getUsers = async () => {
            try {
                const allUsers = await getAllUsers();
                setUsers(allUsers);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        getUsers();
    }, [])

    const handleSort = (key: keyof IUser) => {
        setSortConfig((prevConfig) => {
            if (prevConfig && prevConfig.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };
    

    const handleDeleteUser = async (userId: string) => {
        try {
            deleteUserById(userId)
            toast.success('User deleted successfully');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    if (loading) return <Loader />;
    
  return (
    <div className={Style.dataPage}>
        <div className={Style.dataHeader}>
            <div className={Style.searchInput}>
              <span><FaSearch /></span>
              <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              />
            </div>
            <h2>Users</h2>
        </div>
        <div className={Style.dataList}>
          {users.length > 0 ? (
            <Table className={Style.table}>
            <TableCaption className={Style.tableCaption}>All Users</TableCaption>
            <TableHeader>
               <TableRow className={Style.tableRow}>
                 <TableHead className={Style.tableHead} onClick={() => handleSort('name')}>
                   Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                 </TableHead>
                 <TableHead className={Style.tableHead} onClick={() => handleSort('username')}>
                   Username {sortConfig?.key === 'username' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                 </TableHead>
                 <TableHead className={Style.tableHead} onClick={() => handleSort('email')}>
                   Email {sortConfig?.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                 </TableHead>
                 <TableHead className={Style.tableHead} onClick={() => handleSort('role')}>
                   Role {sortConfig?.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                 </TableHead>
                 <TableHead className={Style.tableHead}>
                   Manage 
                 </TableHead>
               </TableRow>
             </TableHeader>

             <TableBody>
               {sortedUsers.map((user) => (
                 <TableRow key={user._id?.toString()} className={Style.tableRowItems}>
                   <TableCell className={Style.tableCell}>{user.name}</TableCell>
                   <TableCell className={Style.tableCell}>{user.username}</TableCell>
                   <TableCell className={Style.tableCell}>{user.email}</TableCell>
                   <TableCell className={Style.tableCell}>{user.role}</TableCell>
                   <TableCell className={Style.tableCell} onClick={() => handleDeleteUser(user._id)}><button>Delete</button></TableCell>
                 </TableRow>
               ))}
             </TableBody>
        </Table>
          ) : (
            <h1 className="text-white">No Stocks</h1>
          )}
        </div>
    </div>
  )
}
