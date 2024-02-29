import Link from "next/link";
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react'

export default function Header() {
    const { data: session } = useSession()
    async function signOutFromHere(e) {
        e.preventDefault()
        await signOut()
    }
    return (
        <header className="flex justify-between text-black items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
            <Link href="/" className="flex space-x-2">
                <h3 className="sm:text-5xl text-3xl font-bold ml-2 tracking-tight">
                    Callindra 
                </h3>
                <h4> beta </h4>
            </Link>
            <div className="flex space-x-6">
                <Link className="border-r border-gray-300 pr-4 space-x-2 hover:text-blue-400 transition hidden sm:flex" href="/">
                    <p className="font-medium text-base">Home</p>
                </Link>
                {session ? (
                    <div>
                <Link className="border-gray-300 pr-4 space-x-2 hover:text-blue-400 transition hidden sm:flex" href="/ace">
                    <p className = "font-medium text-base">{ session.user.name} </p>
                </Link>
                        <Link href="/ace" className="border-gray-300 pr-4 space-x-2 hover:text-blue-400 transition hidden sm:flex" onClick={signOutFromHere}> Sign Out
                        </Link>
                        </div>
                ) : (
                    <Link href="/"></Link>
                )
            }
            </div>
        </header>
    );
}