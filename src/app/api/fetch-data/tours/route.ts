import {NextRequest, NextResponse} from 'next/server';
import connection from "@/utils/Connection";

export async function GET(request: NextRequest) {
    try {
        const query = "SELECT * FROM `tours`";
        const conn = await connection;
        const [tours]:any = await conn.execute(query);

        const tourImages: { tourId: any; image: any; }[] = [];

        // @ts-ignore
        for (const tour of tours) {
            const tourId = tour.id;
            const imageQuery = `SELECT *
                                FROM tour_images
                                WHERE tours_id = ?`;

            const [imagesList] = await conn.execute(imageQuery, [tourId]);
            // @ts-ignore
            for (const image of imagesList) {
                tourImages.push({
                    tourId: tourId,
                    image: image.name
                });
            }
        }

        const toursList = tours.map((tour: any) => {
            return {
                ...tour,
                description: JSON.parse(tour.description),
                inclusions_exclusions: JSON.parse(tour.inclusions_exclusions)
            };
        });

        return NextResponse.json({toursList, tourImages});

    } catch (error) {
        return NextResponse.json({message: 'Error retrieving data', error}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const {id} = await request.json();
        const query = "SELECT tours.id AS 'tourId',tours.title,tours.tourType AS 'tourTypeId',tour_type.name AS 'tourType',tours.noOfNight,tours.host,tours.language AS 'languageId',language.name  AS 'language',tours.inclusions_exclusions,tours.description,tours.price,tours.insertedDate,tours.review FROM tours INNER JOIN tour_type ON tours.tourType = tour_type.id INNER JOIN language ON tours.language = language.id WHERE tours.id = ?";
        const conn = await connection;
        const [tours]: any = await conn.execute(query, [id]);

        const tourImages: { tourId: any; image: any; }[] = [];

        // @ts-ignore
        for (const tour of tours) {
            const tourId = tour.tourId;
            const imageQuery = `SELECT *
                                FROM tour_images
                                WHERE tours_id = ?`;

            const [imagesList] = await conn.execute(imageQuery, [tourId]);
            // @ts-ignore
            for (const image of imagesList) {
                tourImages.push({
                    tourId: tourId,
                    image: image.name
                });
            }
        }

        const toursList = tours.map((tour: any) => {
            return {
                ...tour,
                description: JSON.parse(tour.description),
                inclusions_exclusions: JSON.parse(tour.inclusions_exclusions)
            };
        });

        return NextResponse.json({toursList, tourImages});

    } catch (error) {
        console.log(error);
        return NextResponse.json({message: 'Error retrieving data', error}, {status: 500});
    }
}
