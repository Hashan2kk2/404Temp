import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";
import {setCookie} from "cookies-next";
// @ts-ignore
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.email || !data.password) {
            return NextResponse.json(
                {message: "Email or password cannot be empty"},
                {status: 400}
            );
        }

        const query = `SELECT email, accountStatus, firstName, lastName, id
                       FROM user
                       WHERE email = ?
                         AND password = ?`;
        const conn = await connection;
        const [result]: any = await conn.query(query, [data.email, data.password]);


        if (result.length === 1) {
            const user = result[0];

            if (user.accountStatus === 2) {
                return NextResponse.json(
                    {message: "notactivated"},
                    {status: 400}
                );
            } else if (user.accountStatus === 3) {
                return NextResponse.json(
                    {message: "banned"},
                    {status: 400}
                );
            } else {

                const token = jwt.sign(
                    {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        id: user.id,
                        role: 'user'
                    },
                    "4qBZwk/YhkX6055zgYpA09ye04AokbqA7b9U91HIWg8=",
                    {expiresIn: "48h"}
                );

                const response = NextResponse.json({message: "success"}, {status: 200});

                setCookie("next-auth.session-token", token, {
                    req: request as any,
                    res: response as any,
                    maxAge: 60 * 60 * 24 * 2,
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                });

                return response;
            }
        } else {
            return NextResponse.json(
                {message: "Invalid email or password"},
                {status: 400}
            );
        }
    } catch (error) {
        console.error("Error retrieving data", error);
        return NextResponse.json({message: "Error retrieving data", error}, {status: 500});
    }
}
