"use client"
import Webcam from "react-webcam";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "../../../../../../components/ui/button";
import { Mic, Save, StopCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { chatSession, transcribeAudio } from "../../../../../../utils/AiModel";
import { UserAnswer } from "../../../../../../utils/schema";
import { db } from "../../../../../../utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Textarea } from "../../../../../../components/ui/textarea";

function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex, interviewData, onSaveSuccess }) {
    const [userAnswer, setUserAnswer] = useState("");
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Clear user answer when question changes
    useEffect(() => {
        setUserAnswer("");
    }, [activeQuestionIndex]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], "recording.webm", { type: 'audio/webm' });

                setTranscribing(true);
                try {
                    const text = await transcribeAudio(audioFile);
                    setUserAnswer(prev => prev + (prev ? " " : "") + text);
                    toast.success("Audio transcribed!");
                } catch (err) {
                    console.error(err);
                    toast.error("Transcription failed. You can still type your answer manually.");
                } finally {
                    setTranscribing(false);
                }

                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            toast.info("Recording started...");
        } catch (err) {
            console.error("Microphone access error:", err);
            toast.error("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const UpdateUserAnswer = async () => {
        if (userAnswer.length <= 10) {
            toast.error("Answer is too short to provide feedback.");
            return;
        }

        setLoading(true);
        try {
            const feedbackPrompt = `Question: ${mockInterviewQuestions[activeQuestionIndex]?.question}, user Answer: ${userAnswer}. Based on the question and user answer, give rating and feedback in JSON format with "rating" and "feedback" fields.`;

            const result = await chatSession.sendMessage(feedbackPrompt);
            const MockResp = result.response.text().trim();
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
            });

            if (resp) {
                toast.success("User Answer recorded successfully");
                setUserAnswer('');
                if (onSaveSuccess) {
                    onSaveSuccess();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Error saving your answer. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const isLastQuestion = activeQuestionIndex === mockInterviewQuestions?.length - 1;

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col justify-center items-center rounded-lg p-5 mt-5 bg-black relative w-full max-w-md">
                <Image src="https://img.freepik.com/premium-vector/vector-cartoon-web-camera-illustration_574806-2826.jpg" height={200} width={200} alt="" className="absolute opacity-20 pointer-events-none" />
                <Webcam mirrored={true} style={{ height: 300, width: "100%", zIndex: 10 }} />
            </div>

            <div className="flex flex-col gap-4 w-full mt-10">
                <div className="flex gap-2">
                    {!isRecording ? (
                        <Button
                            disabled={loading || transcribing}
                            variant="outline"
                            className="flex-1 py-6 text-lg border-primary text-primary hover:bg-primary/5"
                            onClick={startRecording}
                        >
                            <Mic className="h-5 w-5 mr-2" /> Start Recording
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            className="flex-1 py-6 text-lg animate-pulse"
                            onClick={stopRecording}
                        >
                            <StopCircle className="h-5 w-5 mr-2" /> Stop Recording
                        </Button>
                    )}
                </div>

                <div className="flex flex-col gap-2 mt-5">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-gray-700">Your Answer (Edit if needed):</label>
                        {transcribing && (
                            <span className="text-xs text-primary flex items-center gap-1 animate-pulse">
                                <Loader2 className="h-3 w-3 animate-spin" /> Transcribing...
                            </span>
                        )}
                    </div>
                    <Textarea
                        className="min-h-[150px] text-md p-4 bg-white border-2 border-primary/20 focus:border-primary transition-all resize-none"
                        placeholder="Click 'Start Recording' and speak, then 'Stop Recording' to see your answer here. You can also type directly."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                    />
                </div>

                <Button
                    disabled={loading || transcribing || userAnswer.length <= 10}
                    className="w-full py-6 mt-4 flex gap-2 items-center text-lg font-bold"
                    onClick={UpdateUserAnswer}
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <><Save className="h-5 w-5" /> {isLastQuestion ? "Save & Finish Interview" : "Save Answer & Next Question"}</>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default RecordAnswerSection;