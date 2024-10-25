import {NextResponse} from "next/server";
import {cookies} from 'next/headers';
// @ts-ignore
import jwt from "jsonwebtoken";

export async function POST() {
    try {
        // Retrieve the session token from the cookie
        const cookieStore = cookies();
        const sessionToken = cookieStore.get('next-auth.session-token');

        // Ensure the session token exists before proceeding
        if (!sessionToken) {
            return NextResponse.json({error: "Session token not found"}, {status: 401});
        }

        // Decode the JWT token to extract the user details
        const decodedToken = jwt.decode(sessionToken.value) as {
            email?: string;
            firstName?: string;
            lastName?: string;
            id?: number;
            role?: string;
        };

        // If the email exists in the decoded token, return the user's data
        if (decodedToken?.email) {
            return NextResponse.json({
                email: decodedToken.email,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                id: decodedToken.id,
                role: decodedToken.role,
            });
        } else {
            // Handle the case where the token does not contain an email
            return NextResponse.json({error: "Invalid token"}, {status: 400});
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        // Return a generic error response for debugging purposes
        return NextResponse.json({error: "Error decoding token"}, {status: 500});
    }
}
