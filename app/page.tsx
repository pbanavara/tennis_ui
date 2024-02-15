"use client";

import Image from "next/image";
import Link from "next/link"
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);
  const handleUpload = () => {
    setCount(count + 1) 
  }
  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-28 mt-20">
      <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
        Tennis improvement {" "}
        <span className="relative whitespace-nowrap text-[#3290EE]">
          <span className="relative">using AI</span>
        </span>{" "}
        for everyone.
      </h1>

      <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">
        Record your tennis videos from a front facing camera, upload and compare with the champions.
      </p>
      <div className="flex justify-center space-x-4">
        <input
          type = "file"
          className="bg-white rounded-xl text-black font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-gray-100 border"
          onChange={handleUpload}
        />

      </div>
      <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
        <div className="flex flex-col space-y-10 mt-4 mb-16">
          <div className="flex sm:space-x-2 sm:flex-row flex-col">
            <div>
              <h2 className="mb-1 font-medium text-lg">Original Photo</h2>
              <Image
                alt="My forehand"
                src="http://localhost:8000/fetchVideo?fileName=%2Ftmp%2Ftmpq7afof4n"
                className="w-full h-full rounded-2xl"
                width={400}
                height={400}
                unoptimized
              />
            </div>
            <div className="sm:mt-0 mt-8">
              <h2 className="mb-1 font-medium text-lg">Restored Photo</h2>
              <Image
                alt="Federer forehand"
                width={400}
                height={400}
                src="http://localhost:8000/fetchYTvideo?url=https://www.youtube.com/watch?v=kHrAaIFOh2I"
                className="w-full h-full rounded-2xl sm:mt-0 mt-2"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
