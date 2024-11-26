import { NextResponse } from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: Request) {
    try {
        const { page, limit, sort, order } = await request.json();
        let query = `SELECT 
      pl.placeName AS 'placeName', 
      pl.id AS 'id', 
      pt.name AS 'propertyType', 
      location, 
      pl.coverImageRef AS 'coverImage', 
      availability.name AS 'availability', 
      owner.firstName AS 'ownerFirstName', 
      owner.lastName AS 'ownerLastName', 
      review, 
      insertedDate 
    FROM property_listing pl 
    INNER JOIN property_type pt ON pl.propertyType = pt.id 
    INNER JOIN availability ON pl.availability = availability.id 
    INNER JOIN owner ON pl.owner = owner.id
    `;
        if (sort && order) query += ` ORDER BY ${sort} ${order}`;
        if (limit && page) query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

        const conn = await connection;
        const [properties]: any = await conn.execute(query);

        return NextResponse.json(properties, { status: 200 });

    } catch (error) {
        console.error("Error retrieving data:", error);
        return NextResponse.json(
            { message: "Error retrieving data", error: (error as Error).message },
            { status: 500 }
        );
    }
}