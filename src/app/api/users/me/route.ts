import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';

export async function GET(request: NextRequest) {
    await connect();
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findById({ _id: userId }).select('-password');
        return NextResponse.json({
            message: 'User found',
            data: user,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(error.message, { status: 500 });
        }
        console.error('An unknown error occurred while decoding the token');
        return new Response('An unknown error occurred', { status: 500 });
    }
}
