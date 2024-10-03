"use client"

import React from "react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";


function Header(){
    const path = usePathname();

    return (
        <div className='flex p-4 justify-between bg-secondary shadow-sm'>
            <Image src={'/logo.svg'} width={160} height={100} alt="logo"></Image>
            <ul className='hidden md:flex gap-6'>
                <li className={`hover:text-purple-800 hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard' && 'text-purple-800 text-primary font-bold'}`}>Dashboard</li>
                <li className={`hover:text-purple-800 hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/questions' && 'text-purple-800 text-primary font-bold'}`}>Questions</li>
                <li className={`hover:text-purple-800 hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/upgrade' && 'text-purple-800 text-primary font-bold'}`}>Upgrade</li>
                <li className={`hover:text-purple-800 hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/learnuse' && 'text-purple-800 text-primary font-bold'}`}>How it Works?</li>
            </ul>
            <UserButton></UserButton>

        </div>
    )
}

export default Header