'use client';

import React, { useEffect, useState, useMemo } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navigation from '@/components/Navigation';
import Footer from "@/components/Footer";
import HeroSectionListing from "@/components/HeroSectionListing";
import NewsLetter from "@/components/NewsLetter";
import CustomizeTrip from "@/components/CustomizeTrip";
import TourCard from "@/components/TourCard";
import { Autocomplete, AutocompleteItem, Button, Slider, Popover, PopoverTrigger, PopoverContent, Input, Accordion, AccordionItem, Tabs, Tab } from "@nextui-org/react";
import Notiflix from "notiflix";
import { useRouter, useSearchParams } from "next/navigation";
import { BsChevronDown } from "react-icons/bs";
import PlusMinus from "@/elements/PlusMinus"; // Ensure you have this component

const ITEMS_PER_PAGE = 16;

interface Tour {
    id: number;
    title: string;
    tourType: string;
    noOfNight: number;
    host: string;
    language: string;
    inclusions_exclusions: {
        exclusions: string;
        inclusions: string;
    };
    description: {
        des: string;
        pax: string;
        specialNote: string;
        whatToBring: string;
        guestRequirement: string;
        cancellationPolicy: string;
    };
    price: number;
    insertedDate: string;
    review: number;
    location: string;
    tourCategoryId: number;
    name: string;
    nameShort: string;
    tourCategory: string;
    images: {
        id: number;
        name: string;
        tours_id: number;
    }[];
}

