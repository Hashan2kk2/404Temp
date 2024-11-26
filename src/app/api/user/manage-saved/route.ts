import connection from "@/utils/Connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const userEmail = request.nextUrl.searchParams.get('email');
    try {
        let query = "SELECT savedItem FROM `user` WHERE email = ?";
        const conn = await connection;
        const [result]: any = await conn.execute(query, [userEmail]);
        console.log(result);
        return NextResponse.json(JSON.parse(result[0].savedItem), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error retrieving data', error }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { email, savedItem } = await request.json();

    try {
        const query = "UPDATE `user` SET savedItem = ? WHERE email = ?";
        const conn = await connection;
        await conn.execute(query, [JSON.stringify(savedItem), email]);
        return NextResponse.json("Success", { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating data', error }, { status: 500 });
    }
}