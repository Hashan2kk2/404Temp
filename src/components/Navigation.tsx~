'use client';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BsFillGrid1X2Fill, BsCashStack, BsChevronUp, BsFacebook, BsGlobe2, BsHeart, BsInstagram, BsJustify, BsList, BsPerson, BsPersonCircle, BsPower, BsSearch, BsToggles, BsTwitter, BsXLg, BsYoutube, BsHouse, BsCompass, BsCarFront } from "react-icons/bs";
import { Accordion, AccordionItem, Autocomplete, AutocompleteItem, Button, DateRangePicker, Input, Spinner, Tab, Tabs } from "@nextui-org/react";

import LogoBlack from "../assets/img/logo/logo.png";
import PlusMinus from '@/elements/PlusMinus';
import Notiflix, { Notify } from 'notiflix';

const Dropdown = ({ label, children }: { label: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex flex-col items-start justify-center w-full gap-y-3 overflow-clip">
            <button
                className="flex items-center justify-between w-full px-3 py-1 rounded-lg hover:bg-neutral-100"
                onClick={toggleDropdown}
            >
                {label} <span
                    className={`inline-block transform duration-300 origin-center ${isOpen ? 'rotate-0' : 'rotate-180'}`}><BsChevronUp /></span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="flex flex-col items-start justify-center w-full gap-y-3 ps-4"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Navigation = () => {

    const [userDetails, setUserDetails] = useState({
        email: '',
        name: '',
        role: '',
        profile: '',
        dashboard: '',
    });
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            if (response.ok) {
                setUserDetails(prevState => ({
                    ...prevState,
                    email: data.email,
                    name: (data.name) ? data.name : data.firstName,
                    role: data.role,
                    profile: (data.role === 'owner') ? '/owner/profile' : (data.role === 'admin') ? '/admin/profile' : '/profile',
                    dashboard: (data.role === 'owner') ? '/owner/add-property' : (data.role === 'admin') ? '/admin/dashboard' : '/'
                }));
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [desktopNavbarDropdown, setDesktopNavbarDropdown] = useState(Boolean)
    const [currencyLanguageDropdown, setCurrencyLanguageDropdown] = useState(Boolean)
    const [currencyLanguageDropdownChange, setCurrencyLanguageDropdownChange] = useState(true)
    const [notificationDropdown, setNotificationDropdown] = useState(Boolean)
    const [profileDropdown, setProfileDropdown] = useState(Boolean)

    const [navbarSlider, setNavbarSlider] = useState(Boolean)
    const [tabletSearchDropdown, setTabletSearchDropdown] = useState(Boolean)

    interface Guest {
        label: string;
        title: string;
        count: number;
        description: string;
        setter: (newCount: number) => void;
    }

    interface GuestCount {
        adult: Guest;
        child: Guest;
        infant: Guest;
    }

    const [guestCount, setGuestCount] = useState<GuestCount>({
        adult: {
            label: 'Adult',
            title: 'Adults',
            count: 1,
            description: 'Ages 13 or above',
            setter: (newCount: number) => updateGuestCount('adult', newCount),
        },
        child: {
            label: 'Child',
            title: 'Children',
            count: 0,
            description: 'Ages 2-12',
            setter: (newCount: number) => updateGuestCount('child', newCount),
        },
        infant: {
            label: 'Infant',
            title: 'Infants',
            count: 0,
            description: 'Under 2',
            setter: (newCount: number) => updateGuestCount('infant', newCount),
        },
    });

    const [form, setForm] = useState({
        stay: {
            location: '',
            checkIn: '',
            checkOut: '',
            guest: 1,
        },
        tours: {
            tourType: '',
            language: '',
            noOfNights: '',
        },
        car: {
            vehicleType: '',
            district: '',
            minPrice: 0,
            maxPrice: '',
        },
        flight: {
            flightClass: '',
            mobile: '',
            guest: 1,
            from: '',
            to: '',
            checkIn: '',
            checkOut: '',
        }
    });

    interface UpdateGuestCount {
        (type: keyof GuestCount, newCount: number): void;
    }

    const updateGuestCount: UpdateGuestCount = (type, newCount) => {
        setGuestCount((prevState) => ({
            ...prevState,
            [type]: {
                ...prevState[type],
                count: newCount,
            },
        }));
    };

    type FormType = 'stay' | 'tours' | 'car' | 'flight';

    const handleFormChange = (type: FormType, key: string, value: string | number) => {

        if (key === 'checkInOut') {
            const [checkIn, checkOut] = value.toString().split(' - ');
            setForm((prevState) => ({
                ...prevState,
                [type]: {
                    ...prevState[type],
                    checkIn,
                    checkOut,
                },
            }));
            return;
        }

        if (key === 'guest') {
            const guestCountTotal = guestCount.adult.count + guestCount.child.count + guestCount.infant.count;
            setForm((prevState) => ({
                ...prevState,
                flight: {
                    ...prevState.flight,
                    guest: guestCountTotal + 1,
                },
                stay: {
                    ...prevState.stay,
                    guest: guestCountTotal + 1,
                }
            }));
            return;
        }

        setForm((prevState) => ({
            ...prevState,
            [type]: {
                ...prevState[type],
                [key]: value,
            },
        }));
    }

    const handleFormSubmit = async (type: FormType) => {
        const formTypeData = form[type];
        const isFormFilled = Object.values(formTypeData).some(value => value !== '' && value !== 0);

        if (!isFormFilled) {
            Notify.info('Please fill at least one field');
            return;
        }

        Notiflix.Loading.circle('Loading...');

        if (type === 'flight') {
            if (form.flight.flightClass && form.flight.guest && form.flight.from && form.flight.to && form.flight.checkIn && form.flight.checkOut && form.flight.mobile) {

                const mobileNumber = form.flight.mobile;
                const mobileNumberRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
                if (!mobileNumberRegex.test(mobileNumber)) {
                    Notiflix.Loading.remove();
                    Notify.info('Please enter a valid mobile number');
                    return;
                }

                const flightFormData = form.flight;
                const response = await fetch('https://formsubmit.co/ajax/info@404travels.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        "Mail Type": "Flight Booking",
                        "Customer's Contact Number": flightFormData.mobile,
                        "Fly From": flightFormData.from,
                        "Fly To": flightFormData.to,
                        "PickUp and DropOff": `${flightFormData.checkIn} - ${flightFormData.checkOut}`,
                        "Flight Class Type": flightFormData.flightClass,
                        "Guests Count": flightFormData.guest,
                        _template: 'table',
                        _subject: 'Flight Booking Request',
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    Notiflix.Loading.remove();
                    Notify.success('Flight booking request sent successfully');
                } else {
                    Notify.failure(data.message);
                }
            } else {
                Notiflix.Loading.remove();
                Notify.info('Please fill all the fields');
                return;
            }
        } else {

            let redirectUrl = '';
            const queryParams: string[] = [];
            
            if (type === 'stay') {
                if (form.stay.location) queryParams.push(`location=${form.stay.location}`);
                if (form.stay.checkIn && form.stay.checkOut) queryParams.push(`dateRange=${form.stay.checkIn} - ${form.stay.checkOut}`);
                if (form.stay.guest) queryParams.push(`guests=${form.stay.guest}`);
            } else if (type === 'tours') {
                if (form.tours.tourType) queryParams.push(`tourType=${form.tours.tourType}`);
                if (form.tours.language) queryParams.push(`language=${form.tours.language}`);
                if (form.tours.noOfNights) queryParams.push(`noOfNights=${form.tours.noOfNights}`);
            } else if (type === 'car') {
                if (form.car.vehicleType) queryParams.push(`vehicleType=${form.car.vehicleType}`);
                if (form.car.district) queryParams.push(`district=${form.car.district}`);
                if (form.car.minPrice && form.car.maxPrice) queryParams.push(`priceRange=${form.car.minPrice} - ${form.car.maxPrice}`);
                if (form.car.minPrice && !form.car.maxPrice) queryParams.push(`priceRange=${form.car.minPrice} - 0`);
                if (!form.car.minPrice && form.car.maxPrice) queryParams.push(`priceRange=0 - ${form.car.maxPrice}`);
            }

            redirectUrl = `/${type}/listing?${queryParams.join('&')}`;
            window.location.href = redirectUrl;
        }

    }

    const navigation = [
        {
            title: 'Stay',
            items: [
                {
                    title: 'Stay',
                    link: '/stay/listing'
                },
            ]
        },
        {
            title: 'Tours',
            items: [
                {
                    title: 'Tours',
                    link: '/tours/listing'
                },
            ]
        },
        {
            title: 'Rental',
            items: [
                {
                    title: 'Rental',
                    link: '/rental/listing'
                },
            ]
        },
        {
            title: 'Other',
            items: [
                {
                    title: 'About',
                    link: '/about-us'
                },
                {
                    title: 'Contact us',
                    link: '/contact-us'
                },
            ]
        }
    ]

    const notification = [
        {
            title: 'Notification 1',
            description: 'Notification 1 description',
            date: 'Notification 1 date'
        },
        {
            title: 'Notification 2',
            description: 'Notification 2 description',
            date: 'Notification 2 date'
        },
        {
            title: 'Notification 3',
            description: 'Notification 3 description',
            date: 'Notification 3 date'
        }
    ]

    const [tourType, setTourType] = useState([]);
    const [language, setLanguage] = useState([]);
    const [vehicleType, setVehicleType] = useState([]);
    const [district, setDistrict] = useState([]);
    const [flightClass, setFlightClass] = useState([]);
    const [currency, setCurrency] = useState([]);

    useEffect(() => {
        initialFetch().then(r => r);
        fetchUser().then(r => r);
    }, []);

    const initialFetchList = [
        {
            setter: setTourType,
            tb: 'tour_type',
        }, {
            setter: setLanguage,
            tb: 'language',
        }, {
            setter: setVehicleType,
            tb: 'vehicle_type',
        }, {
            setter: setDistrict,
            tb: 'district',
        }, {
            setter: setFlightClass,
            tb: 'flight_class_type',
        }, {
            setter: setCurrency,
            tb: 'currency',
        }
    ]
    const initialFetch = async () => {
        try {
            initialFetchList.map(async (item) => {
                const response = await fetch('/api/fetch-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tb: item.tb }),
                });
                const data = await response.json();
                if (response.ok) {
                    item.setter(data);
                } else {
                    console.error(data);
                }

            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log(form);
    }, [form]);

    return (
        <>
            <div className={`w-full h-auto fixed top-0 left-0 z-50`}>

                {/*Desktop Navigation*/}
                <div
                    className={`w-full h-auto border-b dark:border-b-gray-700 hidden lg:block relative backdrop-blur-lg bg-white dark:bg-gray-900/90 bg-opacity-90`}>
                    <div className={`w-full h-auto min-h-20 max-w-[1300px] flex justify-between mx-auto px-6`}>
                        <div className={`flex items-center`}>
                            <a href="/" className={`text-lg font-bold`}>
                                <img aria-label="image" src={LogoBlack.src} alt="logo" className={`h-14 object-contain`} />
                            </a>
                        </div>
                        <div className={`flex items-center gap-x-5`}>
                            <div className={`hover:cursor-pointer`}
                                onClick={() => {
                                    setDesktopNavbarDropdown(!desktopNavbarDropdown);
                                    setCurrencyLanguageDropdown(false);
                                    setNotificationDropdown(false);
                                    setProfileDropdown(false);
                                }}>Menu
                                <span
                                    className={`inline-block translate-y-1/4 ms-2 transform duration-300 origin-center ${desktopNavbarDropdown ? 'rotate-0' : 'rotate-180'}`}><BsChevronUp /></span>
                            </div>
                            <div className={`relative flex items-center justify-center`}>
                                <button onClick={() => {
                                    setCurrencyLanguageDropdown(!currencyLanguageDropdown);
                                    setDesktopNavbarDropdown(false);
                                    setNotificationDropdown(false);
                                    setProfileDropdown(false);
                                }}>
                                    <span className={`inline-block`}><BsGlobe2 /></span>
                                    <span className={`inline-block text-2xl ms-2`}>/</span>
                                    <span className={`inline-block ms-2`}><BsCashStack /></span>
                                    <span
                                        className={`inline-block ms-2 transform duration-300 origin-center ${currencyLanguageDropdown ? 'rotate-0' : 'rotate-180'}`}><BsChevronUp /></span>
                                </button>
                                {/*Desktop Currency/Language Dropdown*/}
                                <div
                                    className={`w-[500px] h-auto absolute rounded-2xl overflow-clip top-14 right-0 ${currencyLanguageDropdown ? 'block' : 'hidden'} shadow-lg`}>
                                    <div
                                        className={`bg-white dark:bg-[#1f2937] w-full h-auto flex justify-between mx-auto p-10`}>
                                        <div className={`w-full flex flex-col gap-y-3`}>
                                            <div
                                                className={`w-full grid grid-cols-2 rounded-full dark:bg-[#334155] bg-neutral-100 p-1 mb-3`}>
                                                <button
                                                    onClick={() => {
                                                        setCurrencyLanguageDropdownChange(true)
                                                    }}
                                                    className={`text-center px-3 py-2 ${currencyLanguageDropdownChange ? 'bg-white text-black shadow' : 'bg-transparent text-black dark:text-white'} rounded-full`}>Language
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setCurrencyLanguageDropdownChange(false)
                                                    }}
                                                    className={`text-center px-3 py-2 ${!currencyLanguageDropdownChange ? 'bg-white text-black shadow' : 'bg-transparent text-black dark:text-white'} rounded-full`}>Currency
                                                </button>
                                            </div>
                                            <div
                                                className={`${currencyLanguageDropdownChange ? 'block' : 'hidden'} w-full grid grid-cols-2 gap-y-3 gap-x-1`}>
                                                {language.map((lang: any, index) => (
                                                    <button key={index}
                                                        className={`flex flex-col rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-[#374151] transition-colors duration-300`}>
                                                        <p>{lang.name}</p>
                                                        <small>{lang.nameShort}</small>
                                                    </button>
                                                ))}
                                            </div>
                                            <div
                                                className={`${!currencyLanguageDropdownChange ? 'block' : 'hidden'} w-full grid grid-cols-2 gap-y-3 gap-x-1`}>
                                                {currency.map((curr: any, index) => (
                                                    <button key={index}
                                                        className={`flex gap-x-2 items-center rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-[#374151] transition-colors duration-300`}>
                                                        <p>{curr.name}</p>
                                                        {/*<small>{curr.icon}</small>*/}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <Spinner size={'sm'} classNames={{
                                    circle2: 'text-primary',
                                }} />
                            ) : (
                                userDetails.role === 'owner' ? (
                                    <a href="/owner/add-property" className={`bg-transparent rounded-full border border-neutral-300 py-2 px-4 text-sm`}>List Your Property</a>
                                ) : userDetails.role === 'admin' ? (
                                    <a href="/admin/dashboard" className={`bg-transparent rounded-full border border-neutral-300 py-2 px-4 text-sm`}>Admin Dashboard</a>
                                ) : userDetails.role === 'user' ? (
                                    <a href="/profile" className={`bg-transparent rounded-full border border-neutral-300 py-2 px-4 text-sm`}>Profile</a>
                                ) : (
                                    <a href="/sign-in" className={`bg-transparent rounded-full border border-neutral-300 py-2 px-4 text-sm`}>Sign In</a>
                                )
                            )}
                            {/*Notification*/}
                            {/*<div className={`relative`}>*/}
                            {/*    <button onClick={() => {*/}
                            {/*        setNotificationDropdown(!notificationDropdown)*/}
                            {/*        setDesktopNavbarDropdown(false);*/}
                            {/*        setCurrencyLanguageDropdown(false);*/}
                            {/*        setProfileDropdown(false);*/}
                            {/*    }}><BsBell className={`text-xl mt-2`}/>*/}
                            {/*    </button>*/}
                            {/*    /!*Desktop Notification Dropdown*!/*/}
                            {/*    <div*/}
                            {/*        className={`w-[400px] h-auto absolute rounded-2xl overflow-clip top-14 right-0 ${notificationDropdown ? 'block' : 'hidden'} shadow-lg`}>*/}
                            {/*        <div*/}
                            {/*            className={`bg-white dark:bg-[#1f2937] w-full h-auto flex justify-between mx-auto rounded-2xl overflow-clip p-10`}>*/}
                            {/*            <div className={`w-full flex flex-col gap-y-3`}>*/}
                            {/*                <p className={`w-full text-2xl`}>Notifications</p>*/}

                            {/*                <div className={`w-full flex flex-col gap-y-3`}>*/}

                            {/*                    {notification.map((notif, index) => (*/}
                            {/*                        <div*/}
                            {/*                            key={index}*/}
                            {/*                            className={`flex gap-x-2 items-center rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-900 hover:cursor-pointer transition-colors duration-300 justify-start relative`}>*/}
                            {/*                            <div*/}
                            {/*                                className={`w-12 h-12 rounded-full relative overflow-clip me-3`}>*/}
                            {/*                                <img aria-label="image"  src="https://via.placeholder.com/150" alt="placeholder"*/}
                            {/*                                     className={`w-full h-full object-cover rounded-full`}/>*/}
                            {/*                            </div>*/}
                            {/*                            <div className={`flex flex-col`}>*/}
                            {/*                                <p className={`font-bold`}>{notif.title}</p>*/}
                            {/*                                <small>{notif.description}</small>*/}
                            {/*                                <small>{notif.date}</small>*/}
                            {/*                            </div>*/}
                            {/*                            <span*/}
                            {/*                                className={`w-2 h-2 bg-blue-500 rounded-full absolute top-1/2 right-2 -translate-y-1/2`}></span>*/}
                            {/*                        </div>*/}
                            {/*                    ))}*/}

                            {/*                </div>*/}

                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {loading ? (
                                <Spinner size={'sm'} classNames={{
                                    circle2: 'text-primary',
                                }} />
                            ) : (
                                userDetails.role !== '' ? (
                                    <div className={`relative text-sm`}>
                                        <button onClick={() => {
                                            setProfileDropdown(!profileDropdown)
                                            setDesktopNavbarDropdown(false);
                                            setCurrencyLanguageDropdown(false);
                                            setNotificationDropdown(false);
                                        }}><BsPersonCircle className="mt-2 text-2xl text-neutral-600" />
                                        </button>
                                        {/*Profile Dropdown*/}
                                        <div
                                            className={`w-[250px] h-auto absolute rounded-2xl overflow-clip top-14 right-0 ${profileDropdown ? 'block' : 'hidden'} shadow-lg`}>
                                            <div
                                                className={`bg-white dark:bg-[#1f2937]  w-full h-auto flex justify-between mx-auto rounded-2xl overflow-clip p-3`}>
                                                <div className={`w-full flex flex-col gap-y-3`}>
                                                    <div className={`w-full flex items-center justify-start mt-5`}>
                                                        <div className={`flex flex-col gap-y-1 ml-3`}>
                                                            <p>{userDetails?.name}</p>
                                                        </div>
                                                    </div>
                                                    <hr className={`w-full my-0.5`} />
                                                    <a href={userDetails.profile}
                                                        className={`flex gap-x-4 items-center justify-start rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-900 hover:cursor-pointer transition-colors duration-300`}>
                                                        <BsPerson className={`text-xl text-neutral-400`} />
                                                        Profile
                                                    </a>
                                                    {userDetails.role === 'owner' && (
                                                        <a href='/owner/my-listings' className={`flex gap-x-4 items-center justify-start rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-900 hover:cursor-pointer transition-colors duration-300`}>
                                                            <BsFillGrid1X2Fill className={`text-xl text-neutral-400`} />
                                                            My Listings
                                                        </a>
                                                    )}
                                                    <hr className={`w-full my-0.5`} />
                                                    <div className={`w-full gap-y-1 flex flex-col`}>
                                                        {/*<div*/}
                                                        {/*    className={`flex gap-x-4 items-center justify-start rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-900 hover:cursor-pointer transition-colors duration-300`}>*/}
                                                        {/*    <p className={`text-xl text-neutral-400`}><BsLightbulb/></p>*/}
                                                        {/*    <p>Dark Theme</p>*/}
                                                        {/*    /!*@ts-ignore*!/*/}
                                                        {/*    <ThemeSwitch screen={"large"}/>*/}
                                                        {/*</div>*/}
                                                        <a href="/api/logout?logout=true"
                                                            className={`flex gap-x-4 items-center justify-start rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-900 hover:cursor-pointer transition-colors duration-300`}>
                                                            <p className={`text-xl text-neutral-400`}><BsPower /></p>
                                                            <p>logout</p>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (<a href="/sign-up" className={`bg-transparent rounded-full border border-neutral-300 py-2 px-4 text-sm`}>Sign Up</a>)
                            )}
                        </div>
                    </div>
                </div>

                {/*Tablet Navigation*/}
                <div
                    className={`w-full h-auto border-b block lg:hidden backdrop-blur-lg bg-white dark:bg-primary-dark-color bg-opacity-75`}>
                    <div className={`w-full h-auto min-h-20 flex justify-center md:justify-between mx-auto px-6`}>
                        <div className={`items-center hidden md:flex`}>
                            <a href="/" className={`text-lg font-bold`}>
                                <img aria-label="image" src={LogoBlack.src} alt="logo" className={`w-20 object-contain`} />
                            </a>
                        </div>
                        <div className={`flex items-center w-full md:w-2/3`} onClick={() => {
                            setTabletSearchDropdown(!tabletSearchDropdown);
                        }}>
                            <div
                                className={`rounded-full p-1 h-auto border dark:border-gray-700 shadow-lg overflow-clip flex gap-x-1 justify-between w-full`}>
                                <span
                                    className={`rounded-full h-12 w-12 aspect-square flex items-center justify-center`}><BsSearch /></span>
                                <div className={`w-full max-w-96 h-auto flex flex-col`}>
                                    <p className={`font-bold`}>Where to ?</p>
                                    <small className='dark:text-gray-400'>Anyware . Anyweek . Add Guests</small>
                                </div>
                                <button
                                    className={`rounded-full h-12 w-12 min-h-12 min-w-12 aspect-square border dark:border-gray-700 flex items-center justify-center`}>
                                    <BsToggles className='text-gray-500' />
                                </button>
                            </div>
                        </div>
                        <div className={`items-center gap-x-4 hidden md:flex`}>
                            <div className={`relative`}>
                                {/* <button onClick={() => {
                                    setNotificationDropdown(!notificationDropdown)
                                    setDesktopNavbarDropdown(false);
                                    setCurrencyLanguageDropdown(false);
                                    setProfileDropdown(false);
                                }}><BsBell className={`text-xl mt-2`}/>
                                </button> */}
                                <div
                                    className={`w-[400px] h-auto absolute rounded-2xl overflow-clip top-14 right-0 ${notificationDropdown ? 'block' : 'hidden'} shadow-lg`}>
                                    <div
                                        className={`bg-white dark:bg-[#1f2937] w-full h-auto flex justify-between mx-auto rounded-2xl overflow-clip p-10`}>
                                        <div className={`w-full flex flex-col gap-y-3`}>
                                            <p className={`w-full font-bold text-2xl`}>Notifications</p>

                                            <div className={`w-full flex flex-col gap-y-3`}>

                                                {notification.map((notif, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex gap-x-2 items-center rounded-lg p-2 dark:hover:bg-[#374151] hover:bg-gray-200 hover:cursor-pointer transition-colors duration-300 justify-start relative`}>
                                                        <div
                                                            className={`w-12 h-12 rounded-full relative overflow-clip me-3`}>
                                                            <img aria-label="image" src="https://via.placeholder.com/150" alt="placeholder"
                                                                className={`w-full h-full object-cover rounded-full`} />
                                                        </div>
                                                        <div className={`flex flex-col`}>
                                                            <p className={`font-bold`}>{notif.title}</p>
                                                            <small>{notif.description}</small>
                                                            <small>{notif.date}</small>
                                                        </div>
                                                        <span
                                                            className={`w-2 h-2 bg-blue-500 rounded-full absolute top-1/2 right-2 -translate-y-1/2`}></span>
                                                    </div>
                                                ))}

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <Spinner size={'sm'} classNames={{
                                    circle2: 'text-primary',
                                }} />
                            ) : (
                                userDetails.role !== '' ? (
                                    <div className={`relative`}>
                                        <button onClick={() => {
                                            setProfileDropdown(!profileDropdown)
                                            setDesktopNavbarDropdown(false);
                                            setCurrencyLanguageDropdown(false);
                                            setNotificationDropdown(false);
                                        }}><BsPersonCircle className="mt-2 text-2xl text-neutral-400" />
                                        </button>
                                        {/*Profile Dropdown*/}
                                        <div
                                            className={`w-[250px] h-auto absolute rounded-2xl overflow-clip top-14 right-0 ${profileDropdown ? 'block' : 'hidden'} shadow-lg`}>
                                            <div
                                                className={`bg-white dark:bg-[#1f2937] w-full h-auto flex justify-between mx-auto rounded-2xl overflow-clip p-3`}>
                                                <div className={`w-full flex flex-col gap-y-3`}>
                                                    <div className={`w-full flex items-center justify-start mt-5`}>
                                                        <div className={`flex flex-col gap-y-1 ml-3`}>
                                                            <p><p>{userDetails?.name}</p></p>
                                                        </div>
                                                    </div>
                                                    <hr className={`w-full my-0.5`} />
                                                    <a href={userDetails.profile}
                                                        className={`flex gap-x-4 items-center justify-start rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-900 hover:cursor-pointer transition-colors duration-300`}>
                                                        <p className={`text-xl text-neutral-400`}><BsPerson /></p>
                                                        <p>Profile</p>
                                                    </a>
                                                    <hr className={`w-full my-0.5`} />
                                                    <div className={`w-full gap-y-1 flex flex-col`}>
                                                        {/*<div*/}
                                                        {/*    className={`flex gap-x-4 items-center justify-start rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-900 hover:cursor-pointer transition-colors duration-300`}>*/}
                                                        {/*    <p className={`text-xl text-neutral-400`}><BsLightbulb/></p>*/}
                                                        {/*    <p>Dark Theme</p>*/}
                                                        {/*    /!*@ts-ignore*!/*/}
                                                        {/*    <ThemeSwitch screen={"large"}/>*/}
                                                        {/*</div>*/}
                                                        <a href="/api/logout?logout=true"
                                                            className={`flex gap-x-4 items-center justify-start rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-900 hover:cursor-pointer transition-colors duration-300`}>
                                                            <p className={`text-xl text-neutral-400`}><BsPower /></p>
                                                            <p>logout</p>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <a href="/sign-up" className={`bg-transparent rounded-full border border-neutral-300 py-2 px-4 text-sm`}>Sign Up</a>
                                )
                            )}
                            <div className={`hover:cursor-pointer`} onClick={() => {
                                setNavbarSlider(!navbarSlider);
                                setNotificationDropdown(false);
                                setProfileDropdown(false);
                            }}>
                                <BsList className={`text-3xl text-neutral-500`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/*Mobile Navigation*/}
                <div
                    className={`w-full h-auto fixed bottom-0 left-0 flex justify-center dark:bg-[#1f2937] bg-white pt-4 pb-2 md:hidden`}>
                    <div className={`w-full max-w-[450px] flex justify-evenly`}>
                        <a href="/stay/listing"
                            className={`flex flex-col text-center items-center gap-y-0.5 text-gray-600 dark:text-gray-300`}>
                            <BsHouse className={`text-lg`} />
                            <small>Stay</small>
                        </a>
                        <a href="/tours/listing"
                            className={`flex flex-col text-center items-center gap-y-0.5 text-gray-600 dark:text-gray-300`}>
                            <BsCompass className={`text-lg`} />
                            <small>Tours</small>
                        </a>
                        <a href="/rental/listing"
                            className={`flex flex-col text-center items-center gap-y-0.5 text-gray-600 dark:text-gray-300`}>
                            <BsCarFront className={`text-lg`} />
                            <small>Rental</small>
                        </a>
                        <button
                            className={`flex flex-col text-center items-center gap-y-0.5 text-gray-600 dark:text-gray-300`}
                            onClick={() => {
                                setNavbarSlider(!navbarSlider);
                            }}>
                            <BsJustify className={`text-lg`} />
                            <small>Menu</small>
                        </button>
                    </div>
                </div>

                {/*Desktop Navigation Dropdown*/}
                <div
                    className={`w-full h-auto bg-white dark:bg-primary-dark-color py-16 shadow-lg ${desktopNavbarDropdown ? 'block' : 'hidden'}`}>
                    <div
                        className={`w-full h-auto min-h-20 max-w-[1300px] flex justify-between mx-auto`}>

                        {navigation.map((nav, index) => (
                            <div key={index} className={`flex flex-col justify-start items-start gap-y-3`}>
                                <p className={`font-bold`}>{nav.title}</p>
                                {nav.items.map((item, index) => (
                                    <a
                                        className={`text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-300 text-sm`}
                                        href={item.link} key={index}>{item.title}</a>
                                ))}
                            </div>
                        ))}

                        <div className={`w-full max-w-96 aspect-video rounded-2xl overflow-clip relative`}>
                            <img aria-label="image"
                                src="https://images.pexels.com/photos/1178784/pexels-photo-1178784.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="placeholder"
                                className={`w-full h-full object-cover absolute top-0 left-0`} />
                            <small className={`absolute top-5 left-5 dark:text-[#1f2937]`}>Collection</small>
                            <p className={`text-2xl font-bold absolute top-10 left-5 dark:text-[#1f2937]`}>The most
                                popular in the
                                world</p>
                            <button
                                className={`bg-white dark:bg-[#1f2937] absolute bottom-5 left-5 py-3 px-5 rounded-full text-sm`}>
                                Show More
                            </button>
                        </div>
                    </div>
                </div>

                {/*Mobile & Tablet Navigation Slider*/}
                <div
                    className={`w-full h-auto min-h-screen fixed top-0 right-0 backdrop-brightness-50  ${navbarSlider ? 'block' : 'hidden'}`}>
                    <div
                        className={`bg-white dark:bg-[#1f2937] w-full h-full min-h-screen max-w-[450px] flex flex-col ms-auto gap-y-3`}>
                        <div className={`w-full h-20 flex justify-between items-center px-5 relative`}>
                            <div className={`flex items-center`}>
                                <a href="/" className={`text-lg font-bold`}>
                                    <img aria-label="image" src={LogoBlack.src} alt="logo" className={`h-14 object-contain`} />
                                </a>
                            </div>
                            <div onClick={() => {
                                setNavbarSlider(false);
                            }}
                                className={`bg-gray-50 hover:cursor-pointer rounded-full h-8 w-8 aspect-square text-black flex items-center justify-center absolute top-2 right-2`}>
                                <BsXLg />
                            </div>
                        </div>
                        <p className={`px-5`}>Discover the most outstanding articles on all topics of life. Write your
                            stories and share
                            them</p>
                        <div className={`w-full flex justify-between items-center px-5`}>
                            <div className={`flex gap-x-3`}>
                                <div
                                    className={`h-10 w-10 aspect-square rounded-full bg-neutral-100 text-neutral-700 flex hover:bg-neutral-200 transition-colors duration-300 ease-in-out justify-center items-center`}>
                                    <span>
                                        <BsFacebook />
                                    </span>
                                </div>
                                <div
                                    className={`h-10 w-10 aspect-square rounded-full bg-neutral-100 text-neutral-700 flex hover:bg-neutral-200 transition-colors duration-300 ease-in-out justify-center items-center`}>
                                    <span>
                                        <BsTwitter />
                                    </span>
                                </div>
                                <div
                                    className={`h-10 w-10 aspect-square rounded-full bg-neutral-100 text-neutral-700 flex hover:bg-neutral-200 transition-colors duration-300 ease-in-out justify-center items-center`}>
                                    <span>
                                        <BsYoutube />
                                    </span>
                                </div>
                                <div
                                    className={`h-10 w-10 aspect-square rounded-full bg-neutral-100 text-neutral-700 flex hover:bg-neutral-200 transition-colors duration-300 ease-in-out justify-center items-center`}>
                                    <span>
                                        <BsInstagram />
                                    </span>
                                </div>
                            </div>
                            {/*<div*/}
                            {/*    className={`h-12 w-12 aspect-square rounded-full bg-neutral-100 text-neutral-700 flex hover:bg-neutral-200 transition-colors duration-300 ease-in-out justify-center items-center`}>*/}
                            {/*    <ThemeSwitch screen={"mobile"}/>*/}
                            {/*</div>*/}
                        </div>


                        <hr className={`w-full my-3`} />

                        <div className={`w-full h-auto flex flex-col gap-y-3 justify-center items-start px-5`}>
                            <div className="flex flex-col items-start justify-center w-full gap-y-3">
                                {navigation.map((nav, index) => (
                                    <Dropdown key={index} label={nav.title}>
                                        {nav.items.map((item, index) => (
                                            <a href={item.link} key={index}
                                                className="flex items-center justify-between w-full px-3 py-1 transition-colors duration-300 ease-in-out rounded-lg hover:bg-neutral-100">
                                                {item.title}
                                            </a>
                                        ))}
                                    </Dropdown>
                                ))}
                                <div className='w-full lg:hidden'>
                                    <Dropdown label='Profile'>
                                        <a href={userDetails.profile || '/sign-in'}
                                            className="flex items-center justify-between w-full px-3 py-1 transition-colors duration-300 ease-in-out rounded-lg hover:bg-neutral-100">
                                            {userDetails.role === 'owner' ? 'Profile' : userDetails.role === 'admin' ? 'Profile' : userDetails.role === 'user' ? 'Profile' : 'Sign In'}
                                        </a>
                                        {userDetails.role === 'owner' && (
                                            <>
                                                <a href='/owner/my-listings'
                                                    className="flex items-center justify-between w-full px-3 py-1 transition-colors duration-300 ease-in-out rounded-lg hover:bg-neutral-100">
                                                    My Listings
                                                </a>
                                                <a href='/owner/add-property'
                                                    className="flex items-center justify-between w-full px-3 py-1 transition-colors duration-300 ease-in-out rounded-lg hover:bg-neutral-100">
                                                    List Your Property
                                                </a>
                                            </>
                                        ) || userDetails.role === 'admin' && (
                                            <a href='/admin/dashboard'
                                                className="flex items-center justify-between w-full px-3 py-1 transition-colors duration-300 ease-in-out rounded-lg hover:bg-neutral-100">
                                                Admin Dashboard
                                            </a>
                                        )}
                                        <a href={userDetails.email ? '/api/logout?logout=true' : '/sign-up'}
                                            className="flex items-center justify-between w-full px-3 py-1 transition-colors duration-300 ease-in-out rounded-lg hover:bg-neutral-100">
                                            {userDetails.email ? 'Logout' : 'Sign Up'}
                                        </a>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <hr className={`w-full my-3`} />

                        <div className={`w-full flex justify-between items-center px-5`}>
                            <div className={`relative`}>
                                {/* <button onClick={() => {
                                    setCurrencyLanguageDropdown(!currencyLanguageDropdown);
                                    setDesktopNavbarDropdown(false);
                                    setNotificationDropdown(false);
                                    setProfileDropdown(false);
                                }}>
                                    <span className={`inline-block`}><BsGlobe2 /></span>
                                    <span className={`inline-block text-2xl ms-2`}>/</span>
                                    <span className={`inline-block ms-2`}><BsCashStack /></span>
                                    <span
                                        className={`inline-block ms-2 transform duration-300 origin-center ${currencyLanguageDropdown ? 'rotate-0' : 'rotate-180'}`}><BsChevronUp /></span>
                                </button> */}
                                {/*Desktop Currency/Language Dropdown*/}
                                <div
                                    className={`w-[300px] h-auto absolute rounded-2xl overflow-clip top-0 right-0 -translate-y-full ${currencyLanguageDropdown ? 'block' : 'hidden'} shadow-lg`}>
                                    <div
                                        className={`bg-white w-full h-auto flex justify-between mx-auto p-10`}>
                                        <div className={`w-full flex flex-col gap-y-3`}>
                                            <div
                                                className={`w-full grid grid-cols-2 rounded-full bg-neutral-100 p-1 mb-3`}>
                                                <button
                                                    onClick={() => {
                                                        setCurrencyLanguageDropdownChange(true)
                                                    }}
                                                    className={`text-center px-3 py-2 ${currencyLanguageDropdownChange ? 'bg-white text-black shadow' : 'bg-transparent text-black'} rounded-full`}>Language
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setCurrencyLanguageDropdownChange(false)
                                                    }}
                                                    className={`text-center px-3 py-2 ${!currencyLanguageDropdownChange ? 'bg-white text-black shadow' : 'bg-transparent text-black'} rounded-full`}>Currency
                                                </button>
                                            </div>
                                            <div
                                                className={`${currencyLanguageDropdownChange ? 'block' : 'hidden'} w-full grid grid-cols-1 gap-y-3 gap-x-1`}>
                                                {language.map((lang: any, index) => (
                                                    <button key={index}
                                                        className={`flex flex-col rounded-lg p-2 hover:bg-gray-400 transition-colors duration-300`}>
                                                        <p>{lang.name}</p>
                                                        <small>{lang.nameShort}</small>
                                                    </button>
                                                ))}
                                            </div>
                                            <div
                                                className={`${!currencyLanguageDropdownChange ? 'block' : 'hidden'} w-full grid grid-cols-1 gap-y-3 gap-x-1`}>
                                                {currency.map((curr: any, index) => (
                                                    <button key={index}
                                                        className={`flex gap-x-2 items-center rounded-lg p-2 hover:bg-gray-400 transition-colors duration-300`}>
                                                        <p>{curr.name}</p>
                                                        {/*<small>{curr.icon}</small>*/}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Tablet Search Dropdown*/}
                <div
                    className={`w-full h-full fixed top-0 left-0 dark:bg-primary-dark-color bg-neutral-100 p-3 px-5 ${tabletSearchDropdown ? 'block' : 'hidden'} `}>
                    <button className={`absolute top-2 left-2 rounded h-8 w-8 flex justify-center items-center`}
                        onClick={() => {
                            setTabletSearchDropdown(false);
                        }}>
                        <BsXLg />
                    </button>
                    <div className='w-full h-auto mt-10'>
                        <Tabs aria-label="Options" variant='underlined' classNames={{
                            base: 'w-full h-auto bg-white dark:bg-[#1f2937] dark:text-white rounded-2xl overflow-clip p-3',
                            tabList: "gap-6 w-full h-auto",
                        }}>
                            {/* Stay Tab */}
                            <Tab key="Stay" title="Stay">
                                <div className='w-full h-auto'>
                                    <Accordion variant="splitted" defaultSelectedKeys={'1'} itemClasses={{
                                        base: 'shadow-none w-full py-3'
                                    }}>
                                        <AccordionItem key="1" aria-label="Location" title="Location">
                                            <Input label={"Enter Location"} onChange={
                                                (e) => {
                                                    handleFormChange('stay', 'location', e.target.value);
                                                }
                                            } />
                                        </AccordionItem>
                                        <AccordionItem key="2" aria-label="When ?" title="When ?">
                                            <DateRangePicker onChange={(e) => {
                                                const startDate = new Date(e.start.year, e.start.month - 1, e.start.day);
                                                const endDate = new Date(e.end.year, e.end.month - 1, e.end.day);
                                                const dateRange = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()} - ${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;
                                                handleFormChange('stay', 'checkInOut', dateRange);
                                            }} />
                                        </AccordionItem>
                                        <AccordionItem key="3" aria-label='With whom ?' title='With whom ?'>
                                            <div className='flex flex-col w-full gap-y-4'>
                                                {Object.values(guestCount).map((item, index) => (
                                                    <div key={index}
                                                        className={`w-full flex justify-between items-center gap-x-10`}>
                                                        <div className={`flex flex-col`}>
                                                            <p className={`font-medium`}>{item.title}</p>
                                                            <small className={`text-neutral-500`}>{item.description}</small>
                                                        </div>
                                                        <div className={`flex items-center justify-center gap-x-5`}>
                                                            <PlusMinus getter={item.count} setter={item.setter} handler={() => { handleFormChange('stay', 'guest', '') }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionItem>
                                    </Accordion>

                                    <div className='grid w-full h-auto grid-cols-2 gap-4 px-2 mt-4'>
                                        <Button onClick={() => { setTabletSearchDropdown(false) }} color='primary' variant='flat'>
                                            Close
                                        </Button>
                                        <Button onClick={() => { handleFormSubmit('stay') }} color='primary'>
                                            Search
                                        </Button>
                                    </div>
                                </div>
                            </Tab>
                            {/* Tours Tab */}
                            <Tab key="Tours" title="Tours">
                                <div className='w-full h-auto'>
                                    <Accordion variant="splitted" defaultSelectedKeys={'1'} itemClasses={{
                                        base: 'shadow-none w-full py-3'
                                    }}>
                                        <AccordionItem key="1" aria-label="Tour Type" title="Tour Type">
                                            <Autocomplete
                                                placeholder="Tour Type"
                                                label={false}
                                                isClearable={true}
                                                onInputChange={(e) => {
                                                    handleFormChange('tours', 'tourType', e);
                                                }}>
                                                {tourType.map((item: { name: string }, index) => (
                                                    <AutocompleteItem key={index} value={item.name}>
                                                        {item.name}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                        </AccordionItem>
                                        <AccordionItem key="2" aria-label="Language" title="Language">
                                            <Autocomplete
                                                placeholder="Language"
                                                label={false}
                                                isClearable={true}
                                                onInputChange={(e) => {
                                                    handleFormChange('tours', 'language', e);
                                                }}>
                                                {language.map((item: { name: string }, index) => (
                                                    <AutocompleteItem key={index} value={item.name}>
                                                        {item.name}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                        </AccordionItem>
                                        <AccordionItem key="3" aria-label="No of Nights" title="No of Nights">
                                            <Input label={"No of Nights"} type='number' onChange={(e) => {
                                                handleFormChange('tours', 'noOfNights', e.target.value);
                                            }} />
                                        </AccordionItem>
                                    </Accordion>

                                    <div className='grid w-full h-auto grid-cols-2 gap-4 px-2 mt-4'>
                                        <Button onClick={() => { setTabletSearchDropdown(false) }} color='primary' variant='flat'>
                                            Close
                                        </Button>
                                        <Button onClick={() => { handleFormSubmit('tours') }} color='primary'>
                                            Search
                                        </Button>
                                    </div>
                                </div>
                            </Tab>
                            {/* Cars Tab */}
                            <Tab key="Cars" title="Cars">
                                <div className='w-full h-auto'>
                                    <Accordion variant="splitted" defaultSelectedKeys={'1'} itemClasses={{
                                        base: 'shadow-none w-full py-3'
                                    }}>
                                        <AccordionItem key="1" aria-label="Vehicle Type" title="Vehicle Type">
                                            <Autocomplete
                                                placeholder="Vehicle Type"
                                                label={false}
                                                isClearable={true}
                                                onInputChange={(e) => {
                                                    handleFormChange('car', 'vehicleType', e);
                                                }}>
                                                {vehicleType.map((item: { name: string }, index) => (
                                                    <AutocompleteItem key={index} value={item.name}>
                                                        {item.name}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                        </AccordionItem>
                                        <AccordionItem key="2" aria-label="District" title="District">
                                            <Autocomplete
                                                placeholder="District"
                                                label={false}
                                                isClearable={true}
                                                onInputChange={(e) => {
                                                    handleFormChange('car', 'district', e);
                                                }}>
                                                {district.map((item: { name: string }, index) => (
                                                    <AutocompleteItem key={index} value={item.name}>
                                                        {item.name}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                        </AccordionItem>
                                        <AccordionItem key="3" aria-label="Price Range" title="Price Range">
                                            <div className='flex flex-col w-full gap-y-4'>
                                                <Input label={"Minimum Price"} onChange={(e) => {
                                                    handleFormChange('car', 'minPrice', e.target.value);
                                                }} />
                                                <Input label={"Maximum Price"} onChange={(e) => {
                                                    handleFormChange('car', 'maxPrice', e.target.value);
                                                }} />
                                            </div>
                                        </AccordionItem>
                                    </Accordion>

                                    <div className='grid w-full h-auto grid-cols-2 gap-4 px-2 mt-4'>
                                        <Button onClick={() => { setTabletSearchDropdown(false) }} color='primary' variant='flat'>
                                            Close
                                        </Button>
                                        <Button color='primary' onClick={() => { handleFormSubmit('car') }}>
                                            Search
                                        </Button>
                                    </div>
                                </div>
                            </Tab>
                            {/* Flights Tab */}
                            <Tab key="Flights" title="Flights">
                                <div className='w-full h-auto'>
                                    <Accordion variant="splitted" defaultSelectedKeys={'1'} itemClasses={{
                                        base: 'shadow-none w-full py-3'
                                    }}>
                                        <AccordionItem key="1" aria-label="Flight Class" title="Flight Class">
                                            <Autocomplete
                                                placeholder="Flight Class"
                                                label={false}
                                                isClearable={true}
                                                onInputChange={(e) => {
                                                    handleFormChange('flight', 'flightClass', e);
                                                }}>
                                                {flightClass.map((item: { name: string }, index) => (
                                                    <AutocompleteItem key={index} value={item.name}>
                                                        {item.name}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                        </AccordionItem>
                                        <AccordionItem key="2" aria-label="Where From - To" title="From - To">
                                            <div className='flex flex-col w-full gap-y-4'>
                                                <Input label={"Enter Your Location"} onChange={(e) => {
                                                    handleFormChange('flight', 'from', e.target.value);
                                                }} />
                                                <Input label={"Enter Your Destination"} onChange={(e) => {
                                                    handleFormChange('flight', 'to', e.target.value);
                                                }} />
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem key="3" aria-label="When ?" title="When ?">
                                            <DateRangePicker onChange={(e) => {
                                                const startDate = new Date(e.start.year, e.start.month - 1, e.start.day);
                                                const endDate = new Date(e.end.year, e.end.month - 1, e.end.day);
                                                const dateRange = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()} - ${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;
                                                handleFormChange('flight', 'checkInOut', dateRange);
                                            }} />
                                        </AccordionItem>
                                        <AccordionItem key="4" aria-label='With whom ?' title='With whom ?'>
                                            <div className='flex flex-col w-full gap-y-4'>
                                                {Object.values(guestCount).map((item, index) => (
                                                    <div key={index}
                                                        className={`w-full flex justify-between items-center gap-x-10`}>
                                                        <div className={`flex flex-col`}>
                                                            <p className={`font-medium`}>{item.title}</p>
                                                            <small className={`text-neutral-500`}>{item.description}</small>
                                                        </div>
                                                        <div className={`flex items-center justify-center gap-x-5`}>
                                                            <PlusMinus getter={item.count} setter={item.setter} handler={() => { handleFormChange('flight', 'guest', '') }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem key="5" aria-label="Mobile Number" title="Mobile Number">
                                            <Input label={"Enter Your Mobile Number"} placeholder='+00 77 123 4567' onChange={(e) => {
                                                handleFormChange('flight', 'mobile', e.target.value);
                                            }} />
                                        </AccordionItem>
                                    </Accordion>

                                    <div className='grid w-full h-auto grid-cols-2 gap-4 px-2 mt-4'>
                                        <Button onClick={() => { setTabletSearchDropdown(false) }} color='primary' variant='flat'>
                                            Close
                                        </Button>
                                        <Button onClick={() => { handleFormSubmit('flight') }} color='primary'>
                                            Send Request
                                        </Button>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>

            </div>
            <div className={`w-full h-20`}></div>
        </>
    )
}

export default Navigation;