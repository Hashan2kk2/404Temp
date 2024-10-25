import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const email = data.email;
    const verificationCode = data.verificationCode;
    const newPassword = data.newPassword;

    try {

        const userCheck = `select email from user where email = ? and verificationCode = ?`;
        const result = await (await connection).query(userCheck, [email, verificationCode]);

        // @ts-ignore
        if (result[0].length === 0) {
            return NextResponse.json({message: 'Invalid verification code or email'}, {status: 400});
        } else {
            const conn = await connection;

            const updatePassword = `update user set password = ? where email = ? and verificationCode = ?`;
            await conn.query(updatePassword, [newPassword, email, verificationCode]);

            const updateVerificationCode = `update user set verificationCode = ? where email = ? and password = ?`;
            await conn.query(updateVerificationCode, [Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), email, newPassword]);
            return NextResponse.json({message: 'success'}, {status: 200});
        }

    } catch (e) {
        console.error(e);
    }

}