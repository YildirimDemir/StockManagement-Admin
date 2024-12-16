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
import Style from './admins.module.css'
import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import { FaSearch } from "react-icons/fa";
import { IAdmin } from "@/models/adminModel";
import { deleteAdminById, getAllAdmins } from "@/services/apiAdmins";
import CreateAdminModal from "./CreateAdminModal";

export default function Admins() {
    const [admins, setAdmins] = useState<IAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof IAdmin; direction: 'asc' | 'desc' } | null>(null);
    const [isCreateAdminModal, setIsCreateAdminModal] = useState(false);
  
    const filteredAdmins = React.useMemo(() => {
      if (!searchQuery) return admins;
      return admins.filter(admin =>
        admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [searchQuery, admins]);
    
    const sortedAdmins = React.useMemo(() => {
        if (!sortConfig) return filteredAdmins;
      
        const sorted = [...filteredAdmins];
      
        sorted.sort((a, b) => {
          const key = sortConfig.key;
          const valueA = a[key]?.toString() || '';
          const valueB = b[key]?.toString() || '';
          return sortConfig.direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        });
      
        return sorted;
      }, [filteredAdmins, sortConfig]);
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    };  

    useEffect(() => {
        const getAdmins = async () => {
            try {
                const allAdmins = await getAllAdmins();
                setAdmins(allAdmins);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        getAdmins();
    }, [])

    const handleSort = (key: keyof IAdmin) => {
        setSortConfig((prevConfig) => {
            if (prevConfig && prevConfig.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };
    

    const handleDeleteAdmin = async (adminId: string) => {
        try {
            deleteAdminById(adminId)
            toast.success('Admin deleted successfully');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const toggleCreateAdmin = () => {
        setIsCreateAdminModal(!isCreateAdminModal)
    }

    if (loading) return <Loader />;
    
  return (
    <div className={Style.dataPage}>
        <CreateAdminModal onClose={toggleCreateAdmin} isOpen={isCreateAdminModal} />
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
            <h2>Admins</h2>
            <div className={Style.openBtn}>
              <button className={Style.openModalBtn} onClick={toggleCreateAdmin}>Create Admin</button>
            </div>
        </div>
        <div className={Style.dataList}>
          {admins.length > 0 ? (
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
                 <TableHead className={Style.tableHead}>
                   Role 
                 </TableHead>
                 <TableHead className={Style.tableHead}>
                   Manage 
                 </TableHead>
               </TableRow>
             </TableHeader>

             <TableBody>
               {sortedAdmins.map((admin) => (
                 <TableRow key={admin._id?.toString()} className={Style.tableRowItems}>
                   <TableCell className={Style.tableCell}>{admin.name}</TableCell>
                   <TableCell className={Style.tableCell}>{admin.username}</TableCell>
                   <TableCell className={Style.tableCell}>{admin.email}</TableCell>
                   <TableCell className={Style.tableCell}>{admin.role}</TableCell>
                   <TableCell className={Style.tableCell} onClick={() => handleDeleteAdmin(admin._id)}><button>Delete</button></TableCell>
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
