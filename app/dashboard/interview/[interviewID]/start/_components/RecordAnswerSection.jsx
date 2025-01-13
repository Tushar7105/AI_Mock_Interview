"use-client"
import Webcam from "react-webcam";
import Image from "next/image";
import React from "react";
import { Button } from "../../../../../../components/ui/button";
import { useEffect, useState } from "react";
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "../../../../../../utils/GeminiAI";
import { UserAnswer } from "../../../../../../utils/schema";
import { db } from "../../../../../../utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({mockInterviewQuestions, activeQuestionIndex, interviewData}){
    const [userAnswer, setUserAnswer] = useState("");
    const {user} = useUser();
    const [loading, setLoading] = useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        results.map((result)=>{
            setUserAnswer(prevAns=>prevAns + result.transcript)
        })
      }, [results])

      useEffect(()=>{
        if(!isRecording && userAnswer.length>10){
            UpdateUserAnswer();
        }
      }, [userAnswer])

      const StartStopRecording = async()=>{
        if(isRecording){
            stopSpeechToText();
        }
        else{
            startSpeechToText();
        }

      }

    const UpdateUserAnswer = async()=>{
        console.log(userAnswer);
        setLoading(true);
        const feedbackPrompt = `Question: ${mockInterviewQuestions[activeQuestionIndex]?.question} , 
                                user Answer : ${userAnswer}, Depending on the question and user answer for
                                given interview question please give us the rating and feedback as area of 
                                improvement in 3 to 5 lines in JSON formate with rating feild and feedback feild`;

        const result = await chatSession.sendMessage(feedbackPrompt);

        const MockResp = (result.response.text()).replace("```json", '').replace("```",'' );

        const JsonFeedbackResp = JSON.parse(MockResp);

        const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId,
            question: mockInterviewQuestions[activeQuestionIndex]?.question,
            correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
            userAns: userAnswer,
            feedback: JsonFeedbackResp?.feedback,
            rating: JsonFeedbackResp?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
        })

        if(resp){
            toast("User Answer recorded succesfully");
        }
        setUserAnswer('');
        setLoading(false);

    }

    return <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center rounded-lg p-5 mt-20">
            <Image src="https://img.freepik.com/premium-vector/vector-cartoon-web-camera-illustration_574806-2826.jpg" height={200} width={200} className="absolute"/>
            <Webcam mirrored={true} style={{heiglt:300, width:"100%", zIndex:10}} />
        </div>
        <Button disable={loading} variant="outline" className="my-10 " onClick={StartStopRecording}>
            {isRecording ? 
                <h2 className="text-red-600 flex gap-2">
                    <Mic/> 'Stop Recording.'
                </h2>
                :
                'Record Answer'
            }
        </Button>
       
    </div>

}

export default RecordAnswerSection; 