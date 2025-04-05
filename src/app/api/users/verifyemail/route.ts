import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
    await connect();
    try {
        const reqBody = await request.json();
        const {token} = reqBody;
        console.log(token);

        const user = await User.findOne({
            verifyToken: token, 
            verifyTokenExpiry: {$gt: Date.now()}
        });

        if (!user) {
            return NextResponse.json({error: "Invalid token"}, {status: 400})
        }
        console.log(user);

        user.isVerified = true; // Set the user as verified
        user.verifyToken = undefined; // Remove the token so it can't be used again
        user.verifyTokenExpiry = undefined; // remove the expiry date
        await user.save(); // Save the changes to database

        return NextResponse.json({
            message: "Email verified successfully", 
            success: true
        });
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Signup failed:", error.message);
            return NextResponse.json({error: error.message}, {status: 500});
        }
        return NextResponse.json({error: "An unknown error occurred"}, {status: 500});
    }
};