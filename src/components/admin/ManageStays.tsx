import React, { use, useEffect, useRef, useState } from "react";
import { Accordion, AccordionItem, Avatar, Button, Checkbox, Chip, Code, DatePicker, Divider, Input, Radio, RadioGroup, Tab, Tabs, } from "@nextui-org/react";
import SelectWLabel from "@/elements/SelectWLabel";
import InputWLabel from "@/elements/InputWLabel";
import PlusMinus from "@/elements/PlusMinus";
import { BsSearch, BsStarFill, BsX } from "react-icons/bs";
import ImageUpload from "@/elements/ImageUpload";
import Label from "@/elements/Label";
import PrimaryButton from "@/elements/PrimaryButton";
import SecondaryButton from "@/elements/SecondaryButton";
import Notiflix from "notiflix";
import TextAreaWLabel from "@/elements/TextAreaWLabel";
import StaysForm from "./StaysForm";

const ManageStays = ({ userDetails }: { userDetails?: any }) => {
    useEffect(() => {
        initialFetch();
        fetchProperties();
    }, []);

    const [propertyList, setPropertyList] = useState([]);
    const [propertyListFiltered, setPropertyListFiltered] = useState([]);
    const [guestCount, setGuestCount] = useState(0);
    const [bedroomCount, setBedroomCount] = useState(0);
    const [bedCount, setBedCount] = useState(0);
    const [bathroomCount, setBathroomCount] = useState(0);
    const [kitchenCount, setKitchenCount] = useState(0);
    const [minNights, setMinNights] = useState(0);
    const [maxNights, setMaxNights] = useState(0);
    const [selectedCoverImage, setSelectedCoverImage] = useState([]);
    const [selectedListingImages, setSelectedListingImages] = useState([]);
    const [sizeTypes, setSizeTypes] = useState([]);
    const [country, setCountry] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [clearTrigger, setClearTrigger] = useState(false);
    const [amenities, setAmenities] = useState({
        generalAmenities: [],
        otherAmenities: [],
        safetyAmenities: []
    });
    const [rulesForGuests, setRulesForGuests] = useState([]);
    const ruleTypes = ['Allow', 'Do Not Allow', 'Charge'];

    const initialDataList = [
        {
            tb: 'property_size_type',
            setter: setSizeTypes
        }, {
            tb: 'property_type',
            setter: setPropertyTypes
        }, {
            tb: 'country',
            setter: setCountry
        }, {
            tb: 'general_amenities',
            setter: (data: any) => {
                const generalAmenities = data.map((amenity: any) => ({ name: amenity.name }));
                setAmenities((prevState: any) => ({ ...prevState, generalAmenities }));
            }
        },
        {
            tb: 'other_amenities',
            setter: (data: any) => {
                const otherAmenities = data.map((amenity: any) => ({ name: amenity.name }));
                setAmenities((prevState: any) => ({ ...prevState, otherAmenities }));
            }
        },
        {
            tb: 'safety_amenities',
            setter: (data: any) => {
                const safetyAmenities = data.map((amenity: any) => ({ name: amenity.name }));
                setAmenities((prevState: any) => ({ ...prevState, safetyAmenities }));
            }
        }, {
            tb: 'property_rules',
            setter: (data: any) => {
                const propertyRules = data.map((rule: any) => ({
                    name: rule.name,
                    rules: ruleTypes.map(type => ({ name: type }))
                }));
                setRulesForGuests(propertyRules);
            }
        }
    ];

    const initialFetch = async () => {
        for (const data of initialDataList) {
            try {
                const response = await fetch('/api/fetch-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tb: data.tb })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const responseData = await response.json();
                data.setter(responseData);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const fetchProperties = async () => {
        try {
            const response = await fetch('/api/fetch-data/stays', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            setPropertyList(responseData);
            setPropertyListFiltered(responseData);
        } catch (error) {
            console.error(error);
        }
    }

    const [formData, setFormData] = useState({
        'placeName': '',
        'propertyType': '',
        'mobileNumber': '',
        'address': '',
        'size': '',
        'propertySizeType': '',
        'additionalRules': [],
        'description': {
            'amenities': {
                'general': [],
                'other': [],
                'safety': []
            },
            'rulesForGuests': [],
            'pricing': {
                'currency': '1',
                'basePriceForWeekdays': '',
                'basePriceForWeekends': '',
                'monthlyDiscount': ''
            },
        },
        'coverImageRef': [],
        'nightMin': 0,
        'nightMax': 0,
        'availabilitySchedule': [],
        'guests': 0,
        'bedrooms': 0,
        'beds': 0,
        'bathrooms': 0,
        'kitchen': 0,
        'propertyImages': [],
        "location": '',
        'propertyDescription': '',
        'mapUrl': '',
        'country': ''
    });


    const additionalRulesRef = useRef(null);

    const handleChange = (e: { target: { files: FileList | null; name: string; value: any } }) => {
        const { name, value, files } = e.target;

        if (files) {
            const fileArray = Array.from(files);

            if (name === 'coverImageRef') {
                // @ts-ignore
                setSelectedCoverImage(fileArray);
            } else if (name === 'propertyImages') {
                // @ts-ignore
                setSelectedListingImages(fileArray);
            }

            setFormData((prevState) => ({
                ...prevState,
                [name]: fileArray,
            }));
        } else {
            setFormData((prevState) => {
                const updatedState = { ...prevState };
                if (name.includes('description')) {

                    if (name.includes('description.amenities')) {

                        const amenityType = name.split('.')[2];
                        const amenityName = value;

                        setFormData((prevState) => {
                            const updatedState = { ...prevState };
                            // @ts-ignore
                            if (!updatedState.description.amenities[amenityType].includes(amenityName)) {
                                // @ts-ignore
                                updatedState.description.amenities[amenityType].push(amenityName);
                            } else {
                                // @ts-ignore
                                updatedState.description.amenities[amenityType] = updatedState.description.amenities[amenityType].filter((item: string) => item !== amenityName);
                            }
                            return updatedState;
                        });
                    } else if (name.includes('description.rulesForGuests')) {
                        const ruleName = value.name;
                        const ruleValue = value.value;

                        setFormData((prevState) => {
                            const updatedState = { ...prevState };
                            // @ts-ignore
                            const ruleIndex = updatedState.description.rulesForGuests.findIndex((rule: any) => rule.name === ruleName);

                            if (ruleIndex === -1) {
                                // @ts-ignore
                                updatedState.description.rulesForGuests.push({ name: ruleName, value: ruleValue });
                            } else {
                                // @ts-ignore
                                updatedState.description.rulesForGuests[ruleIndex].value = ruleValue;
                            }

                            return updatedState;
                        });
                    } else if (name.includes('description.pricing')) {
                        const pricingField = name.split('.')[2];
                        // @ts-ignore
                        updatedState.description.pricing[pricingField] = value;
                    }


                } else {
                    if (name.includes(".")) {
                        // Handle nested fields using dot notation
                        const keys = name.split(".");
                        let nestedObject: any = updatedState;

                        for (let i = 0; i < keys.length - 1; i++) {
                            if (!nestedObject[keys[i]]) {
                                nestedObject[keys[i]] = {}; // Create object if it does not exist
                            }
                            nestedObject = nestedObject[keys[i]];
                        }

                        const lastKey = keys[keys.length - 1];
                        if (Array.isArray(nestedObject[lastKey])) {
                            if (!nestedObject[lastKey].includes(value)) {
                                nestedObject[lastKey].push(value);
                            }
                        } else {
                            nestedObject[lastKey] = value;
                        }
                    } else {

                        // @ts-ignore
                        if (Array.isArray(updatedState[name])) {
                            // @ts-ignore
                            if (!updatedState[name].includes(value)) {
                                // @ts-ignore
                                updatedState[name].push(value);
                            }
                        } else {
                            if (name === 'mapUrl') {
                                const url = value;
                                let convertedUrl = '';

                                const iframeMatch = url.match(/<iframe[^>]+src="([^"]+)"[^>]*><\/iframe>/);
                                if (iframeMatch) {
                                    const src = iframeMatch[1];
                                    if (src.startsWith('https://www.google.com/maps/embed?')) {
                                        convertedUrl = src;
                                    }
                                } else if (url.startsWith('https://www.google.com/maps/embed?')) {
                                    convertedUrl = url;
                                }

                                updatedState.mapUrl = convertedUrl;
                            } else {
                                // @ts-ignore
                                updatedState[name] = value;
                            }
                        }
                    }
                }
                return updatedState;
            });
        }

        // Update other fields separately
        setFormData((prevState) => ({
            ...prevState,
            guests: guestCount,
            bedrooms: bedroomCount,
            beds: bedCount,
            bathrooms: bathroomCount,
            kitchen: kitchenCount,
            nightMin: minNights,
            nightMax: maxNights
        }));
    };

    const removeCoverImage = (index: number) => {
        const updatedImages = Array.isArray(selectedCoverImage)
            ? selectedCoverImage.filter((_, i) => i !== index)
            : [];

        setSelectedCoverImage(updatedImages);

        setFormData(prevFormData => ({
            ...prevFormData,
            image: updatedImages
        }));
    };

    const removeListingImages = (index: number) => {
        const updatedImages = Array.isArray(selectedListingImages)
            ? selectedListingImages.filter((_, i) => i !== index)
            : [];

        setSelectedListingImages(updatedImages);

        setFormData(prevFormData => ({
            ...prevFormData,
            image: updatedImages
        }));
    };

    const insertProperty = async () => {

        Notiflix.Loading.pulse('Your Request is processing...');

        if (formData.coverImageRef.length === 0 || formData.propertyImages.length === 0) {
            Notiflix.Loading.remove();
            Notiflix.Notify.failure('Please upload at least one cover image and one property image.');
            return;
        }

        if (formData.propertyType === '' || formData.placeName === '' || formData.mobileNumber === '' || formData.address === '' || formData.size === '' || formData.propertySizeType === '' ||  formData.description.pricing.basePriceForWeekdays === '' || formData.description.pricing.basePriceForWeekends === '' || formData.description.pricing.monthlyDiscount === '') {
            Notiflix.Loading.remove();
            Notiflix.Notify.failure('Please fill in all required fields.');
            return;
        }

        try {

            const formDataObject = new FormData();
            for (const key in formData) {
                if (key === 'coverImageRef' || key === 'propertyImages') {
                    formData[key].forEach((file: File) => {
                        formDataObject.append(key, file);
                    });
                } else if (key === 'description') {
                    formDataObject.append(key, JSON.stringify(formData[key]));
                } else {
                    // @ts-ignore
                    formDataObject.append(key, formData[key]);
                }
            }

            let url = 'insert';

            const response = await fetch('/api/add-listing/insert', {
                method: 'POST',
                body: formDataObject
            });

            if (!response.ok) {
                throw new Error('Failed to insert property data');
            }

            Notiflix.Loading.remove();

            const data = await response.json();

            if (data.message === "Success") {
                Notiflix.Notify.success("Property data inserted successfully.");
                fetchProperties();
                clearForm();
            } else {
                Notiflix.Notify.failure("Something went wrong.Please try again.");
            }


        } catch (error) {
            Notiflix.Notify.failure('Failed to insert property data');
        }
    }

    const clearForm = () => {
        setGuestCount(0);
        setBedroomCount(0);
        setBedCount(0);
        setBathroomCount(0);
        setKitchenCount(0);
        setMinNights(0);
        setMaxNights(0);

        setSelectedCoverImage([]);
        setSelectedListingImages([]);

        setClearTrigger(prev => !prev);

        setFormData({
            'placeName': '',
            'propertyType': '',
            'mobileNumber': '',
            'address': '',
            'size': '',
            'propertySizeType': '',
            'additionalRules': [],
            'description': {
                'amenities': {
                    'general': [],
                    'other': [],
                    'safety': []
                },
                'rulesForGuests': [],
                'pricing': {
                    'currency': '1',
                    'basePriceForWeekdays': '',
                    'basePriceForWeekends': '',
                    'monthlyDiscount': ''
                },
            },
            'coverImageRef': [],
            'nightMin': 0,
            'nightMax': 0,
            'availabilitySchedule': [],
            'guests': 0,
            'bedrooms': 0,
            'beds': 0,
            'bathrooms': 0,
            'kitchen': 0,
            'propertyImages': [],
            "location": '',
            "propertyDescription": "",
            "mapUrl": "",
            "country": ""
        });
    };

    const searchProperty = async (searchQuery: string) => {

        if (searchQuery === '') {
            setPropertyListFiltered(propertyList);
            return;
        }

        const filteredList = propertyList.filter((property: any) => {
            return (
                property.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.propertyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.ownerFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.ownerLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.availability.toLowerCase().includes(searchQuery.toLowerCase()) ||
                new Date(property.insertedDate).toLocaleString().includes(searchQuery.toLowerCase()) ||
                property.availability.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });

        setPropertyListFiltered(filteredList);
    }

    // @ts-ignore
    return (
        <div className="w-full h-full p-8 overflow-x-hidden overflow-y-auto custom-overflow">
            <h1>Manage Stays</h1>
            <hr className="my-4" />

            <div className="flex flex-col w-full">
                <Tabs aria-label="Options">
                    {/* Insert Tab */}
                    <Tab key="Insert" title="Insert">
                        <div className="grid lg:grid-cols-5 mt-4 gap-x-4 gap-y-6">

                            <SelectWLabel clearTrigger={clearTrigger}
                                label="Property Type"
                                options={propertyTypes}
                                handler={handleChange}
                                name="propertyType"
                                defaultSelectedItem={formData.propertyType}
                            />

                            <InputWLabel
                                label="Place Name"
                                inputType="text"
                                placeHolder="Enter Place Name"
                                value={formData.placeName}
                                handler={handleChange}
                                name="placeName"
                            />

                            <InputWLabel
                                label="Mobile Number"
                                inputType="text"
                                placeHolder="Enter Mobile Number"
                                value={formData.mobileNumber}
                                handler={handleChange}
                                name="mobileNumber"
                            />

                            <InputWLabel
                                label="Address"
                                inputType="text"
                                placeHolder="Enter Address"
                                value={formData.address}
                                handler={handleChange}
                                name="address"
                            />

                            <div className="flex gap-x-2">
                                <InputWLabel label="Size" inputType="number" placeHolder="0.00" value={formData.size}
                                    handler={handleChange} name="size" />
                                <SelectWLabel clearTrigger={clearTrigger} label="Size Type" options={sizeTypes}
                                    handler={handleChange} name="propertySizeType"
                                    defaultSelectedItem={formData.propertySizeType} />
                            </div>

                            <InputWLabel label={"Location"} inputType={"text"} placeHolder={"Enter Location"} value={formData.location} handler={handleChange} name={"location"} />

                            <div className="flex gap-x-2">
                                <SelectWLabel clearTrigger={clearTrigger} label="Country" options={country}
                                    handler={handleChange} name="country"
                                    defaultSelectedItem={formData.country} />
                            </div>

                            {[
                                { label: "Number of Guests", getter: guestCount, setter: setGuestCount },
                                { label: "Number of Bedrooms", getter: bedroomCount, setter: setBedroomCount },
                                { label: "Number of Beds", getter: bedCount, setter: setBedCount },
                                { label: "Number of Bathrooms", getter: bathroomCount, setter: setBathroomCount },
                                { label: "Number of Kitchens", getter: kitchenCount, setter: setKitchenCount }
                            ].map((item, index) => (
                                <div key={index} className={"mt-4"}>
                                    <div key={index} className="flex items-center justify-between">
                                        <Label text={item.label} textColor={''} bgColor={''} />
                                        <PlusMinus getter={item.getter} setter={item.setter} />
                                    </div>
                                </div>
                            ))}

                            <TextAreaWLabel label={"Description"} rows={4} placeHolder={"Please Enter Your Description."} name={'propertyDescription'} value={formData.propertyDescription} handler={handleChange} />

                            <TextAreaWLabel label={"Map URL"} rows={4} placeHolder={"Please Copy Map URl from the google map and Past it here"} name={'mapUrl'} value={formData.mapUrl} handler={handleChange} />

                            {formData.mapUrl && (
                                <iframe src={formData.mapUrl} className="col-span-full rounded-lg overflow-clip" width="100%" height="400" style={{ border: 0 }} allowFullScreen={true} loading="lazy"></iframe>
                            )}

                        </div>
                        <div className="grid grid-cols-6 mt-4 gap-x-4 gap-y-6">
                            <div className='mt-6 col-span-full'>
                                <h1>Amenities</h1>
                                <hr className='mt-4' />
                            </div>
                            <div className='flex flex-col gap-5 col-span-full md:col-span-2'>
                                <h2 className={`w-full`}>General Amenities</h2>
                                {amenities.generalAmenities.map((amenity: { name: string }) => (
                                    <Checkbox size={"sm"} key={amenity.name}
                                        onChange={
                                            (e) => {
                                                handleChange({
                                                    // @ts-ignore
                                                    target: {
                                                        name: 'description.amenities.general',
                                                        value: amenity.name
                                                    }
                                                })
                                            }
                                        }
                                        value={amenity.name}
                                        name={'description.amenities.general'}>{amenity.name}</Checkbox>
                                ))}
                            </div>
                            <div className='flex flex-col gap-5 col-span-full md:col-span-2'>
                                <h2 className={`w-full`}>Other Amenities</h2>
                                {amenities.otherAmenities.map((amenity: { name: string }) => (
                                    <Checkbox size={"sm"} key={amenity.name} onClick={(e) => {
                                        handleChange({
                                            // @ts-ignore
                                            target: {
                                                name: 'description.amenities.other',
                                                value: amenity.name
                                            }

                                        })
                                    }
                                    }>{amenity.name}</Checkbox>
                                ))}
                            </div>
                            <div className='flex flex-col gap-5 col-span-full md:col-span-2'>
                                <h2 className={`w-full`}>Safety Amenities</h2>
                                {amenities.safetyAmenities.map((amenity: { name: string }) => (
                                    <Checkbox size={"sm"} key={amenity.name} onClick={(e) => {
                                        handleChange({
                                            // @ts-ignore
                                            target: {
                                                name: 'description.amenities.safety',
                                                value: amenity.name
                                            }
                                        })
                                    }
                                    }>{amenity.name}</Checkbox>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-6">
                            <div className='mt-6 col-span-full'>
                                <h1>House Rules for your Guests</h1>
                                <hr className='mt-4' />
                            </div>
                            {(rulesForGuests as { name: string, rules: { name: string }[] }[]).map((rule, index) => (
                                // eslint-disable-next-line react/jsx-key
                                <div>
                                    <div key={index} >
                                        <RadioGroup
                                            size={"sm"}
                                            label={rule.name}
                                            defaultValue={rule.rules.find(r => r.name === 'Allow')?.name}
                                            onChange={(e) => {
                                                const selectedValue = e.target.value;
                                                // @ts-ignore
                                                handleChange({
                                                    // @ts-ignore
                                                    target: {
                                                        name: 'description.rulesForGuests',
                                                        // @ts-ignore
                                                        value: {
                                                            name: rule.name,
                                                            value: selectedValue
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            {rule.rules.map((r, i) => (
                                                <Radio key={i} value={r.name}>{r.name}</Radio>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-6">
                            <div className='mt-6 col-span-full'>
                                <h1>Additional Rules</h1>
                                <hr className='mt-4' />
                            </div>
                            <div className='flex gap-4 col-span-full lg:col-span-2'>
                                <input
                                    placeholder={"Enter Additional Rule"}
                                    ref={additionalRulesRef}
                                    name={'additionalRules'}
                                    onKeyUp={(e) => {
                                        // @ts-ignore
                                        if (e.key === 'Enter' && e.target.value !== '') {
                                            // @ts-ignore
                                            const rule = e.target.value;

                                            // Add the rule to the additionalRules array
                                            // @ts-ignore
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                additionalRules: [...prevState.additionalRules, rule],
                                            }));
                                            // @ts-ignore
                                            e.target.value = '';
                                        }
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-xl h-fit focus:outline-none"
                                />
                                <Button
                                    size={"md"}
                                    className='w-40'
                                    onClick={() => {
                                        // @ts-ignore
                                        const rule = additionalRulesRef.current?.value;

                                        if (rule) {
                                            // Add the rule to the additionalRules array
                                            // @ts-ignore
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                additionalRules: [...prevState.additionalRules, rule],
                                            }));

                                            // @ts-ignore
                                            additionalRulesRef.current.value = '';
                                        }
                                    }}
                                >
                                    Add Rule
                                </Button>
                            </div>
                            <div className='grid gap-4 col-span-full lg:col-span-3'>
                                {formData.additionalRules.map((rule, index) => (
                                    <Input
                                        key={index}
                                        variant={"bordered"}
                                        value={rule}
                                        endContent={
                                            <div
                                                className="w-4 text-white bg-red-600 rounded-full cursor-pointer aspect-square"
                                                onClick={() => {
                                                    const updatedRules = formData.additionalRules.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, additionalRules: updatedRules });
                                                }}
                                            >
                                                <BsX />
                                            </div>
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-6">
                            <div className='mt-6 col-span-full'>
                                <h1>Cover Image</h1>
                                <hr className='mt-4' />
                            </div>
                            <div className="col-span-full">

                                <ImageUpload handler={handleChange} name="coverImageRef"
                                    setSelectedImages={setSelectedCoverImage}
                                    selectedImages={selectedCoverImage} handleRemoveImage={removeCoverImage} isMultiple={false} />
                            </div>
                        </div>
                        <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-6">
                            <div className='mt-6 col-span-full'>
                                <h1>Pictures of the Place</h1>
                                <hr className='mt-4' />
                            </div>
                            <div className="col-span-full">

                                <ImageUpload handler={handleChange} name="propertyImages"
                                    setSelectedImages={setSelectedListingImages}
                                    selectedImages={selectedListingImages}
                                    handleRemoveImage={removeListingImages} isMultiple={true} />
                            </div>
                        </div>
                        <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-6">
                            <div className={'col-span-2'}>
                                <div className='mt-6'>
                                    <h1>How Long Can Guest Stay</h1>
                                    <span
                                        className={"text-xs"}>Shorter trips can mean more reservation, but you&apos;ll turn over space more often.</span>
                                    <hr className='mt-4' />
                                </div>
                                <div className="grid px-4 mt-4 gap-y-4">
                                    <div className={'flex items-center justify-between'}>
                                        <Label text={"Nights Min"} textColor={''} bgColor={''} />
                                        <PlusMinus getter={minNights} setter={setMinNights} />
                                    </div>
                                    <div className={'flex items-center justify-between'}>
                                        <Label text={"Nights Max"} textColor={''} bgColor={''} />
                                        <PlusMinus getter={maxNights} setter={setMaxNights} />
                                    </div>
                                </div>
                            </div>
                            <div className={'col-span-3'}>
                                <div className='mt-6'>
                                    <h1>Set Your Availability</h1>
                                    <span
                                        className={"text-xs"}>You can always make changes after you publish it.</span>
                                    <hr className='mt-4' />
                                </div>
                                <div className="grid px-4 mt-4 gap-y-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-wrap w-full gap-4 mb-6 md:flex-nowrap md:mb-0">
                                            <div className="w-full">
                                                <DatePicker
                                                    label="From"
                                                    className="w-full"
                                                    onChange={(e) => {
                                                        // @ts-ignore
                                                        const selectedDate = new Date(e);
                                                        const formattedDate = selectedDate.toLocaleDateString();

                                                        // @ts-ignore
                                                        const isDateSelected = formData.availabilitySchedule.includes(formattedDate);


                                                        if (!isDateSelected) {
                                                            setFormData({
                                                                ...formData,
                                                                // @ts-ignore
                                                                availabilitySchedule: [...formData.availabilitySchedule, formattedDate]
                                                            });
                                                        }
                                                    }}

                                                    name="availabilitySchedule"
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {formData.availabilitySchedule.map((slot, index) => (
                                            <Chip
                                                key={index}
                                                color="primary"
                                                className="ml-2 px-2 pb-0.5"
                                                onClose={() => {
                                                    // Remove the selected date from the availableTimeSlots array
                                                    const slots = formData.availabilitySchedule.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, availabilitySchedule: slots });
                                                }}
                                            >
                                                {slot}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-6">
                            <div className='mt-6 col-span-full'>
                                <h1>Price Your Place</h1>
                                <hr className='mt-4' />
                            </div>
                            <InputWLabel label={"Base Prices (Monday - Thursday) ($)"} inputType={"number"}
                                placeHolder={"$ 0.00"}
                                value={formData.description.pricing.basePriceForWeekdays}
                                handler={handleChange} name={'description.pricing.basePriceForWeekdays'} />
                            <InputWLabel label={"Base Prices (Friday - Sunday) ($)"} inputType={"number"}
                                placeHolder={"$ 0.00"}
                                value={formData.description.pricing.basePriceForWeekends}
                                handler={handleChange} name={'description.pricing.basePriceForWeekends'} />
                            <InputWLabel label={"Long Term Price (Monthly Discount)"} inputType={"number"}
                                placeHolder={"% 0.00"} value={formData.description.pricing.monthlyDiscount}
                                handler={handleChange} name={'description.pricing.monthlyDiscount'}
                                className={'col-span-2'} />
                        </div>
                        <div className="grid grid-cols-5 mt-10 gap-x-4 gap-y-6">
                            <PrimaryButton content={"Insert Property"} className={''} events={
                                () => {
                                    insertProperty();
                                }
                            } />
                            <SecondaryButton content={"Cancel"} className={''} events={''} />
                        </div>
                    </Tab>

                    <Tab key="Update" title="Update">

                        <Input label="Search for a property" className="w-full mb-10" endContent={<Button size="sm"><BsSearch /></Button>} onChange={(e) => { searchProperty(e.target.value) }} />

                        <Accordion>
                            {propertyListFiltered.map((property: any, index: number) => (
                                <AccordionItem key={index} title={<>
                                    <div className="font-light flex justify-between items-center mb-2 -mt-2">
                                        <div className="flex space-x-4 items-center">
                                            <p className="font-medium">{property.placeName}</p>
                                            <Divider orientation="vertical" className="h-4" />
                                            <p>{property.location}</p>
                                            <Divider orientation="vertical" className="h-4" />
                                            <Code>{property.ownerFirstName + ' ' + property.ownerLastName}</Code>
                                        </div>
                                        {property.review && <Code size="sm" className="flex gap-x-2 justify-center items-center">{property.review} <BsStarFill className="text-yellow-400" /></Code>}
                                    </div>
                                </>} startContent={<Avatar src={property.coverImage} size="lg" radius="md" />} subtitle={
                                    <>
                                        <div className="font-light flex justify-between items-center">
                                            <div className="flex gap-x-2">
                                                <Chip className="scale-90" size="sm" color={`${property.availability === 'Available' ? 'success' : 'default'}`}>{property.availability}</Chip>
                                                <Chip className="scale-90" size="sm" color="primary">{property.propertyType}</Chip>
                                            </div>
                                            <small>{new Date(property.insertedDate).toLocaleString()}</small>
                                        </div>
                                    </>
                                }>
                                    <StaysForm id={property.id} country={country} propertyType={propertyTypes} propertySizeType={sizeTypes} allAmenities={amenities} rulesForGuests={rulesForGuests} reloadProperty={fetchProperties} />
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default ManageStays;