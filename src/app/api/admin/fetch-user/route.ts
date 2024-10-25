import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {

    const data = await request.json();
    const email = data.email;

    if (!email) {
        return NextResponse.json({message: "Email is required"}, {status: 400});
    } else {
        const query = `SELECT admin.id as id, admin.name as name, admin.email as email, admin.accountStatus as accountStatus
                       FROM admin
                       WHERE admin.email = ?`;
        let conn = await connection;
        const [result]: any = await conn.query(query, [email]);

        if (result.length === 1) {
            return NextResponse.json(result, {status: 200});
        } else {
            return NextResponse.json({message: "Email does not exist"}, {status: 400});
        }
    }

}