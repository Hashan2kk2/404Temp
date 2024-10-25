import {NextRequest, NextResponse} from 'next/server';
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
    try {

        const data = await request.json();

        if (data.name === '' || data.destination === '' || data.durationFrom === '' || data.durationTo === '' || data.email === '' || data.phone === '' || data.notes === '' || data.country === '') {
            return NextResponse.json({message: 'Fill all the fields'}, {status: 400});
        }else{
            const query = `insert into custom_trip (name, durationFrom, durationTo, email, phone, notes, destination,
                                                    country)
                           values (?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [data.name, data.durationFrom, data.durationTo, data.email, data.phone, data.notes,data.destination, data.country];
            const conn = await connection;
            await conn.query(query, values);
            return NextResponse.json({message: 'Success'}, {status: 200});
        }

    } catch (error) {
        return NextResponse.json({message: 'Error retrieving data', error}, {status: 500});
    }
}