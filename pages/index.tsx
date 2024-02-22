"use client";

import Link from "next/link"
import React from 'react'
import Header from "../components/Header"
import va from '@vercel/analytics';

export default function Home() {
    // line above ^ gives me the error below
    return (
        <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            <Header/>
            <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-2 sm:mt-28 mt-20">
                <h1 className="mx-auto max-w-4xl font-display text-3xl font-bold tracking-normal text-slate-900 sm:text-7xl">
                    Ace your Tennis{" "}
                    <span className="relative whitespace-nowrap text-[#3290EE]">
                        <span className="relative">using AI</span>
                    </span>{" "}
                </h1>
                <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">
                    Upload your game footage, identify your weak spots, side by side with the champions <b> 100% free.</b>
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
                        href="/ace"
                    >
                        Ace your tennis 
                    </Link>
                </div>
                <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
                    <div className="flex flex-col space-y-10 mt-4 mb-16">
                        <div className="flex sm:space-x-2 sm:flex-row flex-col">
                            <div>
                                <video width="800" height="600" controls autoPlay={true} loop >
                                    <source src={process.env.S3_URL + "output_1.m4v"} type="video/mp4" />
                                </video>
                            </div>
                            <div>
                                <video width="800" height="600" controls autoPlay={true} loop >
                                    <source src={process.env.S3_URL + "fed_out.m4v"} type="video/mp4" />
                                    Your browser does not support the video tag.
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
        );
    }
