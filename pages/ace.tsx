/* eslint-disable react/no-unescaped-entities */
"use client"
import React from 'react';
import axios from "axios";
import { useState, useEffect } from 'react';
import Header from "../components/Header";
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import SimpleProgressBar from '@/components/ProgressBar';
import { useCookies } from 'react-cookie'; 


export default function Ace() {

    const [cookies, setCookie] = useCookies(['fileName']);


    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const s3URL = process.env.NEXT_PUBLIC_S3_URL
    const [progress, setProgress] = useState(0);
    const [processComplete, setProcessComplete] = useState("");
    
    const [fileObj, setFileObj] = useState<File>();
    const [userEmail, setUserEmail] = useState<string>("")
    const [outputFileName, setOutputFileName] = useState<string>();
    const { data: session } = useSession();

    useEffect(() => {
        if (cookies.fileName) {
            setOutputFileName(cookies.fileName)
            console.log(cookies.fileName)
        }
    }) 
    
    let handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        let files = e.currentTarget.files
        if (files) {
            setFileObj(files[0])
            let user = session?.user
            if (user?.email) {
                setUserEmail(user.email)
            }
        }
    }
    const connectToStream = function() {
        const eventSource = new EventSource(`${apiUrl}/videoProcessStatus`, { withCredentials: true })
        
        eventSource.onopen = (event) => {
            console.log("Event source is opened", event)
        }
        eventSource.onmessage = (event) => {
                console.log(event)
        }
        eventSource.onerror = (event) => {
            console.log("Error", event)
        }
        eventSource.addEventListener('message', (event) => {
            // Parse the data received from the stream into JSON
            // Add it the list of messages seen on the page
            const tmp = JSON.parse(event.data)
            console.log(tmp)
        })
        eventSource.addEventListener('error', () => {
            eventSource.close()
        })

    }
    async function uploadFile() {
        var formData = new FormData();
        //connectToStream() // commented as this is not working
        setProcessComplete("Processing in progress, please wait");
        formData.append('email', userEmail)
        formData.append('file', fileObj)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent: any) => {
                const percentage = (progressEvent.loaded * 100) / progressEvent.total;
                setProgress(+percentage.toFixed(2));
            }, 
            withCredentials: false
        } 
        try {
            axios.post(`${apiUrl}/video`, formData, config).then((response) => {
                console.log("Response is :: ", response.data); 
                let full_file_name = s3URL + response.data.out_file
                localStorage.setItem(userEmail, full_file_name)
                setOutputFileName(full_file_name)
                setCookie('fileName', full_file_name)
                setProcessComplete("File uploaded. Processed video will display once done")
            },
            (error) => {
                console.log("An error occured in upload", error)
                alert(error);
            }
            );
        } catch (error) {
            console.log(error);
        }
        
    }
    if (!session) {
    return (
        <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            <Header />
            <main className="flex flex-1 w-full flex-col items-center text-center px-2 sm:mt-28 mt-20">
                <div className="h-[250px] flex flex-col items-center space-y-6 max-w-[670px] -mt-8">
                    <div className="max-w-xl text-gray-600">Sign in below with Google to create a free account and unalyze your videos today.
                    </div>
                    <button
                        onClick={() => signIn("google")}
                        className="bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2">
                        <Image
                            src="/google.png"
                            width={20}
                            height={20}
                            alt="google's logo"
                        />
                        <span>Sign in with Google</span>
                    </button>
                </div>
            </main>
        </div>
    )
    } else {
        
        return (
            <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
                <Header />
                <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-2 sm:mt-28 mt-20">
                    <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
                        <h2 className="text-black mx-auto max-w-4xl font-display text-3xl font-bold tracking-normal text-slate-900 sm:text-5xl"> Forehand comparison </h2>
                        <div className="flex flex-col space-y-10 mt-4 mb-16">
                            <div className="flex sm:space-x-2 sm:flex-row flex-col">
                    {outputFileName &&
                                <div>
                                        <video width="800" height="600" controls autoPlay={true} playsInline loop >
                                            <source src={outputFileName}
                                                type="video/webm" />
                                        </video>
                                </div>
                    }
                                <div>
                                    <video width="800" height="600" controls autoPlay={true} loop >
                                            <source src={ s3URL + "fed_out.m4v"} type="video/mp4" />
                                    </video>
                                </div>
                            </div>
                        </div>
                        </div>
                    <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">
                    Upload your forehand videos, size less than <b> 25 MB</b> please. <br></br>
                    Federer's forehand for reference.
                    </p>
                    <br></br>
                    <input className="text-black" type="file" name="file" accept="video/*" required onChange={handleFileUpload} />

                        <button className="bg-white rounded-xl text-black font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-gray-100 border" type="submit" onClick={uploadFile}>Upload
                        </button>
                        <SimpleProgressBar progress={progress} />

                    <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7"> {processComplete} </p>
                    
                </main>
            </div>
        )
    }

}