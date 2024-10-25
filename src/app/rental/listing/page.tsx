"use client";
import HeroSectionListing from '@/components/HeroSectionListing';
import Navigation from '@/components/Navigation';
import React, { useEffect, useState } from 'react';
import { LuDot } from 'react-icons/lu';
import CarListingCard from "@/components/CarListingCard";
import { Pagination, Autocomplete, AutocompleteItem, Button, Popover, PopoverTrigger, PopoverContent, Slider, Input, Accordion, AccordionItem } from "@nextui-org/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NewsLetter from "@/components/NewsLetter";
import Footer from "@/components/Footer";
import Notiflix from "notiflix";
import { useRouter, useSearchParams } from 'next/navigation';
import { BsChevronDown } from 'react-icons/bs';
import PlusMinus from "@/elements/PlusMinus";

const ITEMS_PER_PAGE = 16;

interface CarListing {
    pricing: any;
    country: string;
    propertyType: string;
    id: string;
    model: string;
    vehicleBrand: string;
    transmissionName: string;
    basePrice: number;
    image: string;
    fuelType: string;
    transmissionType: string;
    vehicleType: string;
    seatingCapacity: number;
    location: string;
    review: number;
}

const CarListingPage = () => {


    const getReqSearchParams = useSearchParams();
    const vehicleType = getReqSearchParams.get("vehicleType");
    const district = getReqSearchParams.get("district");
    const priceRange = getReqSearchParams.get("priceRange");

    const [listingData, setListingData] = useState<CarListing[]>([]);
    const [filteredData, setFilteredData] = useState<CarListing[]>([]);
    const [fuelTypes, setFuelTypes] = useState<string[]>([]);
    const [transmissionTypes, setTransmissionTypes] = useState<string[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
    const [vehicleBrands, setVehicleBrands] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [seatingCapacities, setSeatingCapacities] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sliderMaxPrice, setSliderMaxPrice] = useState(1000);

    const [form, setForm] = useState({
        fuelType: "",
        transmissionType: "",
        vehicleType: "",
        vehicleBrand: "",
        seatingCapacity: 0,
        location: "",
        reviewScore: 0,
        minPrice: 0,
        maxPrice: 300,
    });

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
            setFilteredData(data);
            console.log(data);

            const maxPrice = Math.max(...data.map((listing: CarListing) => listing.pricing.basePrice1));
            setForm((prevForm) => ({
                ...prevForm,
                maxPrice: maxPrice,
            }));
            setSliderMaxPrice(maxPrice);

            setFuelTypes(Array.from(new Set(data.map((listing: CarListing) => listing.fuelType))));
            setTransmissionTypes(Array.from(new Set(data.map((listing: CarListing) => listing.transmissionType))));
            setVehicleTypes(Array.from(new Set(data.map((listing: CarListing) => listing.vehicleType))));
            setVehicleBrands(Array.from(new Set(data.map((listing: CarListing) => listing.vehicleBrand))));
            setLocations(Array.from(new Set(data.map((listing: CarListing) => listing.location))));
            setSeatingCapacities(Array.from(new Set(data.map((listing: CarListing) => listing.seatingCapacity))));
        } catch (e) {
            console.error("An error occurred while fetching data:", e);
        }
    };

    const setSearchParams = () => {
        if (vehicleType) {
            setForm((prevForm) => ({
                ...prevForm,
                vehicleType: vehicleType,
            }));
        }

        if (district) {
            setForm((prevForm) => ({
                ...prevForm,
                location: district,
            }));
        }

        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split("-");
            const parsedMaxPrice = parseInt(maxPrice);
            setForm((prevForm) => ({
                ...prevForm,
                minPrice: parseInt(minPrice),
                maxPrice: parsedMaxPrice === 0 ? sliderMaxPrice : parsedMaxPrice,
            }));
        }

    }

    const initialFetch = async () => {
        try {
            await fetchCarListingData();
            setSearchParams();
        } catch (error) {
            console.error("Failed initial fetch:", error);
        }
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
    }, [vehicleType, district, priceRange]);


    const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        const filteredData = listingData.filter((listing) => {
            const matchesFuelType = form.fuelType ? listing.fuelType === form.fuelType : true;
            const matchesTransmissionType = form.transmissionType ? listing.transmissionType === form.transmissionType : true;
            const matchesVehicleType = form.vehicleType ? listing.vehicleType === form.vehicleType : true;
            const matchesVehicleBrand = form.vehicleBrand ? listing.vehicleBrand === form.vehicleBrand : true;
            const matchesSeatingCapacity = form.seatingCapacity ? listing.seatingCapacity >= form.seatingCapacity : true;
            const matchesLocation = form.location ? listing.location === form.location : true;
            const matchesReviewScore = form.reviewScore ? listing.review >= form.reviewScore : true;
            const matchesPrice = listing.basePrice >= form.minPrice && listing.basePrice <= form.maxPrice;

            return matchesFuelType && matchesTransmissionType && matchesVehicleType && matchesVehicleBrand && matchesSeatingCapacity && matchesLocation && matchesReviewScore && matchesPrice;
        });

        setFilteredData(filteredData);
    };

    const handleClearForm = async () => {
        setForm({
            fuelType: "",
            transmissionType: "",
            vehicleType: "",
            vehicleBrand: "",
            seatingCapacity: 0,
            location: "",
            reviewScore: 0,
            minPrice: 0,
            maxPrice: sliderMaxPrice,
        });

        setFilteredData(listingData);
    };

    const currentItems = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const router = useRouter();
    const handleSingleView = (id: any) => {
        router.push(`/rental/detail?id=${id}`);
    };

    const [isFlight, setIsFlight] = useState(false);

    return (
        <div>
            <div className={`w-full h-screen bg-white dark:bg-gray-900 fixed top-0 left-0 -z-20`}></div>
            <Navigation />
            <div className="w-full max-w-[1300px] mx-auto px-6 md:px-24 xl:px-0 overflow-clip md:overflow-visible">
                <HeroSectionListing page={"cars"} isFlight={isFlight}/>
                <div className="px-4 mx-auto mt-20">
                    <div className="pb-10 pg-title-container">
                        <div>
                            <h2 className="text-4xl font-semibold">Find your Vehicle</h2>
                        </div>
                        <div className='flex items-center pt-2'>
                            <span className="text-sm font-light text-neutral-400">Ride in Comfort, Choose the Perfect Vehicle for Your Journey!</span>
                        </div>
                    </div>
                </div>

                <Accordion className="px-4 mx-auto">

                    <AccordionItem key={1} title="Filters" aria-label="Filters" className="px-4 mt-8 rounded-lg bg-neutral-50">

                        <div className="grid items-center grid-cols-2 gap-4 p-4 mb-3 bg-white rounded-lg mx-autop-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                            <Autocomplete
                                label={false}
                                placeholder="Fuel Type"
                                variant="flat"
                                radius="full"
                                isClearable={true}
                                classNames={{ base: "rounded-full min-w-fit" }}
                                onInputChange={(e) => { handleFormChange({ target: { name: "fuelType", value: e } }) }}
                                inputValue={form.fuelType}
                            >
                                {fuelTypes.map((item: string) => (
                                    <AutocompleteItem key={item} value={item}>
                                        {item}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>

                            <Autocomplete
                                label={false}
                                placeholder="Transmission Type"
                                variant="flat"
                                radius="full"
                                isClearable={true}
                                classNames={{ base: "rounded-full min-w-fit" }}
                                onInputChange={(e) => { handleFormChange({ target: { name: "transmissionType", value: e } }) }}
                                inputValue={form.transmissionType}
                            >
                                {transmissionTypes.map((item: string) => (
                                    <AutocompleteItem key={item} value={item}>
                                        {item}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>

                            <Autocomplete
                                label={false}
                                placeholder="Vehicle Type"
                                variant="flat"
                                radius="full"
                                isClearable={true}
                                classNames={{ base: "rounded-full min-w-fit" }}
                                onInputChange={(e) => { handleFormChange({ target: { name: "vehicleType", value: e } }) }}
                                inputValue={form.vehicleType}
                            >
                                {vehicleTypes.map((item: string) => (
                                    <AutocompleteItem key={item} value={item}>
                                        {item}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>

                            <Autocomplete
                                label={false}
                                placeholder="Vehicle Brand"
                                variant="flat"
                                radius="full"
                                isClearable={true}
                                classNames={{ base: "rounded-full min-w-fit" }}
                                onInputChange={(e) => { handleFormChange({ target: { name: "vehicleBrand", value: e } }) }}
                                inputValue={form.vehicleBrand}
                            >
                                {vehicleBrands.map((item: string) => (
                                    <AutocompleteItem key={item} value={item}>
                                        {item}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>

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
                                    <AutocompleteItem key={item} value={item}>
                                        {item}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>

                            <Popover placement="bottom">
                                <PopoverTrigger>
                                    <Button className="rounded-full flex justify-between bg-neutral-100">
                                        Seating Capacity <BsChevronDown />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="p-4">
                                        <PlusMinus
                                            getter={form.seatingCapacity}
                                            setter={(value: any) => setForm({ ...form, seatingCapacity: value })}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Popover placement="bottom">
                                <PopoverTrigger>
                                    <Button className="rounded-full flex justify-between bg-neutral-100">
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

                            <div className="grid grid-cols-2 md:flex items-center gap-4 w-full col-span-full">
                                <Input
                                    type="number"
                                    name="minPrice"
                                    label="Min Price"
                                    value={form.minPrice.toString()}
                                    onChange={handleFormChange}
                                    placeholder="Min Price"
                                    className="w-fit min-w-20 rounded-full hidden md:block"
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

                            <Button className="rounded-full" onClick={handleSearch} color='primary'>Search</Button>
                            <Button className="rounded-full bg-white border border-primary" onClick={handleClearForm}>Clear All</Button>
                        </div>

                    </AccordionItem>
                </Accordion>

                <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 max-w-[1300px] gap-10 mx-auto buttons-bar">
                    {currentItems.map((item: any, index: number) => (
                        <CarListingCard
                            key={index}
                            cardTitle={item.model + " " + item.vehicleBrand}
                            cardSubTitle={item.transmissionType + ' Transmission'}
                            cardPrice={item.pricing.basePrice1}
                            cardImg={".." + item.images[0].ref}
                            adsBadge={false}
                            discountBadge={false}
                            discountPercent={""}
                            event={() => handleSingleView(item.id)}
                            cardRating={item.review}
                        />
                    ))}
                </div>

                <div className='grid mt-4 place-content-center'>
                    <Pagination total={Math.ceil(filteredData.length / ITEMS_PER_PAGE)} initialPage={1} size={"md"} radius={"full"} onChange={handlePageChange} />
                </div>
                <NewsLetter />
                <Footer setIsFlight={setIsFlight} />
            </div>
        </div>
    );
};

export default CarListingPage;