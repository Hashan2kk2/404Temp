import { NextRequest, NextResponse } from "next/server";
import connection from "@/utils/Connection";
import fs from "fs";
import { writeFile } from "fs/promises";
import { cookies } from 'next/headers';
// @ts-ignore
import jwt from "jsonwebtoken";

export async function PUT(request: NextRequest) {
  try {
    const dataSet = await request.formData();

    const coverImage = dataSet.get("coverImageRef") as unknown as File;
    const propertyImages = dataSet.getAll(
      "propertyImages"
    ) as unknown as File[];

    if (propertyImages.length === 0) {
      return NextResponse.json({ message: "No files found" }, { status: 400 });
    } else if (!coverImage) {
      return NextResponse.json(
        { message: "Cover image not found" },
        { status: 400 }
      );
    }

    const uploadDir = "public/uploads/properties";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let coverImagePath = "";
    const propertyImagePaths: string[] = [];

    const id = dataSet.get("id");
    const propertyType = dataSet.get("propertyType");
    const placeName = dataSet.get("placeName");
    const pickLocation = dataSet.get("pickLocation");
    const address = dataSet.get("address");
    const size = dataSet.get("size");
    const propertySizeType = dataSet.get("propertySizeType");
    const location = dataSet.get("location");
    const country = dataSet.get("country");
    const guests = dataSet.get("guests");
    const bedrooms = dataSet.get("bedrooms");
    const beds = dataSet.get("beds");
    const bathrooms = dataSet.get("bathrooms");
    const kitchen = dataSet.get("kitchen");
    const nightMin = dataSet.get("nightMin");
    const nightMax = dataSet.get("nightMax");
    const property_description = dataSet.get("property_description");
    const mapUrl = dataSet.get("mapUrl");
    const availabilitySchedule = dataSet.get("availabilitySchedule");
    const additionalRules = dataSet.get("additionalRules");
    const description = dataSet.get("description");

    if (
      !propertyType ||
      !placeName ||
      !pickLocation ||
      !address ||
      !size ||
      !propertySizeType ||
      !location ||
      !country ||
      !guests ||
      !bedrooms ||
      !beds ||
      !bathrooms ||
      !kitchen ||
      !nightMin ||
      !nightMax ||
      !property_description ||
      !availabilitySchedule ||
      !additionalRules ||
      !description
    ) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 400 }
      );
    }

    const owner = userId();
    const ownerId = owner.id;
    const ownerRole = owner.role;

    if (ownerRole !== "owner" && ownerRole !== "admin") {
      return NextResponse.json(
        { message: "You are not authorized to perform this action" },
        { status: 401 }
      );
    }

    if (ownerRole === "owner") {
      const checkQuery = `
        SELECT * FROM property_listing
        WHERE id = ? AND owner = ?
      `;

      const conn = await connection;
      const [rows]: [any[], any] = await conn.execute(checkQuery, [id, ownerId]);

      if (rows.length !== 1) {
        return NextResponse.json(
          { message: "You are not authorized to perform this action" },
          { status: 401 }
        );
      }
    }

    for (const file of propertyImages) {
      const bytes = await file.arrayBuffer();
      const imageBuffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = file.name.split(".").pop();
      const imagePath = `${uploadDir}/${uniqueSuffix}.${fileExtension}`;
      await writeFile(imagePath, imageBuffer);
      propertyImagePaths.push(imagePath.replace("public", ""));
    }

    const coverImageBytes = await coverImage.arrayBuffer();
    const coverImageBuffer = Buffer.from(coverImageBytes);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = coverImage.name.split(".").pop();
    coverImagePath = `${uploadDir}/${uniqueSuffix}.${fileExtension}`;
    await writeFile(coverImagePath, coverImageBuffer);
    const cvrImg = coverImagePath.replace("public", "");

    const query = `
      UPDATE property_listing SET 
      placeName = ?,
      propertyType = ?, 
      pickLocation = ?, 
      address = ?, 
      size = ?, 
      propertySizeType = ?,
      additionalRules = ?, 
      description = ?, 
      coverImageRef = ?, 
      nightMin = ?, 
      nightMax = ?, 
      availabilitySchedule = ?,
      guests = ?, 
      bedrooms = ?, 
      kitchen = ?, 
      location = ?, 
      country = ?, 
      property_description = ? ,
      mapUrl = ?
      WHERE id = ?
    `;

    const values = [
      placeName,
      propertyType,
      pickLocation,
      address,
      size,
      propertySizeType,
      additionalRules,
      description,
      cvrImg,
      nightMin,
      nightMax,
      availabilitySchedule,
      guests,
      bedrooms,
      kitchen,
      location,
      country,
      property_description,
      mapUrl,
      id,
    ];

    const conn = await connection;
    await conn.execute(query, values);

    const deleteQuery = `
      DELETE FROM property_images
      WHERE propertyListingId = ?
    `;

    await conn.execute(deleteQuery, [id]);

    for (const imagePath of propertyImagePaths) {
      const propertyImgQuery = `
        INSERT INTO property_images (ref, propertyListingId)
        VALUES (?, ?)
      `;
      const propertyImgValues = [imagePath, id];
      await conn.execute(propertyImgQuery, propertyImgValues);
    }

    return NextResponse.json({ message: "success" }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Error updating data", error },
      { status: 500 }
    );
  }
}

const userId = () => {
  try {
    // Retrieve the session token from the cookie
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('next-auth.session-token');

    // Ensure the session token exists before proceeding
    if (!sessionToken) {
      throw new Error("Session token not found");
    }

    // Decode the JWT token to extract the user details
    const decodedToken = jwt.decode(sessionToken.value) as {
      email?: string;
      firstName?: string;
      lastName?: string;
      name?: string;
      id?: number;
      role?: string;
    };

    // If the email exists in the decoded token, return the user's data
    if (decodedToken?.name) {
      return {
        email: decodedToken.email,
        name: decodedToken.name,
        id: decodedToken.id,
        role: decodedToken.role
      };
    } else if (decodedToken?.firstName) {
      return {
        email: decodedToken.email,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        id: decodedToken.id,
        role: decodedToken.role
      };
    } else {
      // Handle the case where the token does not contain an email
      throw new Error("Invalid token");
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error("Error decoding token");
  }
}