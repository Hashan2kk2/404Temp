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

        let query = `SELECT *, tours.id as id, tt.name as tourType, l.name as language, tc.name as tourCategory FROM tours INNER JOIN tour_type tt ON tt.id = tours.tourType INNER JOIN language l ON l.id = tours.language INNER JOIN tour_category tc ON tc.id = tours.tourCategoryId`;

        if (sort && order) query += ` ORDER BY ${sort} ${order}`;
        if (limit && page) query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

        const conn = await connection;
        const [rows]: any[] = await conn.execute(query);

        const [allImages]: any[] = await conn.execute("SELECT * FROM tour_images");
        const images = allImages.reduce((acc: any, image: any) => {
            if (!acc[image.tours_id]) {
                acc[image.tours_id] = [];
            }
            acc[image.tours_id].push(image);
            return acc;
        }, {});

        const formattedRows = (rows as any[]).map((row: any) => {
            row.images = images[row.id] || [];
            row.inclusions_exclusions = JSON.parse(row.inclusions_exclusions);
            row.description = JSON.parse(row.description);
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