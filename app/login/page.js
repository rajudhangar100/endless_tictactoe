"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { signIn } from "next-auth/react";
import TicTacToe from '../game/page';


const Login = () => {
  const { data: session} = useSession();
  
  return (<>
    {!session &&
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="p-8 bg-white rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl text-black font-semibold mb-4">Sign in</h2>
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="24px"
          height="24px"
        >
          <path
            fill="#4285F4"
            d="M44.5 20H24v8.5h11.9C34.5 32.5 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 6 .9 8.3 2.8l6.2-6.2C34.4 4.3 29.5 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.7 0 19.7-7.6 21-18v-7z"
          />
        </svg>
        Sign in with Google
      </button>
    </div>
  </div>     
}
    {session && <TicTacToe user={session.user}/>}
    </>
  )
}

export default Login    


