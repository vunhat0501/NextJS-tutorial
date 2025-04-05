import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
    await connect()

    try {
        const {email} = await request.json();
        const user = await User.findOne({email});

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 400})
        }

        await sendEmail({
            email: user.email,
            emailType: "reset",
            userId: user._id.toString(),
        })

        return NextResponse.json({message: "Reset email sent", success: true})
    } catch (error: unknown) {
        console.error("Error sending reset email:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}