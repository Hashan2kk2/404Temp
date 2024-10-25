import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function GET(request: NextRequest) {
    const userEmail = request.nextUrl.searchParams.get('email');
    try {
        let query: string;
        if (userEmail) {
            query = "SELECT  `user`.id,`user`.firstName,`user`.lastName,`user`.email,`user`.createTime,country.`name` AS 'country', account_status.`name` AS 'status' FROM `user` INNER JOIN country ON `user`.country = country.id INNER JOIN account_status ON `user`.accountStatus = account_status.id INNER JOIN `language` ON `user`.`language`= `language`.id WHERE `user`.email = ?";
        } else {
            query = "SELECT  `user`.id,`user`.firstName,`user`.lastName,`user`.email,`user`.createTime,country.`name` AS 'country', account_status.`name` AS 'status' FROM `user` INNER JOIN country ON `user`.country = country.id INNER JOIN account_status ON `user`.accountStatus = account_status.id INNER JOIN `language` ON `user`.`language`= `language`.id";
        }
        const conn = await connection;
        const [result] = await conn.execute(query, [userEmail]);
        return NextResponse.json(result, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error retrieving data', error}, {status: 500});
    }
}

export async function POST(request: NextRequest) {

    const {id, status} = await request.json();

    const query = "SELECT id FROM account_status WHERE name = ?";
    const conn = await connection;
    const [result] = await conn.execute(query, [status]);

    let statusId = 0;

    // @ts-ignore
    result.forEach((row: any) => {
        statusId = row.id;
    });

    try {
        const query = "UPDATE `user` SET accountStatus = ? WHERE id = ?";
        const conn = await connection;
        await conn.execute(query, [statusId, id]);
        return NextResponse.json("Success", {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error updating data', error}, {status: 500});
    }
}