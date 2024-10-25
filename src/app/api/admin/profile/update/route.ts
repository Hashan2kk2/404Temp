import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        if (data.password) {
            const checkCurrentPassword = "SELECT email FROM admin WHERE id = ? AND password = ?";
            const conn = await connection;
            const queryValues = [data.id, data.currentPassword];
            const [rows] = await conn.execute(checkCurrentPassword, queryValues);
            // @ts-ignore
            if (rows[0].email === data.email) {
                const query = "UPDATE admin SET password = ? WHERE id = ?";
                await conn.execute(query, [data.confirmPassword, data.id]);
                return NextResponse.json({message: 'Password updated successfully'}, {status: 200});
            } else {
                return NextResponse.json({message: 'Incorrect password'}, {status: 401});
            }
        } else {
            const query = "UPDATE admin SET name = ? WHERE id = ? AND email = ?";
            const conn = await connection;
            await conn.execute(query, [data.name, data.id, data.email]);
            return NextResponse.json({message: 'Data updated successfully'}, {status: 200});
        }
    } catch (error) {
        return NextResponse.json({message: 'Error updating data', error: error}, {status: 500});
    }
}