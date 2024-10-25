import {Switch} from "@nextui-org/switch";
import {VisuallyHidden} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {BsMoon, BsSun} from "react-icons/bs";

// @ts-ignore
const ThemeSwitch = ({screen, ...props}) => {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');

    useEffect(() => {
        // Retrieve the saved theme or detect the system's preference
        const savedTheme = localStorage.getItem('theme') ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        // @ts-ignore
        setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
    }, [theme]);

    return (
        <>
            {screen === 'mobile' && (
                <span onClick={toggleTheme} className="text-2xl">
                    {theme === 'dark' ? <BsSun/> : <BsMoon/>}
                </span>
            )}

            {screen === 'large' && (
                <>
                    <VisuallyHidden>
                        <input type="checkbox" checked={theme === 'dark'} readOnly/>
                    </VisuallyHidden>
                    <Switch
                        onClick={toggleTheme}
                        checked={theme === 'dark'}
                        size="sm"
                        {...props}
                    />
                </>
            )}
        </>
    );
};

export default ThemeSwitch;
