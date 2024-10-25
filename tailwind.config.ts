import type {Config} from "tailwindcss";

const {nextui} = require("@nextui-org/react");

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/**/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/**/**/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                'primary': "#582d31",
                'primary-900': "#321a1c",
                'primary-dark-color': "#111827",
            },
            aspectRatio: {
                'video-vertical': '9/16',
                'video-vertical-portrait': '3/4',
                'video-horizontal-landscape': '4/3',
            }
        },
    },
    darkMode: "class",
    plugins: [nextui()],
};
export default config;
