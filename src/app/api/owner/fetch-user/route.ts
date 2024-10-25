import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {

    const data = await request.json();
    const email = data.email;

    if (!email) {
        return NextResponse.json({message: "Email is required"}, {status: 400});
    } else {
        const query = `SELECT owner.id as id, owner.firstName as firstName, owner.lastName as lastName, owner.email as email, country.name as country, language.name as language, owner.accountStatus as accountStatus FROM owner inner join country on country.id = owner.country inner join language on language.id = owner.language  WHERE owner.email = ?`;
        const conn = await connection;
        const [result]: any = await conn.query(query, [email]);

        if (result.length === 1) {
            return NextResponse.json(result, {status: 200});
        } else {
            return NextResponse.json({message: "Email does not exist"}, {status: 400});
        }
    }

}