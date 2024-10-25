import {NextResponse} from "next/server";
import connection from "@/utils/Connection";

export async function POST(request: Request) {
    try {
        const {page, limit, sort, order } = await request.json();
        let query = `SELECT *, v.id AS id, vt.name AS vehicleType, ft.name AS fuelType, tt.name AS transmissionType FROM vehicle v INNER JOIN vehicle_type vt ON v.vehicleType = vt.id INNER JOIN fuel_type ft ON v.fuel_type_id = ft.id INNER JOIN transmission_type tt ON v.transmissionType = tt.id`;

        if (sort && order) query += ` ORDER BY ${sort} ${order}`;
        if (limit && page) query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

        const conn = await connection;
        const [rows]: any[] = await conn.execute(query);

        const [allImages]: any[] = await conn.execute("SELECT * FROM vehicle_images");
        const images = allImages.reduce((acc: any, image: any) => {
            if (!acc[image.vehicleId]) {
                acc[image.vehicleId] = [];
            }
            acc[image.vehicleId].push(image);
            return acc;
        }, {});

        const formattedRows = (rows as any[]).map((row: any) => {
            row.images = images[row.id] || [];
            row.pricing = JSON.parse(row.pricing);
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