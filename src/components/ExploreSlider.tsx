import {BsChevronLeft, BsChevronRight} from "react-icons/bs";
import Slider from "react-slick";
import SimpleCard from "@/elements/SimpleCard";
import React, {useRef} from "react";

export default function ExploreSlider() {
    const sliderRef = useRef(null);
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
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            }, {
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
    const propertyList = [
        {
            img: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
            properties: '12',
            title: 'Entire House',
        },
        {
            img: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
            properties: '12',
            title: 'Entire House',
        },
        {
            img: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
            properties: '12',
            title: 'Entire House',
        },
        {
            img: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
            properties: '12',
            title: 'Entire House',
        },
        {
            img: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
            properties: '12',
            title: 'Entire House',
        },
        {
            img: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
            properties: '12',
            title: 'Entire House',
        },
        {
            img: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
            properties: '12',
            title: 'Entire House',
        },
        {
            img: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg',
            properties: '12',
            title: 'Entire House',
        }
    ];
    return (
        <div
            className="max-w-[1300px] mx-auto bg-[#f3f4f6] dark:bg-[#0e131f] w-full mt-16 py-16 2xl:rounded-3xl 2xl:px-16">
            <h2 className="text-3xl xl:text-4xl mb-4 text-center px-2">Explore by types of stays</h2>
            <div className="mt-1 w-full flex justify-center px-4 text-center">
                <span className="text-neutral-400 w-fit">Explore houses based on 10 types of stays</span>
            </div>
            <div className="mt-8 w-full relative">
                <div className="w-full h-fit absolute top-1/3 left-0 z-10 justify-between">
                    <div className="w-full flex justify-between">
                        {/*@ts-ignore*/}
                        <BsChevronLeft onClick={() => sliderRef.current.slickPrev()}
                                       className="text-3xl text-black bg-white rounded-full p-2 inline cursor-pointer shadow-lg"/>
                        {/*@ts-ignore*/}
                        <BsChevronRight onClick={() => sliderRef.current.slickNext()}
                                        className="text-3xl text-black bg-white rounded-full p-2 inline cursor-pointer shadow-lg"/>
                    </div>
                </div>

                <Slider ref={sliderRef} {...desSlickSettings}>
                    {propertyList.map((item, index) => (
                        <SimpleCard
                            className='aspect-video-horizontal-landscape'
                            key={index}
                            img={item.img}
                            title={item.title}
                            properties={item.properties}
                        />
                    ))}
                </Slider>
            </div>
        </div>
    );
}