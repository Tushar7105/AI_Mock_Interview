"use client"
import React from "react";
import { useEffect, useState } from "react";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";

function startInterview({params}){
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState();
    const [activeQuestionIndex , setActiveQuestionIndex] = useState(0);
    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewID));
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        console.log(jsonMockResp);
        setMockInterviewQuestions(jsonMockResp);
        setInterviewData(result[0]);
    };

    useEffect(()=>{
        console.log(params.interviewID);
        getInterviewDetails();
    },[])

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10"> 
        <QuestionsSection mockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex}></QuestionsSection>
        <RecordAnswerSection
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
        />
        </div>
        <div className="flex justify-end gap-6">
            {activeQuestionIndex>0 && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>
            {activeQuestionIndex==mockInterviewQuestions?.length-1 && 
                <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}><Button>End Interview</Button></Link>}
        </div>

    </div>
}
export default startInterview;