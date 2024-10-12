"use client"
import { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import Link from "next/link";

function Interview({params}){

    const [interviewData, setInterviewData] = useState();
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewID));
        console.log(result);
        setInterviewData(result[0]);

    };

    useEffect(()=>{
        console.log(params.interviewId);
        getInterviewDetails();
    },[])

    return (
        <div className="my-10  ">
            <h2 className="font-bold text-2xl">Let's Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
                <div className="flex flex-col my-5 gap-5">
                    <div className="flex flex-col my-5 gap-5 p-5 rounded-lg border">
                        <h2 className="text-lg"><strong>Job Position / Job Role :</strong>{interviewData?.jobPosition}</h2>
                        <h2 className="text-lg"><strong>Job Description / Tech Stack :</strong>{interviewData?.jobDescription}</h2>
                        <h2 className="text-lg"><strong>Years of Experience :</strong>{interviewData?.jobExperience }</h2>
                    </div>
                    <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
                        <h2 className="flex gap-2 items-center">
                            <Lightbulb className="text-yellow-500" />
                            <strong>Information</strong>
                        </h2>
                        <h2 className="mt-3 text-yellow-500">Enable Web Cam and Microphone To Start Your Mock Interview</h2>
                    </div>
                </div>

                <div>
                    {webcamEnabled ? <Webcam 
                        onUserMedia={()=>setWebcamEnabled(true)}
                        onUserMediaError={()=>setWebcamEnabled(false)}
                        mirrored={true}
                        style={{
                            height : 300,
                            width : 300
                        }}
                    /> 
                    :<>
                        <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border"/>
                        <Button className="w-full" onClick={()=>setWebcamEnabled(true)}>Enable WebCam and Microphone</Button>
                    </>}
                </div>
            </div>
            <div className="flex justify-end items-end">
                <Button>Start Interview</Button>
            </div>
        </div>
    )
}
export default Interview