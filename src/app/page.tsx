"use client";
import React, {useEffect, useRef, useState} from "react";
import OurFeaturesImg from "../assets/img/home/our-features.png";
import HowItWorkImg1 from "../assets/img/home/HIW1.png";
import HowItWorkImg2 from "../assets/img/home/HIW2.png";
import HowItWorkImg3 from "../assets/img/home/HIW3.png";
import DashLineImg from "../assets/img/home/dashed line.svg";
import AboutUsImg from "../assets/img/home/BecomeAnAuthorImg.png";
import LogoDarkImg from "../assets/img/logo/logo.png";
import {BsChevronLeft, BsChevronRight,} from "react-icons/bs";
import SimpleCard from "@/elements/SimpleCard";
// @ts-ignore
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Label from "@/elements/Label";
import Navigation from "@/components/Navigation";
import {Spinner, useDisclosure} from "@nextui-org/react";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import PrimaryButton from "@/elements/PrimaryButton";
import ListingCard from "@/components/ListingCard";
import NewsLetter from "@/components/NewsLetter";
import HeroSectionListing from "@/components/HeroSectionListing";
import Notiflix from "notiflix";
import {useRouter} from "next/navigation";
import TourCard from "@/components/TourCard";
import CarListingCard from "@/components/CarListingCard";

