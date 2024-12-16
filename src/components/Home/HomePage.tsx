'use client';

import Style from './homepage.module.css'
import { IAdmin } from '@/models/adminModel';
import { getAllAdmins } from '@/services/apiAdmins';
import React, { useEffect, useState } from 'react';
import Loader from '../ui/Loader';
import { getAllUsers } from '@/services/apiUsers';
import { IUser } from '@/models/userModel';
import { fetchUserAccounts } from '@/services/apiAccount';
import { fetchStocks } from '@/services/apiStock';
import { getItems } from '@/services/apiItems';
import { FaBoxes, FaClipboardList, FaCube, FaDollarSign, FaUser, FaUserTie } from 'react-icons/fa';

export default function HomePage() {
  const [admins, setAdmins] = useState<IAdmin[] | null>([]);
  const [users, setUsers] = useState<IUser[] | null>([]);
  const [accounts, setAccounts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [items, setItems] = useState([]);
  const [totalEarn, setTotalEarn] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateTotalEarn = (accounts: any[]) => {
      const planPrices = {
        Free: 0,
        Pro: 19,
        Business: 50,
      };

      const total = accounts.reduce((sum, account) => {
        const plan = account.plan as keyof typeof planPrices; 
        return sum + (planPrices[plan] || 0);
      }, 0);

      if (total >= 1_000_000) {
        return `${(total / 1_000_000).toFixed(1)}M`;
      } else if (total >= 1_000) {
        return `${(total / 1_000).toFixed(1)}K`;
      } else {
        return `$${total}`;
      }
    };

    const getData = async () => {
      try {
        const allAdmins = await getAllAdmins();
        setAdmins(allAdmins);

        const allUsers = await getAllUsers();
        setUsers(allUsers);

        const allAccounts = await fetchUserAccounts();
        setAccounts(allAccounts);

        const allStocks = await fetchStocks();
        setStocks(allStocks);

        const allItems = await getItems();
        setItems(allItems);

        const total = calculateTotalEarn(allAccounts);
        setTotalEarn(total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <Loader />;
  
  return (
    <div className={Style.projectStatsPage}>
      <h1>Project Stats</h1>
      <div className={Style.projectStats}>
        <div className={Style.statBox}>
          <p>{admins?.length}</p>
          <FaUserTie />
        </div>
        <div className={Style.statBox}>
          <p>{users?.length}</p>
          <FaUser />
        </div>
        <div className={Style.statBox}>
          <p>{accounts.length}</p>
          <FaClipboardList />
        </div>
        <div className={Style.statBox}>
          <p>{stocks.length}</p>
          <FaBoxes />
        </div>
        <div className={Style.statBox}>
          <p>{items.length}</p>
          <FaCube />
        </div>
        <div className={Style.statBox}>
          <p className={Style.moneyStat}>{totalEarn}</p>
          <FaDollarSign />
        </div>
      </div>
    </div>
  );
}