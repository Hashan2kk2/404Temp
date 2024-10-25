import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        if (data.email === '') {
            return NextResponse.json({message: 'Email is required'}, {status: 400});
        } else if (data.email !== '' && data.verificationCode === '') {
            const query = `select email
                           from admin
                           where email = ?`;
            const conn = await connection;
            const result = await conn.query(query, [data.email]);
            // @ts-ignore
            if (result.length === 0) {
                return NextResponse.json({message: 'Email does not exist'}, {status: 400});
            } else {
                const code = Math.floor(100000 + Math.random() * 900000);
                const query = `update admin
                               set verificationCode = ?
                               where email = ?`;
                const conn = await connection;
                await conn.query(query, [code, data.email]);
                try {
                    const apiUrl = new URL("/api/admin/send", request.nextUrl.origin);

                    const response = await fetch(apiUrl.toString(), {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            email: data.email.toString(),
                            emailType: "activation",
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
        } else if (data.email !== '' && data.verificationCode !== '') {
            const query = `select email, name
                           from admin
                           where email = ?
                             and verificationCode = ?`;
            const conn = await connection;
            const result = await conn.query(query, [data.email, data.verificationCode]);
 
            // @ts-ignore
            if (result[0].length === 1) {
                const query = `update admin
                               set accountStatus = 1
                               where email = ?`;
                const conn = await connection;
                await conn.query(query, [data.email]);

                const updateVerificationCode = `update admin set verificationCode = ? where email = ? and verificationCode = ?`;
                await (await connection).query(updateVerificationCode, [Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), data.email, data.verificationCode]);

                const baseUrl = new URL("/api/admin/send/welcome", request.nextUrl.origin);
                const response = await fetch(baseUrl.toString(), {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: data.email.toString(),
                        role: 'admin',
                        // @ts-ignore
                        name: result[0][0].name,
                    }),
                });

                const res = await response.json();

                if (res.message === 'success') {
                    return NextResponse.json({ message: 'success' }, { status: 200 });
                } else {
                    return NextResponse.json({ message: 'Failed to send welcome email' }, { status: 500 });
                }

            } else {
                return NextResponse.json({message: 'Invalid verification code'}, {status: 400});
            }
        }
    } catch (error) {
        return NextResponse.json({message: 'Failed to send verification code'}, {status: 500});
    }
}