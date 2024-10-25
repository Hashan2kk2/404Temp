import {NextRequest, NextResponse} from 'next/server';
import {writeFile} from 'fs/promises';
import fs from 'fs';
import connection from '@/utils/Connection';

export async function POST(request: NextRequest) {
    try {
        const dataSet = await request.formData();

        const files = dataSet.getAll('image') as unknown as File[];

        if (files.length === 0) {
            return NextResponse.json({message: 'No files found'}, {status: 400});
        }
        const uploadDir = 'public/uploads/tours';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }

        const imagePaths: string[] = [];

        const title = dataSet.get('title');
        const tourType = dataSet.get('tourType');
        const tourCategory = dataSet.get('tourCategory');
        const location = dataSet.get('location');
        const noOfNights = dataSet.get('noOfNights');
        const host = dataSet.get('host');
        const languages = dataSet.get('languages');
        const inclusionsExclusions = dataSet.get('inclusionsExclusions');
        const description = dataSet.get('description');
        const price = dataSet.get('price');

        if (!title || !tourType || !noOfNights || !host || !languages || !inclusionsExclusions || !description || !price|| !tourCategory || !location) {
            return NextResponse.json({message: 'Something went wrong'}, {status: 400});
        }

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const imageBuffer = Buffer.from(bytes);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const newFileName = `${uniqueSuffix}-${file.name}`;
            const imagePath = `${uploadDir}/${newFileName}`;
            await writeFile(imagePath, imageBuffer);
            imagePaths.push(imagePath.replace('public', ''));
        }

        const tourQuery = `
            INSERT INTO tours (title, tourType, noOfNight, host, language, inclusions_exclusions, description, price,location,tourCategoryId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const tourValues = [
            title,
            tourType,
            noOfNights,
            host,
            languages,
            inclusionsExclusions,
            description,
            price,
            location,
            tourCategory
        ];

        const conn = await connection;
        const [result] = await conn.execute(tourQuery, tourValues);
        // @ts-ignore
        const tourId = result.insertId;

        for (const imagePath of imagePaths) {
            const tourImgQuery = `
                INSERT INTO tour_images (name,tours_id)
                VALUES (?,?)
            `;
            const tourImgValues = [
                imagePath,
                tourId
            ];
            await conn.execute(tourImgQuery, tourImgValues);
        }

        return NextResponse.json("Success", {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error inserting data', error}, {status: 500});
    }
}