export default function Home() {
    const [activeCountry, setActiveCountry] = useState("Sri Lanka");
    const [activeVideo, setActiveVideo] = useState({
        item: {
            title: "Nature Houses",
            thumbnail: "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg",
            videoUrl: "https://videos.pexels.com/video-files/856661/856661-hd_1920_1080_25fps.mp4"
        }
    });
    const {isOpen, onOpen, onClose} = useDisclosure();
    const sliderRef = useRef(null);
    const sliderRefSuggestions = useRef(null);
    const sliderRefStayTypes = useRef(null);

    const [destinations, setDestinations] = useState([
        {
            title: "Sri Lanka",
            img: "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 0
        },
        {
            title: "Malaysia",
            img: "https://images.pexels.com/photos/2097603/pexels-photo-2097603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 0,
        },
        {
            title: "Thailand",
            img: "https://images.pexels.com/photos/161183/thailand-monks-temple-tourism-161183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 0,
        },
        {
            title: "India",
            img: "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 0,
        },
        {
            title: "Singapore",
            img: "https://images.pexels.com/photos/2426546/pexels-photo-2426546.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 0,
        },
    ]);
    const nearby = [
        {
            title: "Sri Lanka",
            img: "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: "1,800",
            description: "19 minutes drive",
        },
        {
            title: "Malayasia",
            img: "https://images.pexels.com/photos/2097603/pexels-photo-2097603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: "2,500",
            description: "40 minutes drive",
        },
        {
            title: "Thailand",
            img: "https://images.pexels.com/photos/161183/thailand-monks-temple-tourism-161183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: "1,200",
            description: "10 minutes drive",
        },
        {
            title: "India",
            img: "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: "3,200",
            description: "39 minutes drive",
        },
        {
            title: "Singapore",
            img: "https://images.pexels.com/photos/2426546/pexels-photo-2426546.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: "1,200",
            description: "20 minutes drive",
        },
        {
            title: "Thailand",
            img: "https://images.pexels.com/photos/161183/thailand-monks-temple-tourism-161183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: "1,200",
            description: "10 minutes drive",
        },
        {
            title: "India",
            img: "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: "3,200",
            description: "39 minutes drive",
        },
        {
            title: "Singapore",
            img: "https://images.pexels.com/photos/2426546/pexels-photo-2426546.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: "1,200",
            description: "20 minutes drive",
        },
    ];
    const typesOfStays = [
        {
            title: "Nature Houses",
            img: "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 100,
        },
        {
            title: "Woodeen Houses",
            img: "https://images.pexels.com/photos/2097603/pexels-photo-2097603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 100,
        },
        {
            title: "House Boat",
            img: "https://images.pexels.com/photos/161183/thailand-monks-temple-tourism-161183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 100,
        },
        {
            title: "Farm Houses",
            img: "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 100,
        },
        {
            title: "Dome Houses",
            img: "https://images.pexels.com/photos/2426546/pexels-photo-2426546.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            properties: 100,
        },
    ];
    const videos = [
        {
            title: "Nature Houses",
            videoUrl: "https://videos.pexels.com/video-files/856661/856661-hd_1920_1080_25fps.mp4",
            thumbnail: "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg",
        },
        {
            title: "Woodeen Houses",
            videoUrl: "https://videos.pexels.com/video-files/3150402/3150402-uhd_2732_1440_25fps.mp4",
            thumbnail: "https://images.pexels.com/photos/2097603/pexels-photo-2097603.jpeg",
        },
        {
            title: "House Boat",
            videoUrl: "https://videos.pexels.com/video-files/4770380/4770380-hd_1920_1080_30fps.mp4",
            thumbnail: "https://images.pexels.com/photos/161183/thailand-monks-temple-tourism-161183.jpeg",
        },
        {
            title: "Farm Houses",
            videoUrl: "https://videos.pexels.com/video-files/4777966/4777966-uhd_2732_1440_24fps.mp4",
            thumbnail: "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg",
        },
    ];

    const desSlickSettings = {
        dots: false,
        autoplay: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: true,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 425,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            }
        ]
    };
    const suggestionsSlickSettings = {
        dots: false,
        autoplay: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: true,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 425,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const [cardData, setCardData] = useState([]);
    const [tourData, setTourData] = useState<any>([]);
    const [listingData, setListingData] = useState<any>([]);

    useEffect(() => {
        Notiflix.Loading.circle('Loading...');
        fetchTourData();
        fetchCarListingData();
        fetchCardData('all').then(() => {
            Notiflix.Loading.remove();
        });
    }, []);

    const router = useRouter();

    const handleClick = () => {
        router.push('/stay/listing');
    };

    const fetchCardData = async (all: string) => {
        try {
            const response = await fetch("/api/fetch-data/listing/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error("Failed to fetch card data");
            }

            const data = await response.json();
            setCardData(data);

            const updatedDestinations = destinations.map((destination) => {
                const matchingProperties = data.filter((item: any) => item.name === destination.title).length;
                return {
                    ...destination,
                    properties: matchingProperties
                };
            });
            setDestinations(updatedDestinations);

        } catch (error) {
            console.error(error);
        }
    }

    const fetchTourData = async () => {
        try {
            const res = await fetch("/api/fetch-data/tours/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch listing data");
            }

            const data = await res.json();
            setTourData(data);
        } catch (e) {
            console.error("An error occurred while fetching data:", e);
        }
    };

    const fetchCarListingData = async () => {
        try {
            const res = await fetch("/api/fetch-data/rental/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch listing data");
            }

            const data = await res.json();
            setListingData(data);
        } catch (e) {
            console.error("An error occurred while fetching data:", e);
        }
    };

    const [isFlight, setIsFlight] = useState(false);

    return (
        <div>
            <div className={`w-full h-screen bg-white dark:bg-gray-900 fixed top-0 left-0 -z-20`}></div>
            <Navigation/>
            <div className="w-full max-w-[1300px] mx-auto px-6 md:px-24 xl:px-0 overflow-clip md:overflow-visible">

                <HeroSectionListing page={"home"} isFlight={isFlight}/>

                <div className="w-full mt-28">
                    <h2 className="mb-4 text-3xl xl:text-4xl">Travel the word with 404 Travels</h2>
                    <span className="text-neutral-400">Unique travel experience in top destinations worldwide</span>

                    <div className="relative w-full mt-8">
                        <div
                            className="h-fit absolute top-1/3 translate-y-1/2 z-10 justify-between w-[calc(100%+1rem)] -left-[0.5rem]">
                            <div className="flex justify-between w-full">
                                {/*@ts-ignore*/}
                                <BsChevronLeft onClick={() => sliderRef.current.slickPrev()}
                                               className="inline p-2 text-3xl text-black bg-white rounded-full shadow-lg cursor-pointer"/>
                                {/*@ts-ignore*/}
                                <BsChevronRight onClick={() => sliderRef.current.slickNext()}
                                                className="inline p-2 text-3xl text-black bg-white rounded-full shadow-lg cursor-pointer"/>
                            </div>
                        </div>

                        <Slider ref={sliderRef} {...desSlickSettings}>
                            {destinations.map((item, index) => (
                                <SimpleCard
                                    key={index}
                                    img={item.img}
                                    title={item.title}
                                    properties={item.properties}
                                    className="aspect-video-vertical-portrait"
                                />
                            ))}
                        </Slider>

                    </div>
                </div>

                <div className="w-full mt-28">
                    <h2 className="mb-4 text-3xl xl:text-4xl">Featured Tours</h2>
                    <span className="text-neutral-400">Popular tours that 404 Travels recommends for you</span>

                    <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {tourData.slice(0, 4).map((item:any, index:any) => {
                            return (
                                <TourCard key={index}
                                coverImg={'..' + item.images[0].name}
                                title={item.title} noOfNights={item.noOfNight} price={item.price} rating={item.review}
                                event={() => {
                                    router.push(`/tours/detail?id=${item.id}`);
                                }} />
                            )
                        })}
                    </div>

                    <div className="flex justify-center mt-16">
                        <PrimaryButton content={
                            <div className="flex items-center gap-4">Show me more</div>
                        } className="text-sm" events={
                            () => {
                                router.push('/tours/listing');
                            }
                        }/>
                    </div>
                </div>

                <div className="w-full mt-28">
                    <h2 className="mb-4 text-3xl xl:text-4xl">Featured places to stay</h2>
                    <span className="text-neutral-400">Popular places to stay that 404 Travels recommends for you</span>

                    <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {cardData.slice(0, 8).map((item: any, index) => {
                            return (
                                <ListingCard
                                    key={index}
                                    className={'hidden'}
                                    discount={10}
                                    stockimg={item.coverImageRef}
                                    cardTitle={item.placeName}
                                    location={item.location}
                                    option1={item.bedrooms + " Bed Rooms"}
                                    option2={item.bathrooms + " Bath Rooms"}
                                    price={item.description.pricing.basePriceForWeekdays}
                                    rating={item.review}
                                    ratingcount={100}
                                    event={()=>{
                                        router.push(`/stay/detail?id=${item.id}`);
                                    }}
                                />
                            )
                        })}
                    </div>

                    <div className="flex justify-center mt-16">
                        <PrimaryButton content={
                            <div className="flex items-center gap-4">Show me more</div>
                        } className="text-sm" events={handleClick}/>
                    </div>
                </div>

                <div className="w-full mt-28">
                    <h2 className="mb-4 text-3xl xl:text-4xl">Featured Rentals</h2>
                    <span className="text-neutral-400">Popular rentals that 404 Travels recommends for you</span>

                    <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {listingData.map((item: any, index: number) => (
                        <CarListingCard
                            key={index}
                            cardTitle={item.model + " " + item.vehicleBrand}
                            cardSubTitle={item.transmissionType + ' Transmission'}
                            cardPrice={item.pricing.basePrice1}
                            cardImg={".." + item.images[0].ref}
                            adsBadge={false}
                            discountBadge={false}
                            discountPercent={""}
                            event={() => 
                                router.push(`/rental/detail?id=${item.id}`)
                            }
                            cardRating={item.review}
                        />
                    ))}
                    </div>

                    <div className="flex justify-center mt-16">
                        <PrimaryButton content={
                            <div className="flex items-center gap-4">Show me more</div>
                        } className="text-sm" events={
                            () => {
                                router.push('/rental/listing');
                            }
                        }/>
                    </div>
                </div>

                <div className="grid items-center w-full grid-cols-1 px-8 mt-28 lg:grid-cols-5 xl:px-0">
                    <img aria-label="image" src={OurFeaturesImg.src} alt=""
                         className="object-contain w-full col-span-3"/>

                    <div className="w-full col-span-2 lg:ps-14">
                        <span className="uppercase text-neutral-400">Bennifits</span>
                        <h2 className="text-3xl xl:text-4xl">Happening Destinations</h2>

                        <div className="w-full mt-8">
                            <Label text="Advertising" bgColor="bg-blue-100" textColor="text-blue-800"/>
                            <h3 className="mt-4 text-xl">Comprehensive Services</h3>
                            <p className="mt-4 text-neutral-500">From finding the perfect accommodation to booking
                                flights and securing visas, we’ve got you covered.</p>

                            <h3 className="mt-8 text-xl">Cost-Effective Solutions</h3>
                            <p className="mt-4 mb-8 text-neutral-500">Enjoy competitive pricing with no hidden fees. Get
                                the best deals for your travel needs without breaking the bank.</p>

                            <Label text="Exposure" bgColor="bg-green-100" textColor="text-green-800"/>
                            <h3 className="mt-4 text-xl">Reach a world of travelers</h3>
                            <p className="mt-4 mb-8 text-neutral-500">Millions of potential travelers are seeking
                                exceptional experiences. Let 404 Travels connect you with your next adventure.</p>

                            <Label text="Secure" bgColor="bg-red-100" textColor="text-red-800"/>
                            <h3 className="mt-4 text-xl">Secure and simple</h3>
                            <p className="mt-4 mb-8 text-neutral-500">Your travel planning, simplified with 404 Travels,
                                booking accommodations, tours, flights, and visas is secure and hassle-free. Enjoy peace
                                of mind with our straightforward, reliable service.</p>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[1200px] mx-auto mt-28 justify-center">
                    <h2 className="mb-4 text-3xl text-center xl:text-4xl">How it work</h2>
                    <span className="block text-center text-neutral-400">Plan your perfect trip with ease through 404 Travels</span>

                    <div className="relative grid grid-cols-1 gap-24 mt-8 md:grid-cols-3">
                        <img aria-label="image" src={DashLineImg.src} alt="dash line"
                             className="absolute left-0 hidden w-full top-8 -z-10 md:block"/>
                        <div className="text-center">
                            <img aria-label="image" src={HowItWorkImg1.src} alt="How it work 1"
                                 className="object-contain w-1/2 mx-auto aspect-square"/>
                            <h3 className="mt-4 text-xl">Explore & Book</h3>
                            <p className="mt-4 text-neutral-500">Choose from our wide range of flight options,
                                accommodation deals, and travel packages to your favorite destinations. Tailor your
                                journey just the way you want!</p>
                        </div>

                        <div className="text-center">
                            <img aria-label="image" src={HowItWorkImg2.src} alt="How it work 2"
                                 className="object-contain w-1/2 mx-auto aspect-square"/>
                            <h3 className="mt-4 text-xl">Personalized Travel Checklist</h3>
                            <p className="mt-4 text-neutral-500">Stay organized with our smart travel checklist. We help
                                you prepare for your trip by ensuring all your essentials are covered—flights, hotels,
                                transfers, and experiences.</p>
                        </div>

                        <div className="text-center">
                            <img aria-label="image" src={HowItWorkImg3.src} alt="How it work 3"
                                 className="object-contain w-1/2 mx-auto aspect-square"/>
                            <h3 className="mt-4 text-xl">Save More & Travel Smart</h3>
                            <p className="mt-4 text-neutral-500">Enjoy exclusive discounts and deals. Book with 404
                                Travels and take advantage of our competitive prices while you sit back and relax!</p>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-28 bg-[#fff7ed] dark:bg-[#0e131f] rounded-3xl p-5 xl:p-24 text-center">
                    <h2 className="mb-4 text-3xl xl:text-4xl">Suggestions for discovery</h2>
                    <span className="text-neutral-400">Popular places to stay that Chisfis recommends for you</span>

                    <div className="relative w-full mt-8">
                        <div
                            className="h-fit absolute top-1/3 translate-y-1/2 z-10 justify-between w-[calc(100%+1rem)] -left-[0.5rem]">
                            <div className="flex justify-between w-full">
                                {/*@ts-ignore*/}
                                <BsChevronLeft onClick={() => sliderRefSuggestions.current.slickPrev()}
                                               className="inline p-2 text-3xl text-black bg-white rounded-full shadow-lg cursor-pointer"/>
                                {/*@ts-ignore*/}
                                <BsChevronRight onClick={() => sliderRefSuggestions.current.slickNext()}
                                                className="inline p-2 text-3xl text-black bg-white rounded-full shadow-lg cursor-pointer"/>
                            </div>
                        </div>

                        <Slider ref={sliderRefSuggestions} {...suggestionsSlickSettings}>
                            {destinations.map((item, index) => (
                                <SimpleCard
                                    key={index}
                                    img={item.img}
                                    title={item.title}
                                    properties={item.properties}
                                    className="aspect-video-vertical-portrait"
                                />
                            ))}
                        </Slider>
                    </div>
                </div>

                {/*<div className="w-full text-center mt-28">*/}
                {/*    <h2 className="mb-4 text-3xl xl:text-4xl">Explore nearby</h2>*/}
                {/*    <span className="text-neutral-400">Discover great places near where you live</span>*/}

                {/*    <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">*/}
                {/*        {nearby.map((item, index) => (*/}
                {/*            <BasicCard key={index} img={item.img} properties={item.properties} title={item.title}*/}
                {/*                       description={item.description}/>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}

            </div>

            <div className="w-full px-6 xl:px-36 mt-28">
                <div
                    className="bg-[#F3F4F6] dark:bg-[#0e131f] rounded-[2rem] p-14 grid grid-cols-1 lg:grid-cols-2 items-center">
                    <div className="md:pe-20">
                        <img aria-label="image" src={LogoDarkImg.src} alt="404 Travels"
                             className="object-contain w-36"/>
                        <h2 className="mt-10 text-3xl xl:text-4xl">Why 404 Travels ?</h2>
                        <p className="mt-8 text-neutral-400">At 404 Travels, we offer personalized itineraries, expert
                            advice, and exclusive deals with 24/7 support. Our easy-to-use platform and commitment to
                            sustainability make your travel experience seamless and memorable. Choose us for a journey
                            tailored just for you.</p>
                        {/*@ts-ignore*/}
                        <PrimaryButton content={"About Us"} className="mt-10" events={
                            () => {
                                router.push('/about-us');
                            }
                        }/>
                    </div>
                    <img aria-label="image" src={AboutUsImg.src} alt="About us"
                         className="object-contain p-6 mt-8 lg:mt-0"/>
                </div>
            </div>

            <div className="w-full max-w-[1300px] mx-auto px-6 md:px-24 xl:px-0">
                <NewsLetter/>
            </div>

            {/*<div className="max-w-[1300px] mx-auto px-6 md:px-24 xl:px-0">*/}
            {/*    <div className="w-full mt-28">*/}
            {/*        <h2 className="mb-4 text-3xl xl:text-4xl">Explore by types of stays</h2>*/}
            {/*        <span className="text-neutral-400">Explore houses based on 10 types of stays</span>*/}

            {/*        <div className="relative w-full mt-8">*/}
            {/*            <div*/}
            {/*                className="h-fit absolute top-1/3 -translate-y-1/2 z-10 justify-between w-[calc(100%+1rem)] -left-[0.5rem]">*/}
            {/*                <div className="flex justify-between w-full">*/}
            {/*                    /!*@ts-ignore*!/*/}
            {/*                    <BsChevronLeft onClick={() => sliderRefStayTypes.current.slickPrev()}*/}
            {/*                                   className="inline p-2 text-3xl text-black bg-white rounded-full shadow-lg cursor-pointer"/>*/}
            {/*                    /!*@ts-ignore*!/*/}
            {/*                    <BsChevronRight onClick={() => sliderRefStayTypes.current.slickNext()}*/}
            {/*                                    className="inline p-2 text-3xl text-black bg-white rounded-full shadow-lg cursor-pointer"/>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <Slider ref={sliderRefStayTypes} {...desSlickSettings}>*/}
            {/*                {typesOfStays.map((item, index) => (*/}
            {/*                    <SimpleCard*/}
            {/*                        key={index}*/}
            {/*                        img={item.img}*/}
            {/*                        title={item.title}*/}
            {/*                        properties={item.properties}*/}
            {/*                        className="aspect-video-horizontal-landscape"*/}
            {/*                    />*/}
            {/*                ))}*/}
            {/*            </Slider>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className="w-full mt-28">*/}
            {/*        <h2 className="mb-4 text-3xl xl:text-4xl">The Videos</h2>*/}
            {/*        <span className="text-neutral-400 max-w-[600px] block">Check out our hottest videos. View more and share more new perspectives on just about any topic. Everyone’s welcome.</span>*/}

            {/*        <div*/}
            {/*            className={`grid grid-cols-12 grid-rows-4 gap-3 gap-y-4 md:gap-y-8 lg:gap-y-3 relative pt-6 pb-6 pe-6 md:pt-10 md:pb-10 md:pe-10 lg:pt-10 lg:pb-10 lg:pe-10 mt-8 lg:mt-0`}>*/}
            {/*            <div*/}
            {/*                className="bg-[#F2F5FF] dark:bg-[#161e2d] h-full w-2/3 lg:w-1/2 absolute right-0 top-0 -z-10 rounded-[2.2rem] md:rounded-[3rem] lg:rounded-[4rem]"></div>*/}

            {/*            <div*/}
            {/*                className={`col-span-12 lg:col-span-10 aspect-square md:aspect-video row-span-4 overflow-clip relative lg:pt-6 lg:pb-6 lg:pe-6`}>*/}
            {/*                <div*/}
            {/*                    className="overflow-clip w-full h-full rounded-3xl md:rounded-[2rem] lg:rounded-[3rem] bg-neutral-50 dark:bg-[#161e2d] border-[15px] border-white dark:border-[#161e2d]">*/}
            {/*                    <img aria-label="image" src={activeVideo.item.thumbnail} alt={activeVideo.item.title}*/}
            {/*                         className={`w-full h-full aspect-square object-cover transition duration-300 hover:scale-105 `}/>*/}
            {/*                </div>*/}

            {/*                <div onClick={() => onOpen()}*/}
            {/*                     className={`w-20 md:w-32 h-20 md:h-32 lg:h-52 lg:w-52 backdrop-blur-sm bg-[#FFFFFF90] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center before:-z-10 before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:w-10 md:before:w-16 lg:before:w-28 before:h-10 md:before:h-16 lg:before:h-28 before:bg-white  before:rounded-full`}>*/}
            {/*                    <BsFillCaretRightFill className={`text-primary text-2xl md:text-4xl lg:text-6xl`}/>*/}
            {/*                </div>*/}

            {/*                <Modal*/}
            {/*                    size="5xl"*/}
            {/*                    isOpen={isOpen}*/}
            {/*                    onClose={onClose}*/}
            {/*                >*/}
            {/*                    <ModalContent>*/}
            {/*                        {(onClose) => (*/}
            {/*                            <video className={`w-full h-full -z-10`} controls>*/}
            {/*                                <source src={activeVideo.item.videoUrl} type="video/mp4"/>*/}
            {/*                            </video>*/}
            {/*                        )}*/}
            {/*                    </ModalContent>*/}
            {/*                </Modal>*/}
            {/*            </div>*/}

            {/*            {videos.map((item, index) => (*/}
            {/*                <div onClick={() => setActiveVideo({item})} key={index}*/}
            {/*                     className={`col-span-3 lg:col-span-2 row-span-1 rounded-2xl overflow-clip relative`}>*/}
            {/*                    <div*/}
            {/*                        className={`md:h-12 z-10 w-8 h-8 md:w-12 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center`}>*/}
            {/*                        <BsFillCaretRightFill className={`text-primary text-lg md:text-2xl`}/>*/}
            {/*                    </div>*/}
            {/*                    <img aria-label="image" src={item.thumbnail} alt={item.title}*/}
            {/*                         className={`w-full h-full aspect-square md:aspect-video rounded-2xl object-cover transition duration-300 hover:scale-105 -z-10`}/>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <Testimonials/>
            <Footer setIsFlight={setIsFlight}/>
        </div>
    );
}
