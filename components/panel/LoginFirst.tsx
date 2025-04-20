"use client"

import Link from "next/link";



export default function LoginFirst() {
  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md w-full">
        <div className="mb-6">
          <div className="w-20 h-20 bg-zinc-100 rounded-full mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Login Required</h2>
        <p className="text-gray-600 mb-6">
          Please sign in to view your profile and access all features.
        </p>
        <Link href={"/login"}>
        <button
          className="w-full bg-zinc-500 hover:bg-zinc-600 text-white py-3 px-6 rounded-md font-medium transition duration-200"
          >
          Sign In
        </button>
          </Link>
        <p className="mt-4 text-sm text-gray-500">
          Don&apos;t have an account?{" "}
        <Link href={"/register"}>
          <button 
            className="text-zinc-500 hover:underline"
            >
            Register
          </button>
            </Link>
        </p>
      </div>
    </div>
  );
}