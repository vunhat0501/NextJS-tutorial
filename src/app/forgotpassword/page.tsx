"use client";

import axios from "axios";
import { NextResponse } from "next/server";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("")

        try {
            const res = await axios.post('/api/users/forgotpassword', {email})
            if (res.data.success) {
                setSuccess(true)
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Signup failed:", error.message);
                return NextResponse.json({error: error.message}, {status: 500});
            }
            return NextResponse.json({error: "An unknown error occurred"}, {status: 500});
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-4">
            <h1 className="text-3xl mb-4">Forgot Password</h1>

            {!success ? (
                <form 
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full max-w-md gap-4 p-6 border rounded-md"
                >
                    <input 
                        type="email" 
                        placeholder="Enter your email here"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Send reset link
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
            ) : (
                <div className="text-center">
                    <h2 className="tex-xl text-green-600">
                        Reset link sent to your email
                    </h2>
                    <p className="text-sm mt-2 text-gray-600">
                        Please check your inbox and follow the link to reset your password.
                    </p>
                </div>
            )}
        </div>
    )
}