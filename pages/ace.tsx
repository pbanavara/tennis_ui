"use client"
import React from 'react';
import axios from "axios";
import { NextPage } from 'next'
import { useState, useEffect } from 'react';
import { FormEvent } from 'react';
import Header from "../components/Header";
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import { Toaster } from "react-hot-toast";

export default function Ace() {

    useEffect(() => {
        console.log("Use effect called")
         setOutputFileName(localStorage.getItem(userEmail) || "")
    }, []);

    const [fileObj, setFileObj] = useState<File>();
    const [userEmail, setUserEmail] = useState<string>();
    const [outputFileName, setOutputFileName] = useState<string>();
    const { data: session } = useSession();

    let handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        let files = e.currentTarget.files
        if (files) {
            setFileObj(files[0])
            setUserEmail(session.user.email)
        }
    }
    async function uploadFile() {
        var formData = new FormData();
        formData.append('email', userEmail)
        formData.append('file', fileObj)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            },
            withCredentials: false
        } 
        try {
            axios.post("http://localhost:8000/video", formData, config).then((response) => {
                console.log("Response is :: ", response.data); 
                let s3_url = process.env.S3_URL || "http://d3dgc1hn06lo53.cloudfront.net/"
                let full_file_name = s3_url + response.data.out_file
                localStorage.setItem(userEmail, full_file_name)
                setOutputFileName(full_file_name)
            },
            (error) => {
                console.log("An error occured in upload", error)
                alert("Error occured");
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
                    <h2 className = "text-black" > Upload your forehand videos here. Videos less than <b> 20 MB </b> please.
                    </h2>
                    <div>

                    <input className = "text-black" type = "file" name = "file" accept = "video/*" required onChange = { handleFileUpload } />
                    <button className="bg-white rounded-xl text-black font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-gray-100 border" type="submit" onClick={uploadFile}>Upload
                        </button>
                    
                    </div>
                    <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
                        <div className="flex flex-col space-y-10 mt-4 mb-16">
                            <div className="flex sm:space-x-2 sm:flex-row flex-col">
                                <div>
                                    {outputFileName &&
                                        <video width="800" height="600" controls autoPlay={true} playsInline loop >
                                            <source src={outputFileName}
                                                type="video/mp4" />
                                        </video>
                                    }
                                </div>
                                <div>
                                    <video width="800" height="600" controls autoPlay={true} loop >
                                        <source src="http://d3dgc1hn06lo53.cloudfront.net/fed_out.m4v" type="video/mp4" />
                                    </video>
                                </div>
                                <div className="sm:mt-0 mt-8">
                                    <h2 className="mb-1 font-medium text-lg">Restored Photo</h2>
                                </div>
                            </div>
                        </div>
                        </div>
                </main>
            </div>
        )
    }

}