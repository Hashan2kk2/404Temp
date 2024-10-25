import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (data.email === '') {
            return NextResponse.json({message: 'Please enter your email'}, {status: 400});
        }

        const queryEx = `select *
                       from newsletter
                       where email = ?`;
        const conn = await connection;
        const [rows] = await conn.query(queryEx, [data.email]);

        // @ts-ignore
        if (rows.length > 0) {
            return NextResponse.json({message: 'Email already exists'}, {status: 400});
        } else {
            const insertQuery = `insert into newsletter (email)
                           values (?)`;
            const conn = await connection;
            await conn.query(insertQuery, [data.email]);
            return NextResponse.json({message: 'Success'}, {status: 200});
        }
    } catch (error) {
        return NextResponse.json({message: 'Something went wrong. Please try again..', error}, {status: 500});
    }
}