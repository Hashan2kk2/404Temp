import LogoBlack from "../assets/img/logo/logo.png";
import {BsFacebook, BsInstagram, BsTiktok, BsTwitter, BsTwitterX, BsX, BsYoutube} from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

const Footer = ({setIsFlight}:{setIsFlight: any}) => {

    const destinations = [ 
        {
            title: "Asia",
            link: ""
        },
        {
            title: "Africa",
            link: ""
        },
        {
            title: "North America",
            link: ""
        },
        {
            title: "South America",
            link: ""
        },
        {
            title: "Antarctica",
            link: ""
        },
        {
            title: "Europe",
            link: ""
        },
        {
            title: "Australia",
            link: ""
        },
    ];

    const services = [
        {
            title: "Leisure Travel",
            link: "/docs/BusinessDoc.pdf"
        },
        {
            title: "Corporate Solutions",
            link: "/docs/BusinessDoc.pdf"
        },
        {
            title: "Long-Term Accommodations",
            link: "/docs/BusinessDoc.pdf"
        },
        {
            title: "Flight Bookings",
            link: "/docs/BusinessDoc.pdf"
        },
        {
            title: "Visa Assistance",
            link: "/docs/BusinessDoc.pdf"
        },
        {
            title: "Ayurvedic Wellness & Treatment",
            link: "/docs/BusinessDoc.pdf"
        }
    ];

    const quickLinks = [
        {
            title: "Home",
            link: "/"
        },
        {
            title: "Stays",
            link: "/stay/listing"
        },
        {
            title: "Rental",
            link: "/rental/listing"
        },
        {
            title: "Flights",
            link: "#"
        },
        {
            title: "Long Term",
            link: "www.hikkarent.com"
        },
    ];

    const contactUs = [
        {
            title: "info@404travels.com",
            link: "mailto:ininfo@404travels.com"
        },
        {
            title: "+94 76 371 88 06",
            link: "tel:+94763718806"
        },
        {
            title: "Hikkaduwa, Sri Lanka",
            link: "#"
        }
    ];

    return (
        <div className="max-w-[1300px] mx-auto w-full px-8 md:px-20 xl:px-0 py-16">
            <hr className="mb-16"/>
            <div className="grid grid-cols-12 lg:hidden">
                <div className="col-span-3">
                    {/*@ts-ignore*/}
                    <Image aria-label="image" src={LogoBlack} alt="logo" className="w-24"/>
                </div>
                <div className="flex items-center col-span-9 gap-6 ps-10 md:ps-0">
                    <Link href="facebook.com/404travels" className="text-neutral-500 mt-4 block text-[14px]">
                        <BsFacebook size={15}
                                    className="inline cursor-pointer text-neutral-700 hover:text-primary me-2"/>
                    </Link>
                    <Link href="x.com/404Travels" className="text-neutral-500 mt-4 block text-[14px]">
                        <BsTwitterX size={15}
                                   className="inline cursor-pointer text-neutral-700 hover:text-primary me-2"/>
                    </Link>
                    <Link href="tiktok.com/@404travels" className="text-neutral-500 mt-4 block text-[14px]">
                        <BsTiktok size={15}
                                   className="inline cursor-pointer text-neutral-700 hover:text-primary me-2"/>
                    </Link>
                    <Link href="instagram.com/404travels" className="text-neutral-500 mt-4 block text-[14px]">
                        <BsInstagram size={15}
                                     className="inline cursor-pointer text-neutral-700 hover:text-primary me-2"/>
                    </Link>
                </div>
            </div>
            <div className="grid w-full grid-cols-4 lg:grid-cols-5">
                <div className="hidden col-span-4 mt-8 md:col-span-1 lg:block">
                    <Image aria-label="image" src={LogoBlack} alt="logo" className="w-24"/>
                    <div className="ms-2">
                        <a href="facebook.com/404travels" className="text-neutral-500 mt-4 block text-[14px]">
                            <BsFacebook size={15}
                                        className="inline cursor-pointer text-neutral-700 hover:text-primary me-2"/> FaceBook
                        </a>
                        <a href="x.com/404Travels" className="text-neutral-500 mt-4 block text-[14px]">
                            <BsTwitterX size={15}
                                       className="inline cursor-pointer text-neutral-700 hover:text-primary me-2"/> Twitter
                        </a>
                        <a href="tiktok.com/@404travels" className="text-neutral-500 mt-4 block text-[14px]">
                            <BsTiktok size={15}
                                       className="inline cursor-pointer text-neutral-700 hover:text-primary me-2"/> Youtube
                        </a>
                        <a href="instagram.com/404travels" className="text-neutral-500 mt-4 block text-[14px]">
                            <BsInstagram size={15}
                                         className="inline cursor-pointer text-neutral-700 hover:text-primary me-2"/> Instagram
                        </a>
                    </div>
                </div>
                <div className="col-span-4 mt-8 md:col-span-1">
                    <h3 className="font-bold text-[14px]">Destinations</h3>
                    {destinations.map((item, index) => (
                        <a href={item.link} key={index}
                              className="text-neutral-500 mt-4 block text-[14px]">{item.title}</a>
                    ))}
                </div>
                <div className="col-span-4 mt-8 md:col-span-1">
                    <h3 className="font-bold text-[14px]">Services</h3>
                    {services.map((item, index) => (
                        <a href={item.link} key={index} target="_blank"
                              className="text-neutral-500 mt-4 block text-[14px]">{item.title}</a>
                    ))}
                </div>
                <div className="col-span-4 mt-8 md:col-span-1">
                    <h3 className="font-bold text-[14px]">Quick Links</h3>
                    {quickLinks.map((item, index) => (
                        <a href={item.link} key={index}
                              className="text-neutral-500 mt-4 block text-[14px]"  onClick={() => { if (item.title === "Flights") { setIsFlight(true); } }}>{item.title}</a>
                    ))}
                </div>
                <div className="col-span-4 mt-8 md:col-span-1">
                    <h3 className="font-bold text-[14px]">Contact Us</h3>
                    {contactUs.map((item, index) => (
                        <a href={item.link} key={index}
                              className="text-neutral-500 mt-4 block text-[14px]">{item.title}</a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Footer;