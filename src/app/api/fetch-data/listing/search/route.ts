import { NextResponse } from "next/server";
import connection from "@/utils/Connection";

function isDateInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
}

function compareAmenities(requested: string[], available: string[]): boolean {
    return requested.every(item => available.includes(item));
}

export async function POST(request: Request) {
    try {
        const { page, limit, sort, order } = await request.json();

        let query = `SELECT *, pst.name as propertySizeType, pt.name as propertyType, pl.id as id
                 FROM property_listing AS pl
                 INNER JOIN property_size_type as pst ON pl.propertySizeType = pst.id
                 INNER JOIN property_type as pt ON pl.propertyType = pt.id`;

        if (sort && order) query += ` ORDER BY ${sort} ${order}`;
        if (limit && page) query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

        const conn = await connection;
        const [rows]: any[] = await conn.execute(query);

        let formattedRows = (rows as any[]).map((row: any) => {
            if (row.description) {
                try {
                    const description = JSON.parse(row.description);
                    row.description = {
                        amenities: description.amenities || {
                            general: [],
                            other: [],
                            safety: []
                        },
                        rulesForGuests: description.rulesForGuests || [],
                        pricing: description.pricing || {
                            currency: "",
                            basePriceForWeekdays: "",
                            basePriceForWeekends: "",
                            monthlyDiscount: ""
                        }
                    };
                } catch (e) {
                    console.error("Error parsing description:", e);
                    row.description = null;
                }
            }
            return row;
        });
        return NextResponse.json(formattedRows, { status: 200 });
    } catch (error) {
        console.error("Error retrieving data:", error);
        return NextResponse.json(
            { message: "Error retrieving data", error: (error as Error).message },
            { status: 500 }
        );
    }
}