const Listing = () => {

    const getReqSearchParams = useSearchParams();
    const tourType = getReqSearchParams.get("tourType");
    const language = getReqSearchParams.get("language");
    const noOfNights = getReqSearchParams.get("noOfNights");

    const [tourData, setTourData] = useState<Tour[]>([]);
    const [filteredTourDataInbound, setFilteredTourDataInbound] = useState<Tour[]>([]);
    const [filteredTourDataOutbound, setFilteredTourDataOutbound] = useState<Tour[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [tourTypes, setTourTypes] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [sliderMaxPrice, setSliderMaxPrice] = useState(1000);

    const [form, setForm] = useState({
        location: "",
        tourType: "",
        language: "",
        reviewScore: 0,
        noOfNights: 0,
        minPrice: 0,
        maxPrice: 300,
    });

    const [currentPageInbound, setCurrentPageInbound] = useState(1);
    const [currentPageOutbound, setCurrentPageOutbound] = useState(1);

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
            setFilteredTourDataInbound(data.filter((tour: Tour) => tour.tourCategory === 'Inbound'));
            setFilteredTourDataOutbound(data.filter((tour: Tour) => tour.tourCategory === 'Outbound'));

            const maxPrice = Math.max(...data.map((tour: Tour) => tour.price));
            setForm((prevForm) => ({
                ...prevForm,
                maxPrice: maxPrice,
            }));
            setSliderMaxPrice(maxPrice);

            setTourTypes(Array.from(new Set(data.map((tour: Tour) => tour.tourType))));
            setLanguages(Array.from(new Set(data.map((tour: Tour) => tour.language))));
            setLocations(Array.from(new Set(data.map((tour: Tour) => tour.location))));
        } catch (e) {
            console.error("An error occurred while fetching data:", e);
        }
    };

    const setSearchParams = () => {
        if (tourType) {
            setForm((prevForm) => ({
                ...prevForm,
                tourType: tourType,
            }));
        }
        if (language) {
            setForm((prevForm) => ({
                ...prevForm,
                tourType: language,
            }));
        }
        if (noOfNights) {
            setForm((prevForm) => ({
                ...prevForm,
                tourType: noOfNights,
            }));
        }
    };

    const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        const filteredDataInbound = tourData.filter((tour) => {
            const matchesLocation = form.location ? tour.location === form.location : true;
            const matchesTourType = form.tourType ? tour.tourType === form.tourType : true;
            const matchesLanguage = form.language ? tour.language === form.language : true;
            const matchesReviewScore = form.reviewScore > 0 ? tour.review >= form.reviewScore : true;
            const matchesNoOfNights = form.noOfNights > 0 ? tour.noOfNight >= form.noOfNights : true;
            const matchesPrice = tour.price >= form.minPrice && tour.price <= form.maxPrice;
            const matchesTourCategory = tour.tourCategory === 'Inbound';

            return matchesLocation && matchesTourType && matchesLanguage && matchesTourCategory && matchesReviewScore && matchesNoOfNights && matchesPrice;
        });

        const filteredDataOutbound = tourData.filter((tour) => {
            const matchesLocation = form.location ? tour.location === form.location : true;
            const matchesTourType = form.tourType ? tour.tourType === form.tourType : true;
            const matchesLanguage = form.language ? tour.language === form.language : true;
            const matchesReviewScore = form.reviewScore > 0 ? tour.review >= form.reviewScore : true;
            const matchesNoOfNights = form.noOfNights > 0 ? tour.noOfNight >= form.noOfNights : true;
            const matchesPrice = tour.price >= form.minPrice && tour.price <= form.maxPrice;
            const matchesTourCategory = tour.tourCategory === 'Outbound';

            return matchesLocation && matchesTourType && matchesLanguage && matchesTourCategory && matchesReviewScore && matchesNoOfNights && matchesPrice;
        });

        setFilteredTourDataInbound(filteredDataInbound);
        setFilteredTourDataOutbound(filteredDataOutbound);
    };

    const handleClearForm = () => {
        setForm({
            location: "",
            tourType: "",
            language: "",
            reviewScore: 0,
            noOfNights: 0,
            minPrice: 0,
            maxPrice: sliderMaxPrice,
        });

        handleSearch();
    };

    const currentItemsInbound = useMemo(() => {
        const startIndex = (currentPageInbound - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredTourDataInbound.slice(startIndex, endIndex);
    }, [filteredTourDataInbound, currentPageInbound]);

    const currentItemsOutbound = useMemo(() => {
        const startIndex = (currentPageOutbound - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredTourDataOutbound.slice(startIndex, endIndex);
    }, [filteredTourDataOutbound, currentPageOutbound]);

    const handlePageChangeInbound = (page: number) => {
        setCurrentPageInbound(page);
    };

    const handlePageChangeOutbound = (page: number) => {
        setCurrentPageOutbound(page);
    };

    const router = useRouter();
    const handleSingleView = (id: any) => {
        router.push(`/tours/detail?id=${id}`);
    };

    const initialFetch = async () => {
        await fetchTourData();
        setSearchParams();
    };

    useEffect(() => {
        Notiflix.Loading.circle("Loading...");
        initialFetch().then(() => {
            Notiflix.Loading.remove();
        }).catch((e) => {
            console.error("An error occurred while fetching data:", e);
            Notiflix.Notify.failure("Failed to fetch data");
            Notiflix.Loading.remove();
        });
    }, []);

    useEffect(() => {
        handleSearch();
    }, [form]);

    useEffect(() => {
        setSearchParams();
    }, [tourType, language, noOfNights]);

    const [isFlight, setIsFlight] = useState(false);

    return (
        <div className='w-full mx-auto'>
            <div className={`w-full h-screen bg-white dark:bg-gray-900 fixed top-0 left-0 -z-20`}></div>
            <Navigation />

            <div className="w-full max-w-[1300px] mx-auto px-6 md:px-24 xl:px-0 overflow-clip md:overflow-visible">
                <HeroSectionListing page="tours" isFlight={isFlight} />

                <div className="px-4 mx-auto mt-20">
                    <div className="pg-title-container">
                        <div>
                            <h2 className="text-4xl font-semibold">Explore Our Latest Tour Packages</h2>
                        </div>
                        <div className='flex items-center pt-2'>
                            <span className="text-sm font-light text-neutral-400">{tourData.length} Tour Packages</span>
                        </div>
                    </div>
                </div>
                <Accordion className="px-4 mx-auto">
                    <AccordionItem key={1} title="Filters" aria-label="Filters" className="bg-neutral-50 px-4 rounded-lg mt-8">

                        <div className="mx-autop-4 gap-4 items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 bg-white p-4 rounded-lg mb-3">

                            <Autocomplete
                                label={false}
                                placeholder="Location"
                                variant="flat"
                                radius="full"
                                isClearable={true}
                                classNames={{ base: "rounded-full min-w-fit" }}
                                onInputChange={(e) => { handleFormChange({ target: { name: "location", value: e } }) }}
                                inputValue={form.location}
                            >
                                {locations.map((item: string) => (
                                    <AutocompleteItem key={item} value={item}>{item}</AutocompleteItem>
                                ))}
                            </Autocomplete>

                            <Autocomplete
                                label={false}
                                placeholder="Tour Type"
                                variant="flat"
                                radius="full"
                                isClearable={true}
                                classNames={{ base: "rounded-full min-w-fit" }}
                                onInputChange={(e) => { handleFormChange({ target: { name: "tourType", value: e } }) }}
                                inputValue={form.tourType}
                            >
                                {tourTypes.map((item: string) => (
                                    <AutocompleteItem key={item} value={item}>{item}</AutocompleteItem>
                                ))}
                            </Autocomplete>

                            <Autocomplete
                                label={false}
                                placeholder="Language"
                                variant="flat"
                                radius="full"
                                isClearable={true}
                                classNames={{ base: "rounded-full min-w-fit" }}
                                onInputChange={(e) => { handleFormChange({ target: { name: "language", value: e } }) }}
                                inputValue={form.language}
                            >
                                {languages.map((item: string) => (
                                    <AutocompleteItem key={item} value={item}>{item}</AutocompleteItem>
                                ))}
                            </Autocomplete>

                            <Popover placement="bottom">
                                <PopoverTrigger>
                                    <Button className="flex justify-between rounded-full bg-neutral-100">
                                        {form.noOfNights > 0 ? `Nights : ${form.noOfNights}` : "No of Nights"}&nbsp;
                                        <BsChevronDown />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="p-4">
                                        <PlusMinus
                                            getter={form.noOfNights}
                                            setter={(value: any) => {
                                                setForm({ ...form, noOfNights: value });
                                            }}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Popover placement="bottom">
                                <PopoverTrigger>
                                    <Button className="flex justify-between rounded-full bg-neutral-100">
                                        {form.reviewScore > 0 ? `Review : ${form.reviewScore}` : "Review Score"}&nbsp;
                                        <BsChevronDown />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="p-4">
                                        <PlusMinus
                                            getter={form.reviewScore}
                                            setter={(value: any) => {
                                                if (value <= 5) {
                                                    setForm({ ...form, reviewScore: value });
                                                }
                                            }}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <div className="grid items-center w-full grid-cols-2 gap-4 md:flex col-span-full">
                                <Input
                                    type="number"
                                    name="minPrice"
                                    label="Min Price"
                                    value={form.minPrice.toString()}
                                    onChange={handleFormChange}
                                    placeholder="Min Price"
                                    className="hidden rounded-full w-fit min-w-20 md:block"
                                />
                                <Slider
                                    label="Price Range"
                                    minValue={0}
                                    maxValue={sliderMaxPrice}
                                    step={1}
                                    value={[form.minPrice, form.maxPrice]}
                                    className='col-span-full'
                                    onChange={(value: number | number[]) => {
                                        if (Array.isArray(value)) {
                                            setForm({ ...form, minPrice: value[0], maxPrice: value[1] });
                                        }
                                    }}
                                />
                                <Input
                                    type="number"
                                    name="minPrice"
                                    label="Min Price"
                                    value={form.minPrice.toString()}
                                    onChange={handleFormChange}
                                    placeholder="Min Price"
                                    className="w-full rounded-full md:w-fit min-w-20 md:hidden"
                                />
                                <Input
                                    type="number"
                                    name="maxPrice"
                                    label="Max Price"
                                    value={form.maxPrice.toString()}
                                    onChange={handleFormChange}
                                    placeholder="Max Price"
                                    className="w-full rounded-full md:w-fit min-w-20"
                                />
                            </div>

                            <Button className="text-white duration-300 rounded-full bg-primary hover:bg-primary-900"
                                onClick={handleSearch}>Search</Button>
                            <Button className="bg-white border rounded-full cursor-pointer border-primary text-primary"
                                onClick={handleClearForm}>Clear All</Button>

                        </div>

                    </AccordionItem>
                </Accordion>


                <Tabs className='px-4 mt-8'>
                    <Tab key="Inbound" title="Inbound">
                        <div className="px-4 mx-auto">
                            <div className="pg-title-container">
                                <div>
                                    <h2 className="text-3xl font-semibold">Inbound Tours</h2>
                                </div>
                                <div className='flex items-center pt-2'>
                                    <span className="text-sm font-light text-neutral-400">{filteredTourDataInbound.length} Tour {filteredTourDataInbound.length > 1 ? 'Packages' : 'Package'}</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="grid grid-cols-1 gap-10 px-4 mx-auto mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 buttons-bar">
                            {currentItemsInbound.map((tour: any, index) => (
                                <TourCard key={index}
                                    coverImg={'..' + tour.images[0].name}
                                    title={tour.title} noOfNights={tour.noOfNight} price={tour.price} rating={tour.review}
                                    event={() => {
                                        handleSingleView(tour.id)
                                    }} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {Math.ceil(filteredTourDataInbound.length / ITEMS_PER_PAGE) > 1 && (
                            <div className="flex items-center justify-center gap-2 mx-auto mt-12">
                                {Array.from({ length: Math.ceil(filteredTourDataInbound.length / ITEMS_PER_PAGE) }, (_, index) => (
                                    <div
                                        key={index + 1}
                                        onClick={() => handlePageChangeInbound(index + 1)}
                                        className={`w-11 font-medium aspect-square rounded-full flex items-center justify-center cursor-pointer ${currentPageInbound === index + 1
                                            ? 'bg-primary text-white'
                                            : 'bg-white border border-neutral-300 text-neutral-400'
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Tab>
                    <Tab key="Outbound" title="Outbound">
                        <div className="px-4 mx-auto">
                            <div className="pg-title-container">
                                <div>
                                    <h2 className="text-3xl font-semibold">Outbound Tours</h2>
                                </div>
                                <div className='flex items-center pt-2'>
                                    <span className="text-sm font-light text-neutral-400">{filteredTourDataOutbound.length} Tour {filteredTourDataOutbound.length > 1 ? 'Packages' : 'Package'}</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="grid grid-cols-1 gap-10 px-4 mx-auto mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 buttons-bar">
                            {currentItemsOutbound.map((tour: any, index) => (
                                <TourCard key={index}
                                    coverImg={'..' + tour.images[0].name}
                                    title={tour.title} noOfNights={tour.noOfNight} price={tour.price} rating={tour.review}
                                    event={() => {
                                        handleSingleView(tour.id)
                                    }} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {Math.ceil(filteredTourDataOutbound.length / ITEMS_PER_PAGE) > 1 && (
                            <div className="flex items-center justify-center gap-2 mx-auto mt-12">
                                {Array.from({ length: Math.ceil(filteredTourDataOutbound.length / ITEMS_PER_PAGE) }, (_, index) => (
                                    <div
                                        key={index + 1}
                                        onClick={() => handlePageChangeOutbound(index + 1)}
                                        className={`w-11 font-medium aspect-square rounded-full flex items-center justify-center cursor-pointer ${currentPageOutbound === index + 1
                                            ? 'bg-primary text-white'
                                            : 'bg-white border border-neutral-300 text-neutral-400'
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Tab>
                </Tabs>

                <div className="w-full mx-auto">
                    <CustomizeTrip />
                </div>

                <NewsLetter />
                <Footer setIsFlight={setIsFlight} />
            </div>
        </div>
    )
}

export default Listing;