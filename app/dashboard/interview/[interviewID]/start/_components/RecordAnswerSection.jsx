"use-client"
import Webcam from "react-webcam";
import Image from "next/image";
import React from "react";
import { Button } from "../../../../../../components/ui/button";
import { useEffect, useState } from "react";
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from "lucide-react";

function RecordAnswerSection(){
    // const [webcanEnabled, setWebcamEnabled] = useState(0);
    const [userAnswer, setuserAnswer] = useState("");
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
            setuserAnswer(prevAns=>prevAns + result.transcript)
        })
      }, [results])
    return <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center rounded-lg p-5 mt-20">
            <Image src="https://img.freepik.com/premium-vector/vector-cartoon-web-camera-illustration_574806-2826.jpg" height={200} width={200} className="absolute"/>
            <Webcam mirrored={true} style={{heiglt:300, width:"100%", zIndex:10}} />
        </div>
        <Button  variant="outline" className="my-10 " onClick={isRecording ? stopSpeechToText : startSpeechToText}>
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