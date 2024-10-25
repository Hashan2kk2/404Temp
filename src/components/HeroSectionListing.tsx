"use client"
import {LiaMapMarkedSolid} from "react-icons/lia";
import {BsCalendar4, BsChevronDown, BsCurrencyDollar, BsFillCircleFill, BsFillSendFill, BsGeoAlt, BsHouseDoor, BsSearch, BsTelephone} from "react-icons/bs";
import HeroRightImg from "@/assets/img/home/hero-right.png";
import SEBasicFilter from "@/components/SEBasicFilter";
import HomeFilterInput from "@/elements/HomeFilterInput";
import DateRangePick from "@/elements/DateRangePick";
import PrimaryButton from "@/elements/PrimaryButton";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/dropdown";
import GuestsDropDown from "@/elements/GuestsDropDown";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {PiCarBold} from "react-icons/pi";
import {Popover, PopoverContent, PopoverTrigger, Slider} from "@nextui-org/react";
import Notiflix from "notiflix";
import {BiTrip} from "react-icons/bi";
import {IoCarSportOutline, IoCloudyNightOutline, IoLanguageSharp} from "react-icons/io5";
import {MdOutlineMyLocation} from "react-icons/md";
import InputWLabel from "@/elements/InputWLabel";
import { FaPhoneFlip } from "react-icons/fa6";

