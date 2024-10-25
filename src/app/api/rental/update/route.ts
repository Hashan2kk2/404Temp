import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import connection from "@/utils/Connection";

export async function POST(request: NextRequest) {
  console.log("request");
  try {
    const dataSet = await request.formData();
    const files = dataSet.getAll("images") as unknown as File[];

    if (files.length === 0) {
      return NextResponse.json({ message: "No files found" }, { status: 400 });
    }

    const uploadDir = "public/uploads/rentals";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const images: string[] = [];
    const vehicleType = dataSet.get("vehicleType");
    const transmissionType = dataSet.get("transmissionType");
    const fuelTypeId = dataSet.get("fuelTypeId");
    const engineCapacity = dataSet.get("engineCapacity");
    const seatingCapacity = dataSet.get("seatingCapacity");
    const vehicleBrand = dataSet.get("vehicleBrand");
    const model = dataSet.get("model");
    const manufactureYear = dataSet.get("manufactureYear");
    const luggageCapacity = dataSet.get("luggageCapacity");
    const location = dataSet.get("location");
    const districtId = dataSet.get("districtId");
    const availabilityId = dataSet.get("availabilityId");
    const ownerName = dataSet.get("ownerName");
    const vehicleDescription = dataSet.get("vehicleDescription");
    const vehicleNumber = dataSet.get("vehicleNumber");
    const specialNote = dataSet.get("specialNote");
    const pricing = dataSet.get("pricing");
    const inclusions = dataSet.get("inclusions");
    const rentalId = dataSet.get("rentalId");

    if (
      !vehicleType ||
      !transmissionType ||
      !fuelTypeId ||
      !engineCapacity ||
      !seatingCapacity ||
      !vehicleBrand ||
      !model ||
      !manufactureYear ||
      !luggageCapacity ||
      !location ||
      !districtId ||
      !availabilityId ||
      !ownerName ||
      !vehicleDescription ||
      !vehicleNumber ||
      !specialNote ||
      !pricing ||
      !inclusions
    ) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 400 }
      );
    }

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const imageBuffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = file.name.split(".").pop();
      const imagePath = `${uploadDir}/${uniqueSuffix}.${fileExtension}`;
      await fs.promises.writeFile(imagePath, imageBuffer);
      images.push(imagePath.replace("public", ""));
    }

    console.log(images);

    const rentalQuery = `
            UPDATE vehicle
            SET vehicleNumber           = ?,
                vehicleType             = ?,
                vehicleBrand            = ?,
                model                   = ?,
                location                = ?,
                seatingCapacity         = ?,
                engineCapacity          = ?,
                transmissionType        = ?,
                fuel_type_id            = ?,
                luggageCapacity         = ?,
                vehicleDescription      = ?,
                inclusions              = ?,
                availability_id         = ?,
                specialNote             = ?,
                manufactureYear         = ?,
                owner                   = ?,
                district_id             = ?,
                pricing                 = ?,
                ownerName               = ?,
                basePrice               = ?
            WHERE id = ?
        `;

    const rentalValues = [
      vehicleNumber,
      vehicleType,
      vehicleBrand,
      model,
      location,
      seatingCapacity,
      engineCapacity,
      transmissionType,
      fuelTypeId,
      luggageCapacity,
      vehicleDescription,
      inclusions,
      availabilityId,
      specialNote,
      manufactureYear,
      1,
      districtId,
      pricing,
      ownerName,
      pricing,
      rentalId,
    ];

    const conn = await connection;
    await conn.execute(rentalQuery, rentalValues);

    const deleteQuery = `
            DELETE FROM vehicle_images
            WHERE vehicleId = ?
        `;

    await conn.execute(deleteQuery, [rentalId]);

    for (const imagePath of images) {
      const rentalImgQuery = `
                INSERT INTO vehicle_images (ref,vehicleId)
                VALUES (?,?)
            `;
      const rentalImgValues = [imagePath, rentalId];
      await conn.execute(rentalImgQuery, rentalImgValues);
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
