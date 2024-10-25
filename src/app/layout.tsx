import "./globals.css";
import {NextUIProvider} from "@nextui-org/react";
import type {Metadata} from "next";
import ClientLayout from "./ClientLayout";
import {Suspense} from "react";

export const metadata: Metadata = {
    title: "404 Travels",
    description: "404 Travels",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon/Bronze.svg" />
            </head>
            <body>
                <NextUIProvider>
                    <Suspense fallback={
                        <div className={`w-full h-screen flex justify-center items-center`}>
                            <div className={`text-2xl`}>Loading...</div>
                        </div>
                    }>
                        <ClientLayout>{children}</ClientLayout>
                    </Suspense>
                </NextUIProvider>
            </body>
        </html>
    );
}
