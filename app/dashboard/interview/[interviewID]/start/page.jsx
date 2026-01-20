"use client"
import React from "react";
import { useEffect, useState } from "react";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { use } from "react";
import { ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const RecordAnswerSection = dynamic(
    () => import('./_components/RecordAnswerSection'),
    { ssr: false }
);

function startInterview({ params }) {
    const { interviewID } = use(params);
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const router = useRouter();

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewID));
        let jsonMockResp = JSON.parse(result[0].jsonMockResp);

        if (jsonMockResp && !Array.isArray(jsonMockResp)) {
            const keys = Object.keys(jsonMockResp);
            if (keys.length > 0 && Array.isArray(jsonMockResp[keys[0]])) {
                jsonMockResp = jsonMockResp[keys[0]];
            }
        }

        setMockInterviewQuestions(jsonMockResp);
        setInterviewData(result[0]);
    };

    useEffect(() => {
        if (interviewID) {
            getInterviewDetails();
        }
    }, [interviewID])

    const handleSaveSuccess = () => {
        if (activeQuestionIndex < mockInterviewQuestions?.length - 1) {
            setActiveQuestionIndex(activeQuestionIndex + 1);
        } else {
            router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
        }
    }

    const isLastQuestion = activeQuestionIndex === mockInterviewQuestions?.length - 1;

    return (
        <div className="p-5 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Section: Questions */}
                <QuestionsSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                />

                {/* Right Section: Navigation & Recording */}
                <div className="flex flex-col">
                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mb-6 pl-0 pr-0">
                        {/* Previous Question Button */}
                        <div className="w-1/3">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={activeQuestionIndex === 0}
                                onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                                className={`flex gap-1 items-center ${activeQuestionIndex === 0 ? 'invisible' : 'visible'}`}
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous Question
                            </Button>
                        </div>

                        {/* Next / End Interview Button */}
                        <div className="w-1/3 flex justify-end">
                            {isLastQuestion ? (
                                <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                                    <Button variant="destructive" size="sm" className="flex gap-1 items-center bg-red-600 hover:bg-red-700">
                                        End Interview <XCircle className="ml-1 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                                    className="flex gap-1 items-center"
                                >
                                    Next Question <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Recording Section */}
                    <RecordAnswerSection
                        mockInterviewQuestions={mockInterviewQuestions}
                        activeQuestionIndex={activeQuestionIndex}
                        interviewData={interviewData}
                        onSaveSuccess={handleSaveSuccess}
                    />
                </div>
            </div>
        </div>
    );
}

export default startInterview;