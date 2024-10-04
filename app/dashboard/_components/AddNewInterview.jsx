"use client"
import React, {useState} from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { CloudCog, LoaderCircle } from "lucide-react";
import { chatSession } from "@/utils/GeminiAI";
  

function AddNewInterview(){
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [jobExperience, setJobExperience] = useState();

    const [loading, setLoading] = useState(false);

    const [jsonResponse, setJsonResponse] = useState();

    const onSubmit = async (e)=>{
        e.preventDefault()
        setLoading(true);
        console.log(jobPosition, jobDescription, jobExperience)

        const InputPrompt = `Job Position : ${jobPosition}; Job Description: ${jobDescription}; Years of Experience : ${jobExperience}
Depend on the input give 5 interview questions along with answers in JSON format. Give question and answer as JSON field`

        const result = await chatSession.sendMessage(InputPrompt);
        const MockResp = (result.response.text()).replace("```json", '').replace("```",'' );

        console.log(JSON.parse(MockResp));
        setJsonResponse(MockResp);
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