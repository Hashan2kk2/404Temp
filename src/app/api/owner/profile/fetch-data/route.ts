import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const email = data.email;
        const id = data.id;

        const query = "SELECT id, firstName, lastName, email, contact, accountStatus, language, country FROM owner WHERE email = ? AND id = ?";
        const conn = await connection;
        const [rows] = await conn.execute(query, [email, id]);
        // @ts-ignore
        if (rows.length === 0) {
            return NextResponse.json({message: 'User not found'}, {status: 404});
        }
        // @ts-ignore
        else if (rows.length > 1) {
            return NextResponse.json({message: 'Something went wrong'}, {status: 500});
        } else {
            // @ts-ignore
            rows[0].admin = true;
            // @ts-ignore
            return NextResponse.json(rows[0], {status: 200});
        }


    } catch (error) {
        return NextResponse.json({message: 'Error retrieving data', error}, {status: 500});
    }
}