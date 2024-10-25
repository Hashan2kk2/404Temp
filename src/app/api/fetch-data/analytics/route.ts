import { NextRequest, NextResponse } from 'next/server';
import connection from "@/utils/Connection";

export async function GET(request: NextRequest) {
    try {
        const conn = await connection;

        const query = `
            SELECT DATE(insertedDate) as date, COUNT(*) as count, 'stays' as type
            FROM property_listing
            WHERE insertedDate >= CURDATE() - INTERVAL 7 DAY
            GROUP BY DATE(insertedDate)
            UNION ALL
            SELECT DATE(insertedDate) as date, COUNT(*) as count, 'tours' as type
            FROM tours
            WHERE insertedDate >= CURDATE() - INTERVAL 7 DAY
            GROUP BY DATE(insertedDate)
            UNION ALL
            SELECT DATE(insertedDate) as date, COUNT(*) as count, 'vehicles' as type
            FROM vehicle
            WHERE insertedDate >= CURDATE() - INTERVAL 7 DAY
            GROUP BY DATE(insertedDate)
            ORDER BY date ASC;
        `;

        const [rows]: any[] = await conn.query(query);

        const categories: string[] = [];
        const stays: number[] = [];
        const tours: number[] = [];
        const rentals: number[] = [];

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        last7Days.forEach(date => {
            categories.push(date);
            stays.push(0);
            tours.push(0);
            rentals.push(0);
        });

        rows.forEach((row: any) => {
            const dateIndex = categories.indexOf(new Date(row.date).toISOString().split('T')[0]);

            if (dateIndex !== -1) {
                switch (row.type) {
                    case 'stays':
                        stays[dateIndex] = row.count;
                        break;
                    case 'tours':
                        tours[dateIndex] = row.count;
                        break;
                    case 'vehicles':
                        rentals[dateIndex] = row.count;
                        break;
                }
            }
        });

        return NextResponse.json({ categories, stays, tours, rentals });

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
    }
}