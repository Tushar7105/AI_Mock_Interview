"use client"
import React from "react";
import { Lightbulb, Volume2 } from "lucide-react";

function QuestionsSection({mockInterviewQuestions,activeQuestionIndex}){
    const textToSpeach = (text)=>{
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech); 
        }
        else{
            alert("Sorry, Your browser doesn't support Text-to-Speech")
        }
    }
    
    return mockInterviewQuestions&&(<div className="p-5 border rounded-lg my-10 ">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {mockInterviewQuestions && mockInterviewQuestions.map((question, index)=>(
                <h2 className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex==index && 'bg-primary text-white'}`}>Question#{index+1}</h2>
            ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">{mockInterviewQuestions[activeQuestionIndex].question}</h2>
        <Volume2 onClick={()=>textToSpeach(mockInterviewQuestions[activeQuestionIndex].question)}/>
        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
                <h2 className="flex gap-2 items-center text-blue-900">
                    <Lightbulb className="mr-2" />
                    <strong>Note:</strong>
                </h2>
                <h2 className="text-sm my-2 text-blue-900">
                    Click On Record Answer Button to Record Your Responses and At the End of the Interview You will be provided With a Model Answers With which you can Compare your Responses
                </h2>
        </div>
    </div>)
}


export default QuestionsSection;