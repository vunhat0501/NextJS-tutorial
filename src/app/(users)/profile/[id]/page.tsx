interface UserProfileParams {
    id: string;
}

export default async function UserProfile({ params }: { params: Promise<UserProfileParams> }) {
    const { id } = await params;
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <p className="text-4xl">
                Profile page 
                <span className="p-2 rounded bg-orange-500 ml-1 text-black">{id}</span>
            </p>
        </div>
    );
}
