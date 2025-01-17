"use client"
import { UserButton, useSession, useUser } from "@clerk/nextjs";
import React, { useEffect, useMemo } from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
function Dashboard(){
    // const session = useSession();
    // const userId = useMemo(() => {
    //     if (session.isLoaded && session.isSignedIn) {
    //         console.log(session.session.user.primaryEmailAddress.emailAddress)
    //         return session.session.user.id
    //     }
    //     return "loggedOutUser"
    // },[])


    return (
        <div className="p-10 ">
            <h2 className="font-bold text-2xl">Dashboard</h2>
            <h2 className="text-gray-500">Create and start yourn AI Mockup Interview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 my-5">
                <AddNewInterview></AddNewInterview>
            </div>
                <InterviewList></InterviewList>
        </div>
    )
}
export default Dashboard