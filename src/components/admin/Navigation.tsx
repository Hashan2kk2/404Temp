"use client";
import Logo from "../../assets/img/logo/logo.png";
import Image from "next/image";
// @ts-ignore
import {BsInfoCircle, BsPersonCircle, BsPower} from "react-icons/bs";
import {RxHome} from "react-icons/rx";
import {MdOutlineSpaceDashboard} from "react-icons/md";
import {LiaCarSideSolid} from "react-icons/lia";
import {IoBookmarksOutline, IoSettingsOutline} from "react-icons/io5";
import {LuUsers2} from "react-icons/lu";
import {TbLocationCog} from "react-icons/tb";

const Navigation = ({activeTab, setActiveTab, userDetails}: { activeTab: string, setActiveTab: any, userDetails: any }) => {

    const navigation = [
        {
            icon: <MdOutlineSpaceDashboard/>,
            title: "Dashboard",
            link: ""
        },
        {
            icon: <RxHome/>,
            title: "Manage Properties",
            link: ""
        },
        {
            icon: <LiaCarSideSolid/>,
            title: "Manage Rentals",
            link: ""
        },
        {
            icon: <TbLocationCog/>,
            title: "Manage Tours",
            link: ""
        },
        // {
        //     icon: <PiAirplaneInFlight/>,
        //     title: "Manage Flights",
        //     link: ""
        // },
        {
            icon: <IoBookmarksOutline/>,
            title: "Customer Reviews",
            link: ""
        },
        {
            icon: <LuUsers2/>,
            title: "Manage Users",
            link: ""
        },
    ];
    const bottomNavigation = [
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

    // @ts-ignore

    return (
        <div
            className="flex flex-col justify-between w-full h-full px-6 py-8 bg-white border rounded-2xl border-neutral-100 backdrop-blur-2xl xl:opacity-90">
            <Image aria-label="image" src={Logo} alt="logo" className="object-contain h-16 w-fit lg:mx-auto"/>
            <div className="flex flex-col items-center w-full h-full mt-10 overflow-auto gap-y-4 pe-4 lg:pe-0">
                <h3 className="text-[12px] uppercase block w-full">Menus</h3>
                {navigation.map((item, index) => (
                    <div key={index} onClick={() => setActiveTab("tab" + index)}
                         className={`flex items-center text-sm space-x-2 cursor-pointer w-full p-2 px-4 rounded-md text-neutral-500 
                         ${activeTab === "tab" + index ? "bg-primary-900 text-white" : ""} `}>
                        {item.icon}
                        <span className="">
                            {item.title}
                        </span>
                    </div>
                ))}
            </div>

            <div className="w-full">
                <h3 className="text-[12px] uppercase block w-full mb-3">Profile</h3>
                <div className="flex items-center w-full space-x-4">
                    <BsPersonCircle className="text-3xl text-neutral-400"/>
                    <div>
                        {/*@ts-ignore*/}
                        <h1 className="text-sm font-semibold text-neutral-800">{userDetails?.name}</h1>
                        {/*@ts-ignore*/}
                        <p className="text-xs text-neutral-600">{userDetails?.email}</p>
                    </div>
                </div>

                <hr className="my-3 mt-5"/>

                <div className="flex flex-col items-center gap-y-1">
                    <h3 className="text-[12px] uppercase block w-full mb-3">Others</h3>
                    {bottomNavigation.map((item, index) => (
                        <a key={index}
                              href={item.link}
                              className="flex items-center text-[13px] transition duration-300 space-x-2 cursor-pointer w-full text-neutral-400 hover:bg-neutral-100 p-2 px-4 rounded-xl">
                            <div className="">
                                {item.icon}
                            </div>
                            <span className="text-neutral-400">
                                {item.title}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Navigation;