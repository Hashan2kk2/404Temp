"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientImg01 from "../assets/img/clients/clientSay1.png";
import ClientImg02 from "../assets/img/clients/clientSay2.png";
import ClientImg03 from "../assets/img/clients/clientSay3.png";
import ClientImg04 from "../assets/img/clients/clientSay4.png";
import ClientImg05 from "../assets/img/clients/clientSay5.png";
import ClientImg06 from "../assets/img/clients/clientSay6.png";
import ClientImgMain from "../assets/img/clients/clientSayMain.png";
import TestimonialsCard from "@/elements/TestimonialsCard";

const Testimonials = () => {
    const testimonials = [
        {
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hac habitasse platea dictumst. Integer vitae magna ac nisi ultricies fermentum. Nam auctor, nisl nec tincidunt.",
            clientName: "John Doe",
            location: "Colombo, Sri Lanka",
        },
        {
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hac habitasse platea dictumst. Integer vitae magna ac nisi ultricies fermentum. Nam auctor, nisl nec tincidunt.",
            clientName: "John Doe",
            location: "Colombo, Sri Lanka",
        },
        {
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hac habitasse platea dictumst. Integer vitae magna ac nisi ultricies fermentum. Nam auctor, nisl nec tincidunt.",
            clientName: "John Doe",
            location: "Colombo, Sri Lanka",
        },
        {
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hac habitasse platea dictumst. Integer vitae magna ac nisi ultricies fermentum. Nam auctor, nisl nec tincidunt.",
            clientName: "John Doe",
            location: "Colombo, Sri Lanka",
        },
    ];
    const testimonialsSlickSettings = {
        dots: true,
        autoplay: false,
        infinite: true,
        speed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: true,
        swipeToSlide: true,
    };

    return (
        <div className="w-full text-center px-6 xl:px-36 mt-28 mb-8">
            <div className="bg-[#F3F4F6] dark:bg-[#0e131f] rounded-3xl p-16 lg:pb-8">
                <h2 className="text-3xl xl:text-4xl mb-4">Good news from far away</h2>
                <span className="text-neutral-400">Let&apos;s see what people think of 404 Travels</span>

                <div className="mt-8 relative">

                    <div
                        className="hidden lg:flex my-8 mb-16 justify-between max-w-[800px] w-full mx-auto items-center">
                        <img aria-label="image"  src={ClientImg01.src} alt="client 01" className="w-16 h-16 rounded-full"/>
                        <img aria-label="image"  src={ClientImgMain.src} alt="client 02" className="w-24 aspect-square rounded-full"/>
                        <img aria-label="image"  src={ClientImg06.src} alt="client 03" className="w-16 h-16 rounded-full"/>
                    </div>

                    <Slider {...testimonialsSlickSettings}>
                        {testimonials.map((item, index) => (
                            <TestimonialsCard key={index} description={item.description}
                                              clientName={item.clientName} location={item.location}/>
                        ))}
                    </Slider>

                    <div className="hidden lg:flex my-8  justify-between max-w-[800px] w-full mx-auto items-center">
                        <img aria-label="image"  src={ClientImg02.src} alt="client 01" className="w-16 h-16 rounded-full"/>
                        <img aria-label="image"  src={ClientImg03.src} alt="client 03" className="w-16 h-16 rounded-full"/>
                    </div>

                    <div className="hidden lg:flex absolute top-1/3 left-0 w-full">
                        <div className="my-8 flex justify-between max-w-[1100px] w-full mx-auto items-center">
                            <img aria-label="image"  src={ClientImg04.src} alt="client 01" className="w-16 h-16 rounded-full"/>
                            <img aria-label="image"  src={ClientImg05.src} alt="client 03" className="w-16 h-16 rounded-full"/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Testimonials;