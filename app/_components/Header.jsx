"use client"
import { Button } from '@/components/ui/button'
// import { LoginLink, LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

  

function Header() {
  const router = useRouter();
  
  const Menu=[
    {
      id:1,
      name:'Home',
      path:'/'
    },
    {
      id:2,
      name:'Players',
      path:'/players'
    },
    {
      id:3,
      name:'Leaderboard',
      path:'/leaderboard'
    },
    {
      id:4,
      name:'My Team',
      path:'/team'
    },
  ]

  const handleNavigation = (path) => {
    // For protected routes, redirect to login
    if (path === '/team' || path === '/') {
      router.push('/login');
    } else {
      router.push(path);
    }
  };
 
  return (
    <div className='flex items-center 
    justify-between p-4 shadow-sm'>
        <div className='flex items-center gap-10'>
            <Image src='/logo.svg' alt='spirit11 logo' width={180} height={80}
            />
            <ul className='md:flex gap-8 hidden'>
              {Menu.map((item,index)=>(
                <li 
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className='hover:text-primary
                    cursor-pointer hover:scale-105
                    transition-all ease-in-out'
                >
                  {item.name}
                </li>
              ))}
            </ul>
        </div>
    </div>
  )
}

export default Header