"use client"
import React, { useEffect, useState, use } from "react";
import { db } from "../../../../../utils/db";
import { eq } from "drizzle-orm";
import { UserAnswer, MockInterview } from "../../../../../utils/schema";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../../../../@/components/ui/collapsible"
import { Button } from "../../../../../components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";

function Feedback({ params }) {
    const { interviewID } = use(params);
    const [feedbackList, setFeedbackList] = useState([]);
    const [overallRating, setOverallRating] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (interviewID) {
            GetFeedback();
        }
    }, [interviewID])

    const GetFeedback = async () => {
        // 1. Get original questions
        const interviewResult = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewID));

        let originalQuestions = JSON.parse(interviewResult[0].jsonMockResp);

        // Robust parsing: extract array if wrapped in an object
        if (originalQuestions && !Array.isArray(originalQuestions)) {
            const keys = Object.keys(originalQuestions);
            if (keys.length > 0 && Array.isArray(originalQuestions[keys[0]])) {
                originalQuestions = originalQuestions[keys[0]];
            }
        }

        // 2. Get user answers
        const userAnswers = await db.select().from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, interviewID))
            .orderBy(UserAnswer.id);

        // 3. Merge them to ensure every question is represented
        const combinedFeedback = originalQuestions.map((q) => {
            const userAnsEntry = userAnswers.find(ans => ans.question === q.question);

            if (userAnsEntry) {
                return {
                    ...userAnsEntry,
                    correctAns: q.answer || q.correctAns // Handling potential naming differences
                };
            } else {
                return {
                    question: q.question,
                    userAns: "Not Answered",
                    rating: 0,
                    correctAns: q.answer || q.correctAns,
                    feedback: "No feedback available as the question was not answered."
                };
            }
        });

        setFeedbackList(combinedFeedback);

        // 4. Calculate Average Rating
        if (combinedFeedback.length > 0) {
            const totalRating = combinedFeedback.reduce((sum, item) => sum + Number(item.rating), 0);
            const avg = totalRating / combinedFeedback.length;
            setOverallRating(avg.toFixed(1));
        }
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
                    <h2 className="text-2xl font-bold ">Here is your interview feedback</h2>
                    <h2 className="text-primary text-lg my-3">
                        Your overall interview rating: <strong>{overallRating}/10</strong>
                    </h2>
                    <h2 className="text-sm text-gray-500">Find below interview question with correct answer, your answer and feedback along with rating for improvement</h2>

                    {feedbackList.map((item, index) => (
                        <Collapsible key={index} className="mt-7">
                            <CollapsibleTrigger className="p-2 gap-7 bg-secondary rounded-lg my-2 text-left flex justify-between w-full">
                                {item.question}
                                <ChevronsUpDown className="h-5 w-5" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="flex flex-col gap-2">
                                    <h2 className={`p-2 border rounded-lg ${Number(item.rating) < 5 ? 'text-red-500' : 'text-green-600'}`}>
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

            <Button className="mt-5" onClick={() => router.replace('/dashboard')}> Go Home</Button>
        </div>
    )
}

export default Feedback;