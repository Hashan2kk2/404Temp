import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    const data = await request.json();
    if (!data.email) {
        return NextResponse.json({ message: 'Please enter your email' }, { status: 400 });
    } else {

        const code = Math.floor(100000 + Math.random() * 900000);
        const query = `update user
                               set verificationCode = ?
                               where email = ?`;
        const conn = await connection;
        await conn.query(query, [code, data.email]);

        try {
            const apiUrl = new URL("/api/send", request.nextUrl.origin);

            const response = await fetch(apiUrl.toString(), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: data.email.toString(),
                    emailType: "reset",
                    code: code.toString(),
                }),
            });

            const res = await response.json();
            if (res.message === 'success') {
                return NextResponse.json({message: 'success'}, {status: 200});
            } else {
                return NextResponse.json({message: "Failed to send verification code"}, {status: 500});
            }
        } catch (sendError) {
            return NextResponse.json({message: "Failed to send verification code"}, {status: 500});
        }

    }

}