'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const res = await axios.get('/api/users/me');
                setUserId(res.data.data._id);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Error fetching user ID:', error.message);
                    return toast.error(error.message);
                }
                return toast.error('An unknown error occurred');
            }
        };
        fetchUserId();
    }, []);

    const signout = async () => {
        try {
            await axios.get('/api/users/signout');
            toast.success('Signout successful');
            router.push('/signin');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Signout failed:', error.message);
                return toast.error(error.message);
            }
            return toast.error('An unknown error occurred');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <p>Profile page</p>
            <h2 className="text-3xl font-bold mt-4 p-3 rounded bg-green-500">
                {userId ? (
                    <Link href={`/profile/${userId}`}>{userId}</Link>
                ) : (
                    'No user found'
                )}
                ;
            </h2>
            <button
                onClick={signout}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded"
            >
                Signout
            </button>
        </div>
    );
}
