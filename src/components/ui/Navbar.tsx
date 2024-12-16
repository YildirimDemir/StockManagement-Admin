'use client';

import { adminLogout } from '@/services/apiAdmins';
import { useRouter } from 'next/navigation';
import Style from './navbar.module.css';
import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Logo from '../../../public/images/stox-logo.png'
import Link from 'next/link';
import Loader from './Loader';

export default function Navbar() {
    
    const {data: session, status} = useSession();
    const admin = session?.user
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await adminLogout();
        router.push("/");
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

  return (
    <div className={Style.navbar}>
        {status === 'authenticated' && admin && admin.role === 'admin' ? (
            <>
        <div className={Style.sessionUsersName}>
            <p>Welcome, <span className={Style.usersName}>{admin?.name}</span></p>
        </div>
        <div className={Style.navbarLogo}>
            <Image src={Logo} alt='' className={Style.logoImg} onClick={() => router.push('/')} />
        </div>
        <div className={Style.navigation}>
            <button className={Style.linkBtn}>
                <Link href='/users'>Users</Link>
            </button>
            <button className={Style.linkBtn}>
                <Link href='/accounts'>Accounts</Link>
            </button>
            <button className={Style.linkBtn}>
                <Link href='/admins'>Admins</Link>
            </button>
            <button className={Style.linkBtn}>
                <Link href='/profile'>Profile</Link>
            </button>
            <button className={Style.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
            </>
        ) : (
            <p className={Style.noUser}>No authenticated user</p>
        )}
    </div>
  )
}