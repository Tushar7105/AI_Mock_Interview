"use client"
import React from "react";
import { db } from "../../../../../utils/db";
import { eq } from "drizzle-orm";
import { UserAnswer } from "../../../../../utils/schema";
import { useEffect, useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "../../../../../@/components/ui/collapsible"
import { Button } from "../../../../../components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";

function Feedback({params}) {
    const [feedbackList, setFeedbackList] = useState([]);
    // const [calculate, setCalculate] = useState(false);
    // const [avgScore, setAvgScore] = useState(0);
    const router = useRouter();
    useEffect(()=>{
        // console.log(params.interviewId);
        GetFeedback();
        // setCalculate(true);
    }, [])
    // useEffect(() => {
    //     if (feedbackList.length > 0) {
    //         const totalScore = feedbackList.reduce((sum, item) => sum + item.rating, 0);
    //         const average = totalScore / feedbackList.length;
    //         setAvgScore(average); 
    //     }
    // }, [calculate]);
    const GetFeedback = async ()=>{
        const result = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, params.interviewID)).orderBy(UserAnswer.id);
        console.log(result);
        setFeedbackList(result);
    }
    

    return (
        <div className="p-10">
        {feedbackList.length === 0 ? (
                <h2 className="font-bold text-xl text-gray-500 mt-4">
                    No Interview Feedback Found
                </h2>
            ) :
        (<>
            <h2 className="text-3xl font-bold text-green-500">Congratulation</h2>
            <h2 className="text-2xl font-bold ">Here is your interview feeedback</h2>
            <h2 className="text-primary text-lg my-3">Your overall interview rating: <strong>7/10</strong></h2>
            <h2 className="text-sm text-gray-500">Find below interview question with correct answer, your answer and feedback along with rating for improvement</h2>

            {feedbackList && feedbackList.map((item, index)=>(
                <Collapsible key={index} className="mt-7">
                    <CollapsibleTrigger className="p-2 gap-7 bg-secondary rounded-large my-2 text-left flex justify-between w-full">
                        {item.question}
                        <ChevronsUpDown className="h-5 w-5" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-red-500 p-2 border rounded-lg">
                                <strong>Rating:</strong> {item.rating}
                            </h2>
                            <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                                <strong>Your Answer:</strong> {item.userAns}
                            </h2>
                            <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                                <strong>Model Answer:</strong> {item.correctAns}
                            </h2>
                            <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary-900">
                                <strong>Feedback:</strong> {item.feedback}
                            </h2>
                        </div>
                    </CollapsibleContent>

                </Collapsible>
            
            ))}
        </>)}
            
            <Button onClick={()=>router.replace('/dashboard')}> Go Home</Button>
    
        </div>
    )
}

export default Feedback;