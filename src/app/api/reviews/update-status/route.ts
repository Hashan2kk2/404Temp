import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {

    const {id, status,type} = await request.json();

    const query = "SELECT id FROM status WHERE name = ?";
    const conn = await connection;
    const [result] = await conn.execute(query, [status]);

    let statusId = 0;

    // @ts-ignore
    result.forEach((row: any) => {
        statusId = row.id;
    });

    try {
        let query = "";

        if(type === "flights") {
            query = "UPDATE flight_review SET status_id = ? WHERE id = ?";
        }else{
            query = "UPDATE `review` SET status_id = ? WHERE id = ?";
        }
        const conn = await connection;
        await conn.execute(query, [statusId, id]);
        return NextResponse.json("Success", {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error updating data', error}, {status: 500});
    }
}