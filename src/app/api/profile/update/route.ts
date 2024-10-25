import {NextRequest, NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        if (data.password) {
            const checkCurrentPassword = "SELECT email FROM user WHERE id = ? AND password = ?";
            const conn = await connection;
            const [rows] = await conn.execute(checkCurrentPassword, [data.id, data.currentPassword]);
            // @ts-ignore
            if (rows[0].email === data.email) {
                const query =  "UPDATE user SET password = ? WHERE id = ?";
                await conn.execute(query, [data.confirmPassword, data.id]);
                return NextResponse.json({message: 'Password updated successfully'}, {status: 200});
            }else{
                return NextResponse.json({message: 'Incorrect password'}, {status: 401});
            }
        } else {
            const query = "UPDATE user SET firstName = ?, lastName = ?, email = ?, birthday = ?, country = ?, language = ?, gender = ? , mobile = ? WHERE id = ?";
            const conn = await connection;
            await conn.execute(query, [data.firstName, data.lastName, data.email, data.birthday, data.country, data.language, data.gender, data.mobile, data.id]);
            return NextResponse.json({message: 'Data updated successfully'}, {status: 200});
        }
    } catch (error) {
        return NextResponse.json({message: 'Error updating data', error : error}, {status: 500});
    }
}