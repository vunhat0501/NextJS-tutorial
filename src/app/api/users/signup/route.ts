import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

export async function POST(request: NextRequest) {
    await connect();
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        // check if user has already existed
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json(
                { error: 'User has already existed' },
                { status: 400 },
            );
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User({
            username,
            email,
            password: hashPassword,
        });

        const savedUser = await newUser.save();

        // send verification email
        await sendEmail({
            email,
            emailType: 'verify',
            userId: savedUser._id.toString(),
        });

        return NextResponse.json({
            message: 'User created successfully',
            success: true,
            savedUser,
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
