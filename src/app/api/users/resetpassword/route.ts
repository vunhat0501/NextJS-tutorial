import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    await connect();

    try {
        const reqBody = await request.json();
        const { token, newPassword, confirmPassword } = reqBody;
        if (!token || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: 'Something went missing' },
                { status: 400 },
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords must be match' },
                { status: 400 },
            );
        }

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid Token' },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: 'Password reset successfully',
            success: true,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Signup failed:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(
            { error: 'An unknown error occurred' },
            { status: 500 },
        );
    }
}
