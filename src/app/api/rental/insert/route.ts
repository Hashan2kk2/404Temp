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
        const uploadDir = 'public/uploads/rentals';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }

        const imagePaths: string[] = [];

        const vehicleType = dataSet.get('vehicleType');
        const transmissionType = dataSet.get('transmissionType');
        const gasolineType = dataSet.get('gasolineType');
        const engineCapacity = dataSet.get('engineCapacity');
        const seatingCapacity = dataSet.get('seatingCapacity');
        const brand = dataSet.get('brand');
        const model = dataSet.get('model');
        const year = dataSet.get('year');
        const luggageCapacity = dataSet.get('luggageCapacity');
        const location = dataSet.get('location');
        const district = dataSet.get('district');
        const availability = dataSet.get('availability');
        const ownerName = dataSet.get('ownerName');
        const vehicleDescription = dataSet.get('vehicleDescription');
        const vehicleNumber = dataSet.get('vehicleNumber');
        const specialNote = dataSet.get('specialNote');
        const currency = dataSet.get('currency');
        const pricing = dataSet.get('pricing');
        const inclusions = dataSet.get('inclusions');
        const ownerId = '1';

        if (!vehicleType || !transmissionType || !gasolineType || !engineCapacity || !seatingCapacity || !brand || !model || !year || !luggageCapacity || !location || !district || !availability || !ownerName || !vehicleDescription || !vehicleNumber || !specialNote ||  !currency || !pricing || !inclusions) {
            console.error('Something went wrong');
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

        const rentalQuery = `
            INSERT INTO vehicle (vehicleNumber, vehicleType, vehicleBrand, model, location, seatingCapacity, engineCapacity, transmissionType, fuel_type_id, luggageCapacity, vehicleDescription, inclusions, availability_id, specialNote, manufactureYear, owner, district_id,pricing, ownerName)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const rentalValues = [
            vehicleNumber,
            vehicleType,
            brand,
            model,
            location,
            seatingCapacity,
            engineCapacity,
            transmissionType,
            gasolineType,
            luggageCapacity,
            vehicleDescription,
            inclusions,
            availability,
            specialNote,
            year,
            ownerId,
            district,
            pricing,
            ownerName,
        ];

        const conn = await connection;
        const [result] = await conn.execute(rentalQuery, rentalValues);

        // @ts-ignore
        const rentalId = result.insertId;

        for (const imagePath of imagePaths) {
            const rentalImgQuery = `
                INSERT INTO vehicle_images (ref,vehicleId)
                VALUES (?,?)
            `;
            const rentalImgValues = [
                imagePath,
                rentalId
            ];
            await conn.execute(rentalImgQuery, rentalImgValues);
        }

        return NextResponse.json("Success", {status: 200});
    } catch (e) {
        return NextResponse.json({message: e}, {status: 400});
    }
}