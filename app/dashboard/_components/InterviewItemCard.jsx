import React from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

function InterviewItemCard({interview}){
    return <div className="border shadow-sm rounded-lg p-3">

            <h2 className="font-bold text-primary">
                {interview?.jobPosition}
            </h2>
            <h2 className="text-sm text-gray-400">
                {interview.jobExperience} Years Of Experience
            </h2>
            <h2 className="text-xs text-gray-600">
                Created At: {interview.createdAt}
            </h2>
            <div className="flex mt-2 gap-5">
                <Link href={`/dashboard/interview/${interview.mockId}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">Start</Button>
                </Link>
                <Link href={`/dashboard/interview/${interview.mockId}/feedback`} className="flex-1 ml-2">
                    <Button size="sm" className="w-full">Feedback</Button>
                </Link>
            </div>
    </div>
}

export default InterviewItemCard;