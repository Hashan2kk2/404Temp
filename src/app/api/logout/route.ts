import {NextRequest, NextResponse} from "next/server";

const clearSessionCookie = (response: NextResponse) => {
    response.cookies.set("next-auth.session-token", "", {
        expires: new Date(0),
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
};

export async function GET(request: NextRequest) {
    try {
        const logout = request.nextUrl.searchParams.get("logout");

        if (logout !== "true") {
            return NextResponse.json({ message: "Invalid logout request" }, { status: 400 });
        }

        const redirectUrl = new URL("/", request.nextUrl);
        const response = NextResponse.redirect(redirectUrl);
        clearSessionCookie(response);
        return response;
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error: error }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const logout = request.nextUrl.searchParams.get("logout");

        if (logout !== "true") {
            return NextResponse.json({ message: "Invalid logout request" }, { status: 400 });
        }

        const response = NextResponse.json({ message: "success" }, { status: 200 });
        clearSessionCookie(response);
        return response;
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error: error }, { status: 500 });
    }
}
