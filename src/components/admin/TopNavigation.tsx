'use client';
import Logo from "../../assets/img/logo/logo.png";
import {IoNotificationsOutline, IoSettingsOutline} from "react-icons/io5";
import {BsPower} from "react-icons/bs";
import {FiHome, FiMenu, FiSearch} from "react-icons/fi";
import OffCanvas from "@/components/OffCanvas";
import Navigation from "@/components/admin/Navigation";
import {useState} from "react";

const TopNavigation = ({activeTab, setActiveTab, userDetails}: { activeTab: string, setActiveTab: any, userDetails: any }) => {

    const [isOpen, setIsOpen] = useState(false);

    const topNavigation = [
        {
            icon: <FiHome/>,
            title: "Home",
            link: "/"
        },
        // {
        //     icon: <IoNotificationsOutline/>,
        //     title: "Notifications",
        //     link: ""
        // },
        {
            icon: <IoSettingsOutline/>,
            title: "Settings",
            link: "/admin/profile"
        },
        {
            icon: <BsPower/>,
            title: "logout",
            link: "/api/logout?logout=true"
        }
    ];

    return (
        <>
            <div
                className="flex items-center justify-between w-full h-20 gap-4 px-8 bg-white border rounded-xl xl:gap-10 border-neutral-100 backdrop-blur-2xl opacity-90">
                <img aria-label="image"  src={Logo.src} alt="logo" className="object-contain h-12 lg:hidden"/>
                <span
                    className="hidden text-sm text-neutral-500 lg:block w-fit whitespace-nowrap">Welcome to Dashboard</span>
                {/* <div
                    className="gap-4 w-full h-10 bg-[#582D310A] rounded-lg items-center px-4 hidden md:flex">
                    <FiSearch className="text-neutral-400"/>
                    <input type="text" placeholder="Search" className="w-full text-sm bg-transparent outline-0"/>
                </div> */}
                <div className="items-center hidden gap-2 lg:flex">
                    {topNavigation.map((item, index) => (
                        <a href={item.link} key={index}>
                            <div
                                className={`flex items-center space-x-2 cursor-pointer text-neutral-500 p-2 px-4 rounded-xl text-[12px]`}>
                                {item.icon}
                                <span className="hidden xl:block">
                                            {item.title}
                                        </span>
                            </div>
                        </a>
                    ))}
                </div>
                <button className="p-2 text-white rounded bg-primary-900 lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                    <FiMenu/>
                </button>
            </div>
            <OffCanvas isOpen={isOpen} setIsOpen={setIsOpen} className="lg:hidden">
                <Navigation userDetails={userDetails} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </OffCanvas>
        </>
    );
}

export default TopNavigation;