"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true)

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', {token});
            setVerified(true);
        } catch (error: unknown) {
            setError(true);
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            } else {
                console.error("An unexpected error occurred:", error);
            }
        }
    };

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get('token')
        if (urlToken) setToken(urlToken || "")
    }, [])

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail().finally(() => setLoading(false));
        }
    }, [token])

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verify your email</h1>
            {loading && (
                <p className="text-lg text-gray-600">Verifying your email...</p>
            )}
            <h2 className="p-2 bg-orange-500 text-black">
                {token ? `${token}` : "no token"}
            </h2>
            {!loading && verified && (
                <div className="text-center">
                    <h2 className="text-2xl">Email verified</h2>
                    <div className="bg-blue-500 text-white">
                        <Link href='/signin'>Signin</Link>
                    </div>
                </div>
            )}
            {!loading && error && (
                <div className="text-center">
                    <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                    <p className="mt-2 text-sm">The token may be invalid or expired.</p>
                    <div className="mt-4">
                        <Link href='/signup' className="text-blue-600 underline">Signup</Link>
                    </div>
                </div>
            )}
        </div>
    )
};