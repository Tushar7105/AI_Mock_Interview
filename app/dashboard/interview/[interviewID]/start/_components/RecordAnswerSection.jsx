import Webcam from "react-webcam";
import Image from "next/image";
import React from "react";
import { Button } from "../../../../../../components/ui/button";
import {useState} from "react";

function RecordAnswerSection(){
    // const [webcanEnabled, setWebcamEnabled] = useState(0);
    return <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center rounded-lg p-5 mt-20">
            <Image src="https://img.freepik.com/premium-vector/vector-cartoon-web-camera-illustration_574806-2826.jpg" height={200} width={200} className="absolute"/>
            <Webcam mirrored={true} style={{heiglt:300, width:"100%", zIndex:10}} />
        </div>
        <Button  variant="outline" className="my-10" >Record Answer</Button>
    </div>

}

export default RecordAnswerSection; 