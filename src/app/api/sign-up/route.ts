import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        if (data.email === '' || data.password === '' || data.confirmPassword === '' || data.country === '') {
            return NextResponse.json({message: 'Something went wrong'}, {status: 400});
        } else if (data.password !== data.confirmPassword) {
            return NextResponse.json({message: 'Passwords do not match'}, {status: 400});
        } else {
            const query = `select email
                           from user
                           where email = ?`;
            const conn = await connection;
            const result = await conn.query(query, [data.email]);
            // @ts-ignore
            if (result[0].length !== 0) {
                return NextResponse.json({message: 'Email already exists'}, {status: 400});
            } else {
                const query = `insert into user (firstName, email, password, country, accountStatus, language)
                               values (?, ?, ?, ?, ?, ?)`;
                const values = [data.firstName, data.email, data.password, data.country, 2, data.language];
                const conn = await connection;
                await conn.query(query, values);
                return NextResponse.json({message: 'success'}, {status: 200});
            }
        }

    } catch (error) {
        return NextResponse.json({message: 'Error retrieving data', error}, {status: 500});
    }
}