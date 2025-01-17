"use client"
import React, {useState} from "react";
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { v4 as uuidv4 } from 'uuid';


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../components/ui/dialog"
import { CloudCog, LoaderCircle } from "lucide-react";
import { chatSession } from "../../../utils/GeminiAI";
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { useSession, useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
  

function AddNewInterview(){
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [jobExperience, setJobExperience] = useState();

    const [loading, setLoading] = useState(false);

    const [jsonResponse, setJsonResponse] = useState();
    const user = useUser();
    const router = useRouter();
    const session = useSession();

    const onSubmit = async (e)=>{
        e.preventDefault()
        setLoading(true);
        console.log(jobPosition, jobDescription, jobExperience)

        const InputPrompt = `Job Position : ${jobPosition}; Job Description: ${jobDescription}; 
                            Years of Experience : ${jobExperience} Depend on the input give 5 interview 
                            questions along with answers in JSON format. Give question and answer as JSON 
                            field`

        const result = await chatSession.sendMessage(InputPrompt);
        const MockResp = (result.response.text()).replace("```json", '').replace("```",'' );

        console.log(JSON.parse(MockResp));
        setJsonResponse(MockResp);

        if(MockResp){
            const resp = await db.insert(MockInterview).values({
                mockId : uuidv4(),
                jsonMockResp : MockResp,
                jobPosition : jobPosition,
                jobDescription : jobDescription,
                jobExperience : jobExperience,
                createdBy: (session.isLoaded && session.isSignedIn) ? session.session?.user?.primaryEmailAddress?.emailAddress : "",
                createdAt : moment().format('DD-MM-yyyy')
            }).returning({mockId : MockInterview.mockId})
            console.log("response ID: ", resp); 
            if(resp){
                setOpenDialog(false); 
            }
            // Navigate to the interview page
            if (resp && resp[0]?.mockId) {
                router.push('/dashboard/interview/' + resp[0]?.mockId);
            } else {
                console.error("Failed to get mockId from response:", resp);
            }
        }
        else{ console.log("ERROR") }

        setLoading(false);
    }
    return(
        <div>
            <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md hover:cursor-pointer transition-all 
            " onClick={()=>setOpenDialog(true)}>
                <h2 className="text-lg text-center">+ Add New</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                    <DialogTitle className="text-2xl">Tell us more about Job you are interviewing for</DialogTitle>
                    <DialogDescription>
                    <form onSubmit={onSubmit}>
                        <h2>Add Details about job position, Job Descripton and Years of Experience</h2>
                        <div className="mt-7 my-3">
                            <label>Job Role/ Job Position</label>
                            <Input placeholder="Ex. Full Stack Developer"required onChange={(event)=>setJobPosition(event.target.value)}></Input>
                        </div>
                        <div className="mt-7 my-3">
                            <label>Job Description/ Tech Stack (in short)</label>
                            <Textarea placeholder="Ex. react, mongoDB, nextJS, rust, MySQL, etc."required onChange={(event)=>setJobDescription(event.target.value)}></Textarea>
                        </div>
                        <div className="mt-7 my-3">
                            <label>No of Years of Experience</label>
                            <Input placeholder="Ex. 2" type="number" max="50" required onChange={(event)=>setJobExperience(event.target.value)}></Input>
                        </div>
                        <div>
                            <Button type="button"variant='ghost' onClick={()=>setOpenDialog(false)}>Cancel</Button>
                            <Button type="submit" disable={loading}>
                                {loading?<><LoaderCircle className="animate-spin"/>'Generating from AI'</> : 'Start Interview'}
                            </Button>
                        </div>
                    </form>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddNewInterview