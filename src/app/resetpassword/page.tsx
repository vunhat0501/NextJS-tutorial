'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function ForgotPasswordPage() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get(
            'token',
        );
        if (urlToken) setToken(urlToken);
        setLoading(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await axios.post('/api/users/resetpassword', {
                token,
                newPassword,
                confirmPassword,
            });

            if (res.data.success) {
                setSuccess(true);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl mb-4">Reset Password</h1>

            {loading && <p className="text-lg text-gray-600">Loading...</p>}

            {!loading && !success && (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full max-w-md gap-4 p-4 border rounded-md"
                >
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Reset password
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
            )}

            {!loading && success && (
                <div className="text-center">
                    <h2 className="text-2xl text-green-600">
                        Password reset successfully!
                    </h2>
                    <div className="mt-4">
                        <Link
                            href="/signin"
                            className="text-blue-600 underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
