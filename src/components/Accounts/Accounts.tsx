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
import Style from './accounts.module.css'
import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import { FaSearch } from "react-icons/fa";
import { IAccount } from "@/models/accountModel";
import { deleteAccountById, fetchAccountById, fetchUserAccounts } from "@/services/apiAccount";
import { IStock } from "@/models/stockModel";

export default function Accounts() {
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof IAccount; direction: 'asc' | 'desc' } | null>(null);
    const [owners, setOwners] = useState<{ [key: string]: string }>({});
    const [totalItems, setTotalItems] = useState<{ [key: string]: number }>({});
  
    const filteredAccounts = React.useMemo(() => {
        if (!searchQuery) return accounts;
        return accounts.filter(account => {
          const ownerName = owners[account._id!] || ''; 
          return (
            account.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.plan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ownerName.toLowerCase().includes(searchQuery.toLowerCase()) 
          );
        });
      }, [searchQuery, accounts, owners]);
      
    
    const sortedAccounts = React.useMemo(() => {
        if (!sortConfig) return filteredAccounts;
    
        const sorted = [...filteredAccounts];
    
        sorted.sort((a, b) => {
            const key = sortConfig.key;

            if (key === 'owner') {
                const ownerA = owners[a._id!] || '';
                const ownerB = owners[b._id!] || ''; 
                return sortConfig.direction === 'asc'
                    ? ownerA.localeCompare(ownerB)
                    : ownerB.localeCompare(ownerA);
            }
    
            const valueA = a[key]?.toString() || '';
            const valueB = b[key]?.toString() || '';
            return sortConfig.direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });
    
        return sorted;
    }, [filteredAccounts, sortConfig, owners]);
    
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    };  

    useEffect(() => {
        const getUsers = async () => {
            try {
                const allAccounts = await fetchUserAccounts();
                setAccounts(allAccounts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        getUsers();
    }, [])

    const handleSort = (key: keyof IAccount | 'owner') => {
        setSortConfig((prevConfig) => {
            if (prevConfig && prevConfig.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };    
    

    const handleDeleteAccounts = async (accountId: string) => {
        try {
            deleteAccountById(accountId)
            toast.success('Account deleted successfully');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getSingleAccountData = async (accountId: string) => {
        const accountData = await fetchAccountById(accountId);
      
        setOwners((prevOwners) => ({
          ...prevOwners,
          [accountId]: accountData.owner?.email || "Unknown",
        }));
      
        const totalItems = accountData.stocks?.reduce((total: number, stock: IStock) => {
          return total + (stock.items?.length || 0); 
        }, 0) || 0;
      
        setTotalItems((prevItems) => ({
          ...prevItems,
          [accountId]: totalItems,
        }));
      };
      
      
      useEffect(() => {
        sortedAccounts.forEach((account) => {
          if (account._id && (!owners[account._id] || totalItems[account._id] === undefined)) {
            getSingleAccountData(account._id);
          }
        });
      }, [sortedAccounts]);      
      

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
            <h2>Accounts</h2>
        </div>
        <div className={Style.dataList}>
          {accounts.length > 0 ? (
            <Table className={Style.table}>
            <TableCaption className={Style.tableCaption}>All Users</TableCaption>
            <TableHeader>
               <TableRow className={Style.tableRow}>
                 <TableHead className={Style.tableHead} onClick={() => handleSort('name')}>
                   Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                 </TableHead>
                 <TableHead className={Style.tableHead} onClick={() => handleSort('plan')}>
                   Plan {sortConfig?.key === 'plan' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                 </TableHead>
                 <TableHead className={Style.tableHead} onClick={() => handleSort('owner')}>
                   Owner {sortConfig?.key === 'owner' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                 </TableHead>
                 <TableHead className={Style.tableHead}>
                   Managers
                 </TableHead>
                 <TableHead className={Style.tableHead} >
                   Stocks
                 </TableHead>
                 <TableHead className={Style.tableHead} >
                   Items
                 </TableHead>
                 <TableHead className={Style.tableHead}>
                   Manage 
                 </TableHead>
               </TableRow>
             </TableHeader>

             <TableBody>
               {sortedAccounts.map((account) => {
                return(
                 <TableRow key={account._id?.toString()} className={Style.tableRowItems}>
                   <TableCell className={Style.tableCell}>{account.name}</TableCell>
                   <TableCell className={Style.tableCell}>{account.plan}</TableCell>
                   <TableCell className={Style.tableCell}>{owners[account._id] || "Loading..."}</TableCell>
                   <TableCell className={Style.tableCell}>{account.managers?.length}</TableCell>
                   <TableCell className={Style.tableCell}>{account.stocks?.length}</TableCell>
                   <TableCell className={Style.tableCell}>{totalItems[account._id] !== undefined ? totalItems[account._id] : "Loading..."}</TableCell>
                   <TableCell className={Style.tableCell} onClick={() => handleDeleteAccounts(account._id)}><button>Delete</button></TableCell>
                 </TableRow>
                )
               })}
             </TableBody>
        </Table>
          ) : (
            <h1 className="text-white">No Accounts</h1>
          )}
        </div>
    </div>
  )
}