// @ts-ignore
function HeroSectionListing({page,isFlight}) {

    useEffect(() => {
        if (isFlight) {
            setActiveTab("Flights");
        }
    }, [isFlight]);

    const list = ["Stays", "Tours", "Rental", "Flights"];

    const [activeTab, setActiveTab] = useState("Stays");
    const [dateRangePickerCustom2, setDateRangePickerCustom2] = useState(false);
    const [vehiclePriceRange, setVehiclePriceRange] = useState('');

    // @ts-ignore
    const [selectedTourType, setSelectedTourType] = useState<Selection>(new Set(["Select Tour Type"]));
    // @ts-ignore
    const selectedTourValue = useMemo(() => Array.from(selectedTourType).join(", ").replaceAll("_", " "),
        [selectedTourType]
    );
    // @ts-ignore
    const [selectedLanguage, setSelectedLanguage] = useState<Selection>(new Set(["Select Language"]));
    // @ts-ignore
    const selectedLanguageValue = useMemo(() => Array.from(selectedLanguage).join(", ").replaceAll("_", " "),
        [selectedLanguage]
    );
    // @ts-ignore
    const [selectedVehicleType, setSelectedVehicleType] = useState<Selection>(new Set(["Select Vehicle Type"]));
    // @ts-ignore
    const selectedVehicleValue = useMemo(() => Array.from(selectedVehicleType).join(", ").replaceAll("_", " "),
        [selectedVehicleType]
    );
    // @ts-ignore
    const [selectedDistrict, setSelectedDistrict] = useState<Selection>(new Set(["Select District"]));
    // @ts-ignore
    const selectedDistrictValue = useMemo(() => Array.from(selectedDistrict).join(", ").replaceAll("_", " "),
        [selectedDistrict]
    );
    // @ts-ignore
    const [selectedFlightClass, setSelectedFlightClass] = useState<Selection>(new Set(["Select Flight Class"]));
    // @ts-ignore
    const selectedFlightClassValue = useMemo(() => Array.from(selectedFlightClass).join(", ").replaceAll("_", " "),
        [selectedFlightClass]
    );

    const [tourTypes, setTourTypes] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [flightClassTypes, setFlightClassTypes] = useState([]);

    const noOfNightsRef = useRef(null);

    useEffect(() => {
        fetchTourTypes().then(r => r);
        fetchLanguages().then(r => r);
        fetchVehicleTypes().then(r => r);
        fetchDistricts().then(r => r);
        fetchFlightClassTypes().then(r => r);
    }, []);

    const fetchTourTypes = async () => {
        const tb = 'tour_type';
        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tb: tb})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch-data fetch-data types');
            }
            const data = await response.json();
            setTourTypes(data);
        } catch (error: any) {
            console.error(error.message)
        }
    };
    const fetchLanguages = async () => {
        const tb = 'language';
        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tb: tb})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch-data languages');
            }
            const data = await response.json();
            setLanguages(data);
        } catch (error: any) {
            console.error(error.message)
        }
    };
    const fetchVehicleTypes = async () => {
        const tb = 'vehicle_type';
        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tb: tb})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch-data vehicle types');
            }
            const data = await response.json();
            setVehicleTypes(data);
        } catch (error: any) {
            console.error(error.message)
        }
    };
    const fetchDistricts = async () => {
        const tb = 'district';
        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tb: tb})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch-data districts');
            }
            const data = await response.json();
            setDistricts(data);
        } catch (error: any) {
            console.error(error.message)
        }
    };
    const fetchFlightClassTypes = async () => {
        const tb = 'flight_class_type';
        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tb: tb})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch-data flight class types');
            }
            const data = await response.json();
            setFlightClassTypes(data);
        } catch (error: any) {
            console.error(error.message)
        }
    };

    const [flightFormData, setFlightFormData] = useState({
        flyFrom: '',
        flyTo: '',
        guests: 0,
        pickUpDropOff: '',
        mobile: ''
    });

    const handleTourSubmit = () => {
        // @ts-ignore
        const noOfNight = noOfNightsRef.current.value;

        if (selectedTourValue === 'Select Tour Type' && selectedLanguageValue === 'Select Language' && noOfNight === '') {
            Notiflix.Notify.warning('Please select at least one filter');
        } else {
            const conditions = [];
            let baseUrl = "/tours/listing";

            if (selectedTourValue !== 'Select Tour Type') conditions.push(`tourType=${selectedTourValue}`);
            if (selectedLanguageValue !== 'Select Language') conditions.push(`language=${selectedLanguageValue}`);
            if (noOfNight !== '') conditions.push(`noOfNights=${noOfNight}`);

            if (conditions.length > 0) {
                baseUrl += `?${conditions.join("&")}`;
            }

            window.location.href = baseUrl;
        }

    }

    const handleRentalSubmit = () => {
        if (selectedVehicleValue === 'Select Vehicle Type' && selectedDistrictValue === 'Select District' && vehiclePriceRange === '') {
            Notiflix.Notify.warning('Please select at least one filter');
        } else {
            const conditions = [];
            let baseUrl = "/rental/listing";

            if (selectedVehicleValue !== 'Select Vehicle Type') conditions.push(`vehicleType=${selectedVehicleValue}`);
            if (selectedDistrictValue !== 'Select District') conditions.push(`district=${selectedDistrictValue}`);
            if (vehiclePriceRange !== '') conditions.push(`priceRange=${vehiclePriceRange}`);

            if (conditions.length > 0) {
                baseUrl += `?${conditions.join("&")}`;
            }
            window.location.href = baseUrl
        }
    }

    const handleFlightFieldsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFlightFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleFlightSubmit = async () => {
        Notiflix.Loading.circle('Submitting...');

        if(flightFormData.flyFrom === '' || flightFormData.flyTo === '' || flightFormData.pickUpDropOff === '' || selectedFlightClassValue === 'Select Flight Class' || flightFormData.guests === 0 || flightFormData.mobile === '') {
            Notiflix.Loading.remove();
            Notiflix.Notify.warning('Please fill all the fields');
        }else{
            const response = await fetch('https://formsubmit.co/ajax/vidhuraneethika000@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "Mail Type" : "Flight Booking",
                    "Customer's Contact Number": flightFormData.mobile,
                    "Fly From": flightFormData.flyFrom,
                    "Fly To": flightFormData.flyTo,
                    "PickUp and DropOff": flightFormData.pickUpDropOff,
                    "Flight Class Type": selectedFlightClassValue,
                    "Guests Count": flightFormData.guests,
                    _template: 'table',
                    _subject: 'Flight Booking',
                })
            });
            if (!response.ok) {
                Notiflix.Notify.failure('Failed to submit');
            }else{
                Notiflix.Notify.success('Submitted successfully');
            }
            Notiflix.Loading.remove();
        }

    }

    return (
        <div className="hero-section-listing">
            <div className="w-full max-w-[1300px] mx-auto md:px-0">

                <div className="relative grid grid-cols-1 px-4 mt-10 lg:overflow-visible lg:grid-cols-2">
                    <div
                        className="w-[320px] bg-red-300 dark:bg-red-500/40 aspect-square absolute top-1/3 left-0 rounded-full blur-[100px] -z-10 opacity-40"></div>
                    <div
                        className="w-[320px] bg-green-600 aspect-square absolute top-1/3 left-1/3 rounded-full blur-[100px] -z-10 opacity-10"></div>
                    {page === "stay" ? (
                        <div className="xl:mt-16 lg:pe-14">
                            <h1 className="text-3xl font-medium md:text-7xl">Stay Listing</h1>
                            <div className='flex gap-12 mt-4'>
                                <div className="flex items-center gap-2 mt-4 text-neutral-500 dark:text-neutral-200">
                                    <label className='text-xl'>Discover Your Perfect Stay with 404 Travels.Seamless Booking, Unforgettable Experiences.</label>
                                </div>
                            </div>
                        </div>) : page === "home" ? (
                        <div className="w-full xl:mt-16 lg:pe-14">
                            <h1 className="text-4xl xl:text-5xl">Travel reimagined, memories guaranteed</h1>

                            <p className="mt-10 dark:text-neutral-400">
                                Plan your dream getaway with our comprehensive travel services,
                                including top-notch stays, tours, rentals and flights.
                            </p>
                            {/*@ts-ignore*/}
                            <PrimaryButton content={"About 404 Travels"} className="mt-10" events={
                                () => {
                                    window.location.href = "/about-us"
                                }
                            }/>
                        </div>
                    ) : page === "cars" ? (
                        <div className="xl:mt-16 lg:pe-14">
                            <h1 className="text-3xl font-medium md:text-7xl">Rental Listing</h1>
                            <div className='flex gap-12 mt-4'>
                                <div className="flex items-center gap-2 mt-4 text-neutral-500 dark:text-neutral-200">
                                    <label className='text-xl'>Find Your Ideal Space with 404 Travels.Explore a World of Rental Options Tailored to You.</label>
                                </div>
                            </div>
                        </div>
                    ) : page === "tours" ? (
                        <div className="xl:mt-16 lg:pe-14">
                            <h1 className="text-3xl font-medium md:text-7xl">Tours Listing</h1>
                            <div className='flex gap-12 mt-4'>
                                <div className="flex items-center gap-2 mt-4 text-neutral-500 dark:text-neutral-200">
                                    <label className='text-xl'>Embark on Unforgettable Adventures with 404 Travels.Explore, Discover, and Experience the World Your Way.</label>
                                </div>
                            </div>
                        </div>
                    ): ('')
                    }
                    <div className="w-full mt-16 xl:mt-0">
                        <img aria-label="image" src={HeroRightImg.src} alt="hero-right"/>
                    </div>

                    <div className="absolute left-0 flex-col hidden w-full xl:w-11/12 bottom-6 lg:flex">
                        <div className="flex gap-14 ps-14">
                            {list.map((item, index) => (
                                <button className="text-neutral-500 dark:text-neutral-200" key={index}
                                        onClick={() => setActiveTab(item)}>
                                    <BsFillCircleFill
                                        className={`inline text-[10px] me-2 ${activeTab === item ? "block" : "hidden"}`}/>{item}
                                </button>
                            ))}
                        </div>

                        <div className={`w-full p-4 mt-6 dark:bg-[#1f2937] bg-white shadow-lg rounded-full`}>
                            <div className={`flex items-center ${activeTab === "Stays" ? "block" : "hidden"}`}>
                                <SEBasicFilter dateRangeLabelText="Check In-Check Out" type="Stays"/>
                            </div>

                            <div className={`flex items-center ${activeTab === "Tours" ? "block" : "hidden"}`}>

                                <div className="grid w-full grid-cols-3 gap-6">

                                    <div className="flex items-center col-span-1 gap-2 border-r">
                                        <BiTrip className="text-3xl text-neutral-300"/>
                                        <div className="flex flex-col w-full">
                                            <span className="block font-bold">Tour Type</span>
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <div
                                                        className="flex items-center justify-between gap-x-3 text-neutral-400 w-fit">
                                                        <span className="block">{selectedTourValue}</span>
                                                        <BsChevronDown className="text-neutral-400"/>
                                                    </div>
                                                </DropdownTrigger>

                                                <DropdownMenu aria-label="Tour Type" variant="flat"
                                                              disallowEmptySelection selectionMode="single"
                                                    // @ts-ignore
                                                              selectedKeys={selectedTourType}
                                                    // @ts-ignore
                                                              onSelectionChange={setSelectedTourType}>

                                                    {tourTypes.map((tourType: any) => (
                                                        // @ts-ignore
                                                        <DropdownItem key={tourType.name} eventKey={tourType.id}
                                                                      value={tourType.name}>
                                                            {tourType.name}
                                                        </DropdownItem>
                                                    ))}

                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    <div className="flex items-center col-span-1 gap-2 border-r">
                                        <IoLanguageSharp className="text-4xl text-neutral-300"/>
                                        <div className="flex flex-col w-full">
                                            <span className="block font-bold">Language</span>
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <div
                                                        className="flex items-center justify-between gap-x-3 text-neutral-400 w-fit">
                                                        <span className="block">{selectedLanguageValue}</span>
                                                        <BsChevronDown className="text-neutral-400"/>
                                                    </div>
                                                </DropdownTrigger>

                                                <DropdownMenu aria-label="Language" variant="flat"
                                                              disallowEmptySelection selectionMode="single"
                                                    // @ts-ignore
                                                              selectedKeys={selectedLanguage}
                                                    // @ts-ignore
                                                              onSelectionChange={setSelectedLanguage}>
                                                    {languages.map((language: any) => (
                                                        // @ts-ignore
                                                        <DropdownItem key={language.name} eventKey={language.id}
                                                                      value={language.name}>
                                                            {language.name}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    <div className="flex items-center col-span-1 gap-2">
                                        <IoCloudyNightOutline className="text-4xl text-neutral-300"/>
                                        <div>
                                            <span className="block font-bold">No of Nights</span>
                                            <input type="number" ref={noOfNightsRef} placeholder="Number Of Night"
                                                   className="border-0 text-neutral-400 ring-0 outline-0"/>
                                        </div>
                                    </div>

                                </div>

                                <PrimaryButton events={handleTourSubmit} content={<BsSearch className="text-xl -ms-2"/>}
                                               className="aspect-square w-14"/>

                            </div>

                            <div className={`flex items-center ${activeTab === "Rental" ? "block" : "hidden"}`}>
                                <div className="grid w-full grid-cols-3 gap-6">

                                    <div className="flex items-center col-span-1 gap-2 border-r">
                                        <IoCarSportOutline className="text-3xl text-neutral-300"/>
                                        <div className="flex flex-col w-full">
                                            <span className="block font-bold">Vehicle Type</span>
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <div
                                                        className="flex items-center justify-between gap-x-3 text-neutral-400 w-fit">
                                                        <span className="block">{selectedVehicleValue}</span>
                                                        <BsChevronDown className="text-neutral-400"/>
                                                    </div>
                                                </DropdownTrigger>

                                                <DropdownMenu aria-label="Vehicle Type" variant="flat"
                                                              disallowEmptySelection selectionMode="single"
                                                    // @ts-ignore
                                                              selectedKeys={selectedVehicleType}
                                                    // @ts-ignore
                                                              onSelectionChange={setSelectedVehicleType}>
                                                    {vehicleTypes.map((vehicleType: any) => (
                                                        // @ts-ignore
                                                        <DropdownItem key={vehicleType.name} eventKey={vehicleType.id}
                                                                      value={vehicleType.name}>
                                                            {vehicleType.name}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    <div className="flex items-center col-span-1 gap-2 border-r">
                                        <MdOutlineMyLocation className="text-4xl text-neutral-300"/>
                                        <div className="flex flex-col w-full">
                                            <span className="block font-bold">District</span>
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <div
                                                        className="flex items-center justify-between gap-x-3 text-neutral-400 w-fit">
                                                        <span className="block">{selectedDistrictValue}</span>
                                                        <BsChevronDown className="text-neutral-400"/>
                                                    </div>
                                                </DropdownTrigger>

                                                <DropdownMenu aria-label="District" variant="flat"
                                                              disallowEmptySelection selectionMode="single"
                                                    // @ts-ignore
                                                              selectedKeys={selectedDistrict}
                                                    // @ts-ignore
                                                              onSelectionChange={setSelectedDistrict}>
                                                    {districts.map((district: any) => (
                                                        // @ts-ignore
                                                        <DropdownItem key={district.name} eventKey={district.id}
                                                                      value={district.name}>
                                                            {district.name}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    <div className="flex items-center col-span-1 gap-2">
                                        <BsCurrencyDollar className="text-4xl text-neutral-300"/>
                                        <div>
                                            <span className="block font-bold">Price Range</span>
                                            <Popover placement="bottom" showArrow={true}>
                                                <PopoverTrigger>
                                                    <span className="text-neutral-400">$ {vehiclePriceRange}</span>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div className="p-4">
                                                        <Slider
                                                            label="Price Range"
                                                            step={50}
                                                            minValue={0}
                                                            maxValue={1000}
                                                            defaultValue={[100, 500]}
                                                            formatOptions={{style: "currency", currency: "USD"}}
                                                            className="max-w-md"
                                                            onChange={(value) => {
                                                                // @ts-ignore
                                                                setVehiclePriceRange(`${value[0]}-${value[1]}`)
                                                            }}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                </div>

                                <PrimaryButton events={handleRentalSubmit}
                                               content={<BsSearch className="text-xl -ms-2"/>}
                                               className="aspect-square w-14"/>
                            </div>

                            <div className={`px-8 ${activeTab === "Flights" ? "block" : "hidden"}`}>
                                <div className="flex w-full gap-3 p-6">
                                    <div className="flex gap-3 ps-3">
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <span
                                                    className="cursor-pointer flex items-center gap-4 justify-between bg-white dark:bg-transparent w-fit h-fit text-[12px]  rounded-full border border-neutral-300 py-1 px-4">
                                                    {selectedFlightClassValue} <BsChevronDown/>
                                                </span>
                                            </DropdownTrigger>

                                            <DropdownMenu aria-label="Flight Class" variant="flat"
                                                          disallowEmptySelection selectionMode="single"
                                                // @ts-ignore
                                                          selectedKeys={selectedFlightClass}
                                                // @ts-ignore
                                                          onSelectionChange={setSelectedFlightClass}>
                                                {flightClassTypes.map((flightClassType: any) => (
                                                    // @ts-ignore
                                                    <DropdownItem key={flightClassType.name} eventKey={flightClassType.id}
                                                                  value={flightClassType.name}>
                                                        {flightClassType.name}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </Dropdown>
                                        <GuestsDropDown arrowIcon={true} dropDownClassName="mt-2" name="guests" handler={handleFlightFieldsChange}
                                                        className="px-4 rounded-full border border-neutral-300 py-1 text-[12px]"/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="flex items-center justify-between px-4 mt-4">
                                    <div className="grid grid-cols-4 gap-6">
                                        <div className="flex items-center border-r">
                                            <BsTelephone className="text-6xl text-neutral-300"/>
                                            <HomeFilterInput className="ps-4" placeholder="Mobile Number" handler={handleFlightFieldsChange} value={flightFormData.mobile} name="mobile" label="Enter mobile number"/>
                                        </div>
                                        <div className="flex items-center border-r">
                                            <BsGeoAlt className="text-6xl text-neutral-300"/>
                                            <HomeFilterInput className="ps-4" placeholder="Fly Form" handler={handleFlightFieldsChange} value={flightFormData.flyFrom} name="flyFrom" label="Want to fly from?"/>
                                        </div>

                                        <div
                                            className="flex items-center border-r">
                                            <BsGeoAlt className="text-6xl text-neutral-300"/>
                                            <HomeFilterInput className="ps-4" placeholder="Fly to" handler={handleFlightFieldsChange} value={flightFormData.flyTo} name="flyTo" label="Want to fly to?"/>
                                        </div>

                                        <div
                                            className="flex items-center cursor-pointer"
                                            onClick={() => {
                                                setDateRangePickerCustom2(!dateRangePickerCustom2);
                                            }}>
                                            <BsCalendar4 className="text-3xl text-neutral-300"/>
                                            <DateRangePick dateRangeLabelText={"Inbound - Outbound"}
                                                           setDateRangePickerCustom={setDateRangePickerCustom2}
                                                           dateRangePickerCustom={dateRangePickerCustom2}
                                                              handler={handleFlightFieldsChange} name="pickUpDropOff"/>

                                        </div>
                                    </div>

                                    <PrimaryButton content={<BsFillSendFill className="text-xl -ms-2"/>} events={handleFlightSubmit}
                                                   className="aspect-square w-14"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSectionListing;