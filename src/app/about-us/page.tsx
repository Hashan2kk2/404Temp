"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AboutHeroImg from "@/assets/img/about/about-hero-right.png";
import SimpleCard from "@/elements/SimpleCard";
import Testimonials from "@/components/Testimonials";
import NewsLetter from "@/components/NewsLetter";
import AmilaDulanImg from "@/assets/img/team/Amila Dulan.jpeg";
import { useState } from "react";

const Page = () => {

    const founders = [
        {
            name: "Dumindu Karunarathne",
            role: "Founder/Director",
            img: "https://lusterblue.lk/wp-content/uploads/2019/12/male-placeholder-image.jpeg",
        },
        {
            name: "Amila Dulan",
            role: "Co Founder / Director",
            img: AmilaDulanImg.src,
        },
        {
            name: "Bhadrani Jayasooriya",
            role: "Co Founder / Director",
            img: "https://lusterblue.lk/wp-content/uploads/2019/12/male-placeholder-image.jpeg",
        },
    ];

    const [isFlight, setIsFlight] = useState(false);

    return (
        <>
            <Navigation/>
            <div className="w-full max-w-[1300px] mx-auto px-4 xl:px-0 mt-28">
                <div className="relative grid items-center grid-cols-1 text-center lg:text-start lg:grid-cols-5">
                    <div
                        className="w-[320px] bg-red-300 aspect-square absolute top-1/3 left-0 rounded-full blur-[100px] -z-10 opacity-40"></div>
                    <div
                        className="w-[320px] bg-green-600 aspect-square absolute top-1/3 left-1/3 rounded-full blur-[100px] -z-10 opacity-10"></div>

                    <div className="w-full col-span-2 xl:pe-8">
                        <h2 className="text-3xl xl:text-5xl">👋 About Us.</h2>
                        <span className="block mt-10 text-lg text-neutral-500">404 Travels, established in 2024, is your expert partner in creating unforgettable travel experiences. We offer personalized tours, flight bookings, visa assistance, long-term accommodations for remote workers, and Ayurvedic wellness packages. Our mission is to provide exceptional service and memorable journeys tailored to your needs. Let us help you explore the world with ease and enjoyment.</span>
                    </div>

                    <img aria-label="image" src={AboutHeroImg.src} className="w-full col-span-3 mt-10 lg:mt-0" alt="about"/>
                </div>

                <div className="w-full mt-28">
                    <div className="w-full col-span-2 xl:pe-8">
                        <h2 className="text-3xl xl:text-4xl">⛱ Founder</h2>
                        <span className="mt-10 block text-neutral-500 text-lg max-w-[700px]">At 404 Travels, we create unique travel experiences, tailored to our clients’ needs, every day.</span>

                        <div className="grid grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-4 gap-y-6 lg:gap-y-0">
                            {founders.map((founder, index) => (
                                <SimpleCard
                                    key={index}
                                    img={founder.img}
                                    title={founder.name}
                                    properties={founder.role}
                                    isTeam={true}
                                    className="aspect-video-vertical-portrait"
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            <Testimonials/>

            <div className="w-full max-w-[1300px] mx-auto px-4 xl:px-0">
                <div className="w-full mt-28">
                    <div className="w-full col-span-2 xl:pe-8">
                        <h2 className="text-3xl xl:text-4xl">🚀 Fast Facts</h2>
                        <span className="mt-10 block text-neutral-500 text-lg max-w-[700px]">
                        At 404 Travels, we are passionate about creating unforgettable travel experiences. Every day, we work to offer world-class travel packages, unique destinations, and personalized services for our customers.
                        </span>

                        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="p-6 bg-neutral-50 rounded-2xl">
                                <h3 className="text-3xl">1000+</h3>
                                <span className="block mt-2 text-neutral-400">Accommodations are linked with us</span>
                            </div>

                            <div className="p-6 bg-neutral-50 rounded-2xl">
                                <h3 className="text-3xl">50+</h3>
                                <span className="block mt-2 text-neutral-400">Formed a partnership with us</span>
                            </div>

                            <div className="p-6 bg-neutral-50 rounded-2xl">
                                <h3 className="text-3xl">90+</h3>
                                <span className="block mt-2 text-neutral-400">Destinations around the World</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <NewsLetter/>

            <Footer setIsFlight={setIsFlight}/>
        </>
    );
}

export default Page;