'use client'
import React, {useState} from "react";
import {Checkbox, Input, Radio, RadioGroup, Select, SelectItem, Textarea} from "@nextui-org/react";
import {BsChevronDown, BsEye, BsGeoAltFill, BsPlus, BsXCircle} from "react-icons/bs";
import ImageUpload from "@/elements/ImageUpload";
import PlusMinus from "@/elements/PlusMinus";
import ListingCard from "@/components/ListingCard";
import {BiSolidEditAlt} from "react-icons/bi";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PrimaryButton from "@/elements/PrimaryButton";
import SecondaryButton from "@/elements/SecondaryButton";


const formData = {
    form1: {
        propertyType: [
            {name: 'Hotel', selected: true},
            {name: 'Cottage', selected: false},
            {name: 'Villa', selected: false},
            {name: 'Cabin', selected: false},
            {name: 'Farm stay', selected: false},
            {name: 'Houseboat', selected: false},
            {name: 'Lighthouse', selected: false},
        ],
        placeName: 'Place name',
        rentalForm: [
            {name: 'Entire place', selected: true},
            {name: 'Private room', selected: false},
            {name: 'Shared room', selected: false},
        ]
    },
    form2: {
        country: [
            {name: 'Viet Nam', selected: true},
            {name: 'Thailand', selected: false},
            {name: 'France', selected: false},
            {name: 'Singapore', selected: false},
            {name: 'Japan', selected: false},
            {name: 'Korea', selected: false},
        ], street: '...',
        roomNumber: ' ',
        city: ' ',
        state: ' ',
        postalCode: ' '
    },
    form3: {
        acreage: [
            {name: '100', selected: true},
            {name: '200', selected: false},
            {name: '300', selected: false},
            {name: '400', selected: false},
            {name: '500', selected: false},
        ],
        guests: 4,
        bedroom: 4,
        beds: 4,
        bathroom: 2,
        kitchen: 2
    },
    form4: {
        amenities: [
            {name: 'Wifi', selected: true},
            {name: 'Internet', selected: true},
            {name: 'TV', selected: false},
            {name: 'Air conditioning', selected: false},
            {name: 'Fan', selected: false},
            {name: 'Private entrance', selected: false},
            {name: 'Dryer', selected: true},
            {name: 'Heater', selected: false},
            {name: 'Washing machine', selected: false},
            {name: 'Detergent', selected: true},
            {name: 'Clothes dryer', selected: false},
            {name: 'Baby cot', selected: false},
            {name: 'Desk', selected: true},
            {name: 'Fridge', selected: false},
            {name: 'Dryer', selected: false},
        ],
        otherAmenities: [
            {name: 'Wardrobe', selected: true},
            {name: 'Cloth hook', selected: false},
            {name: 'Extra cushion', selected: true},
            {name: 'Gas stove', selected: false},
            {name: 'Toilet paper', selected: false},
            {name: 'Free toiletries', selected: true},
            {name: 'Makeup table', selected: false},
            {name: 'Hot pot', selected: false},
            {name: 'Bathroom heaters', selected: false},
            {name: 'Kettle', selected: true},
            {name: 'Dishwasher', selected: false},
            {name: 'BBQ grill', selected: true},
            {name: 'Toaster', selected: true},
            {name: 'Towel', selected: false},
            {name: 'Dining table', selected: false},
        ],
        safetyAmenities: [
            {name: 'Fire siren', selected: true},
            {name: 'Fire extinguisher', selected: false},
            {name: 'Anti-theft key', selected: false},
            {name: 'Safe vault', selected: false},
        ]
    },
    form5: {
        general: {doNotAllow: false, allow: true, charge: false},
        pet: {doNotAllow: false, allow: true, charge: false},
        partyOrganizing: {doNotAllow: false, allow: true, charge: false},
        cooking: {doNotAllow: false, allow: true, charge: false},
        additionalRules: [
            {name: 'No smoking in common areas', selected: true},
            {name: 'Do not wear shoes/shoes in the house', selected: false},
            {name: 'No cooking in the bedroom', selected: false},
        ]
    },
    form6: {description: '...'},
    form7: {coverImage: '', images: []},
    form8: {
        currency: [
            {name: 'USD', id: 1},
            {name: 'VND', id: 2},
            {name: 'EUR', id: 3},
            {name: 'JPY', id: 4},
            {name: 'GBP', id: 5},
        ],
        basePrice: 0.00,
        basePriceWeekend: 0.00,
        longTermPrice: 0.00
    },
    form9: {
        minNights: 1,
        maxNights: 10
    },
    form10: {publish: false}
}

const listingsProperties = [
    {
        discount: 10,
        stockimg: "https://images.pexels.com/photos/22708188/pexels-photo-22708188/free-photo-of-man-fishing-on-seashore-with-dog.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        cardTitle: "Test Title",
        location: "london",
        option1: "Entire Cabin",
        option2: "2 Beds",
        price: "$100",
        rating: 4.5,
        ratingcount: 100,
    },
]

const Form1 = () => {
    return (
        <div className={`flex flex-col gap-y-8 py-6 px-3`}>
            <h2 className={`text-2xl font-semibold`}>Choosing listing categories</h2>
            <hr className={`bg-gray-300 max-w-16`}/>
            <div className={`w-full flex flex-col gap-y-8`}>

                <Select
                    isRequired={true}
                    label="Choose a property type"
                    placeholder="Hotel"
                    labelPlacement="outside"
                    selectorIcon={<BsChevronDown/>}
                    variant={'flat'}
                    description={"Hotel: Professional hospitality businesses that usually have a unique style or theme defining their brand and decor"}
                    classNames={
                        {
                            trigger: `text-gray-500 bg-transparent border border-gray-200`,
                        }
                    }
                >
                    {formData.form1.propertyType.map((item, index) => (
                        <SelectItem key={index}>{item.name}</SelectItem>
                    ))}
                </Select>

                <Input
                    isRequired={true}
                    label="Place name"
                    placeholder={formData.form1.placeName}
                    labelPlacement="outside"
                    description={"A catchy name usually includes: House name + Room name + Featured property + Tourist destination"}
                    variant={'flat'}
                    classNames={
                        {
                            inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                        }
                    }
                />
                <Select
                    isRequired={true}
                    label="Rental form"
                    placeholder="Entire place"
                    labelPlacement="outside"
                    selectorIcon={<BsChevronDown/>}
                    variant={'flat'}
                    description={"Entire place: Guests have the whole place to themselves—there's a private entrance and no shared spaces. A bedroom, bathroom, and kitchen are usually included."}
                    classNames={
                        {
                            trigger: `text-gray-500 bg-transparent border border-gray-200`,
                        }
                    }
                >
                    {formData.form1.rentalForm.map((item, index) => (
                        <SelectItem key={index}>{item.name}</SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    );
}

const Form2 = () => {
    return (
        <div className={`flex flex-col gap-y-8 py-6 px-3`}>
            <h2 className={`text-2xl font-semibold`}>Your place location</h2>
            <hr className={`bg-gray-300 max-w-16`}/>
            <div className={`w-full flex flex-col gap-y-8`}>
                <button
                    className={`px-6 py-4 rounded-full w-fit border border-gray-200 flex justify-center items-center`}>
                    <BsGeoAltFill/>
                    <span className={`ml-2 font-semibold`}>Use current location</span>
                </button>
                <Select
                    isRequired={true}
                    label="Country/Region"
                    placeholder="Viet Nam"
                    labelPlacement="outside"
                    selectorIcon={<BsChevronDown/>}
                    variant={'flat'}
                    classNames={
                        {
                            trigger: `text-gray-500 bg-transparent border border-gray-200`,
                        }
                    }>
                    {formData.form2.country.map((item, index) => (
                        <SelectItem key={index}>{item.name}</SelectItem>
                    ))}
                </Select>
                <Input
                    isRequired={true}
                    label="Street"
                    placeholder={formData.form2.street}
                    labelPlacement="outside"
                    variant={'flat'}
                    classNames={
                        {
                            inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                        }
                    }/>
                <Input
                    isRequired={true}
                    label="Room number (optional)"
                    placeholder={formData.form2.roomNumber}
                    labelPlacement="outside"
                    variant={'flat'}
                    classNames={
                        {
                            inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                        }
                    }/>
                <div className={`w-full grid grid-cols-1 md:grid-cols-3 gap-5`}>
                    <Input
                        isRequired={true}
                        label="City"
                        placeholder={formData.form2.city}
                        labelPlacement="outside"
                        variant={'flat'}
                        classNames={
                            {
                                inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                            }
                        }/>
                    <Input
                        isRequired={true}
                        label="State"
                        placeholder={formData.form2.state}
                        labelPlacement="outside"
                        variant={'flat'}
                        classNames={
                            {
                                inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                            }
                        }/>
                    <Input
                        isRequired={true}
                        label="Postal code"
                        placeholder={formData.form2.postalCode}
                        labelPlacement="outside"
                        variant={'flat'}
                        classNames={
                            {
                                inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                            }
                        }/>
                </div>
                <div className={`w-full flex flex-col`}>
                    <p>Detailed address</p>
                    <small className={`text-gray-500`}>1110 Pennsylvania Avenue NW, Washington, DC
                        20230</small>
                    <div className={`w-full rounded-2xl overflow-clip mt-3`}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.830775453038!2d80.00271657643036!3d7.029167867077636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f92a7a744a9b%3A0x5effdb06ca45981c!2sEmbaraluwa%20North%202!5e0!3m2!1sen!2slk!4v1723479133330!5m2!1sen!2slk"
                            className={`w-full`} height="450" loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Form3 = () => {

    const [propertyGuests, setPropertyGuests] = useState(formData.form3.guests);
    const [propertyBedroom, setPropertyBedroom] = useState(formData.form3.bedroom);
    const [propertyBeds, setPropertyBeds] = useState(formData.form3.beds);
    const [propertyBathroom, setPropertyBathroom] = useState(formData.form3.bathroom);
    const [propertyKitchen, setPropertyKitchen] = useState(formData.form3.kitchen);

    return (
        <div className={`flex flex-col gap-y-8 py-6 px-3`}>
            <h2 className={`text-2xl font-semibold`}>Size of your location</h2>
            <hr className={`bg-gray-300 max-w-16`}/>
            <div className={`w-full flex flex-col gap-y-8`}>
                <Select
                    isRequired={true}
                    label="Acreage (m2)"
                    placeholder="100"
                    labelPlacement="outside"
                    selectorIcon={<BsChevronDown/>}
                    variant={'flat'}
                    classNames={
                        {
                            trigger: `text-gray-500 bg-transparent border border-gray-200`,
                        }
                    }>
                    {formData.form3.acreage.map((item, index) => (
                        <SelectItem key={index}>{item.name}</SelectItem>
                    ))}
                </Select>

                <div className={`flex flex-col items-center justify-start gap-y-8`}>

                    <div className={`w-full flex justify-between items-center`}>
                        <p className={`font-medium`}>Guests</p>
                        <PlusMinus getter={propertyGuests} setter={setPropertyGuests}/>
                    </div>

                    <div className={`w-full flex justify-between items-center`}>
                        <p className={`font-medium`}>Bedroom</p>
                        <PlusMinus getter={propertyBedroom} setter={setPropertyBedroom}/>
                    </div>

                    <div className={`w-full flex justify-between items-center`}>
                        <p className={`font-medium`}>Beds</p>
                        <PlusMinus getter={propertyBeds} setter={setPropertyBeds}/>
                    </div>

                    <div className={`w-full flex justify-between items-center`}>
                        <p className={`font-medium`}>Bathroom</p>
                        <PlusMinus getter={propertyBathroom} setter={setPropertyBathroom}/>
                    </div>

                    <div className={`w-full flex justify-between items-center`}>
                        <p className={`font-medium`}>Kitchen</p>
                        <PlusMinus getter={propertyKitchen} setter={setPropertyKitchen}/>
                    </div>

                </div>

            </div>
        </div>
    );
}

const Form4 = () => {

    return (
        <div className={`flex flex-col gap-y-8 py-6 px-3 `}>
            <div className={`w-full flex flex-col gap-y-2`}>
                <h2 className={`text-2xl font-semibold`}>Amenities</h2>
                <p className={`text-gray-500`}>Many customers have searched for accommodation based on amenities
                    criteria</p>
            </div>
            <hr className={`bg-gray-300 max-w-16`}/>
            <div className={`w-full flex flex-col gap-y-8`}>

                <div className={`w-full flex flex-col gap-y-7`}>
                    <p className={`font-semibold text-lg`}>Basic amenities</p>
                    <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
                        {formData.form4.amenities.map((item, index) => (
                            <Checkbox key={index} checked={item.selected}>{item.name}</Checkbox>
                        ))}
                    </div>
                </div>

                <div className={`w-full flex flex-col gap-y-7`}>
                    <p className={`font-semibold text-lg`}>Other amenities</p>
                    <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
                        {formData.form4.otherAmenities.map((item, index) => (
                            <Checkbox key={index} checked={item.selected}>{item.name}</Checkbox>
                        ))}
                    </div>
                </div>

                <div className={`w-full flex flex-col gap-y-7`}>
                    <p className={`font-semibold text-lg`}>Safety amenities</p>
                    <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
                        {formData.form4.safetyAmenities.map((item, index) => (
                            <Checkbox key={index} checked={item.selected}>{item.name}</Checkbox>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

const Form5 = () => {
    return (
        <div className={`flex flex-col gap-y-8 py-6 px-3`}>
            <div className={`w-full flex flex-col gap-y-2`}>
                <h2 className={`text-2xl font-semibold`}>Set house rules for your guests</h2>
                <p className={`text-gray-500`}>Guests must agree to your house rules before they book.</p>
            </div>
            <hr className={`bg-gray-300 max-w-16`}/>
            <div className={`w-full flex flex-col gap-y-8`}>
                <div className={`w-full flex flex-col gap-y-7`}>
                    <p className={`font-semibold text-lg`}>General amenities</p>
                    <RadioGroup>
                        <Radio value="doNotAllow" checked={formData.form5.general.doNotAllow}>Do not allow</Radio>
                        <Radio value="allow" checked={formData.form5.general.allow}>Allow</Radio>
                        <Radio value="charge" checked={formData.form5.general.charge}>Charge</Radio>
                    </RadioGroup>
                </div>
                <div className={`w-full flex flex-col gap-y-7`}>
                    <p className={`font-semibold text-lg`}>Pets</p>
                    <RadioGroup>
                        <Radio value="doNotAllow" checked={formData.form5.pet.doNotAllow}>Do not allow</Radio>
                        <Radio value="allow" checked={formData.form5.pet.allow}>Allow</Radio>
                        <Radio value="charge" checked={formData.form5.pet.charge}>Charge</Radio>
                    </RadioGroup>
                </div>
                <div className={`w-full flex flex-col gap-y-7`}>
                    <p className={`font-semibold text-lg`}>Party organizing</p>
                    <RadioGroup>
                        <Radio value="doNotAllow" checked={formData.form5.partyOrganizing.doNotAllow}>Do not
                            allow</Radio>
                        <Radio value="allow" checked={formData.form5.partyOrganizing.allow}>Allow</Radio>
                        <Radio value="charge" checked={formData.form5.partyOrganizing.charge}>Charge</Radio>
                    </RadioGroup>
                </div>
                <div className={`w-full flex flex-col gap-y-7`}>
                    <p className={`font-semibold text-lg`}>Cooking</p>
                    <RadioGroup>
                        <Radio value="doNotAllow" checked={formData.form5.cooking.doNotAllow}>Do not allow</Radio>
                        <Radio value="allow" checked={formData.form5.cooking.allow}>Allow</Radio>
                        <Radio value="charge" checked={formData.form5.cooking.charge}>Charge</Radio>
                    </RadioGroup>
                </div>
            </div>
            <hr className={`bg-gray-300`}/>
            <p className={`font-semibold text-lg`}>Additional rules</p>
            <div className={`w-full items-center justify-start flex flex-col`}>
                {formData.form5.additionalRules.map((item, index) => (
                    <div key={index}
                         className={`w-full flex justify-between items-center gap-x-3 border border-y-gray-200 border-x-0 p-3`}>
                        <p>{item.name}</p>
                        <BsXCircle className={`text-gray-500 cursor-pointer`}/>
                    </div>
                ))}
            </div>
            <div className={`w-full flex justify-between items-center gap-x-3`}>
                <Input
                    label="No smoking..."
                    variant={'flat'}
                    size={'sm'}
                    radius={'lg'}
                    classNames={
                        {
                            inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                        }
                    }/>
                <button
                    className={`bg-primary text-white px-5 py-3 rounded-full transition duration-300 hover:bg-primary-900 font-semibold flex justify-center items-center gap-x-2`}>
                    <BsPlus className={`text-3xl`}/>
                    <span className={`text-nowrap`}>Add Tag</span>
                </button>
            </div>
        </div>
    );
}

const Form6 = () => {
    return (
        <div className={`flex flex-col gap-y-8 py-6 px-3`}>
            <div className={`w-full flex flex-col gap-y-2`}>
                <h2 className={`text-2xl font-semibold`}>Your place description for client</h2>
                <p className={`text-gray-500`}>Mention the best features of your accommodation, any special amenities
                    like fast Wi-Fi or parking, as well as things you like about the neighborhood.</p>
            </div>
            <Textarea
                variant="bordered"
                disableAnimation={true}
                placeholder={formData.form6.description}
                classNames={{
                    input: "resize-y min-h-[250px]",
                    inputWrapper: "border border-gray-200 hover:border-gray-100",
                }}
            />
        </div>
    );
}

const Form7 = () => {

    return (
        <div className={`flex flex-col gap-y-8 py-6 px-3`}>
            <div className={`w-full flex flex-col gap-y-2`}>
                <h2 className={`text-2xl font-semibold`}>Pictures of the place</h2>
                <p className={`text-gray-500`}>A few beautiful photos will help customers have more sympathy for your
                    property.</p>
            </div>
            <div className={`w-full flex flex-col gap-5`}>
                <div className="flex flex-col w-full mx-auto gap-y-8">
                    <div className={`w-full flex flex-col gap-y-4`}>
                        <p className={`font-semibold text-xl`}>Cover image</p>
                        <div className="w-full mx-auto">
                            <ImageUpload isMultiple={false}/>
                        </div>
                    </div>
                    <div className={`w-full flex flex-col gap-y-4`}>
                        <p className={`font-semibold text-xl`}>Pictures of the place</p>
                        <div className="w-full mx-auto">
                            <ImageUpload isMultiple={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Form8 = () => {

    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    function handleCurrencyChange(itemId: string) {
        formData.form8.currency.map((item) => {
            if (item.id.toString() === itemId) {
                setSelectedCurrency(item.name);
            }
        });
    }

    return (


        <div className={`flex flex-col gap-y-8 py-6 px-3`}>
            <div className={`w-full flex flex-col gap-y-2`}>
                <h2 className={`text-2xl font-semibold`}>Price your space</h2>
                <p className={`text-gray-500`}>The host&apos;s revenue is directly dependent on the setting of rates and
                    regulations on the number of guests, the number of nights, and the cancellation policy.</p>
            </div>
            <hr className={`bg-gray-300 max-w-16`}/>
            <div className={`w-full flex flex-col gap-y-8`}>
                <div className={`w-full flex flex-col gap-y-7`}>
                    <Select
                        isRequired={true}
                        label="Currency"
                        placeholder="USD"
                        labelPlacement="outside"
                        selectorIcon={<BsChevronDown/>}
                        onChange={(e) => {
                            handleCurrencyChange(e.target.value);
                        }}
                        variant={'bordered'}
                        classNames={
                            {
                                trigger: `text-gray-500 bg-transparent border border-gray-200`,
                                label: `font-medium`,
                            }
                        }>
                        {formData.form8.currency.map((item) => (
                            <SelectItem key={item.id}>{item.name}</SelectItem>
                        ))}
                    </Select>
                    <Input
                        label="Base price (Monday -Thuday)"
                        // @ts-ignore
                        placeholder={formData.form8.basePrice}
                        labelPlacement="outside"
                        startContent={
                            <div className="flex items-center pointer-events-none">
                                $
                            </div>
                        }
                        variant={'bordered'}
                        classNames={
                            {
                                inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                                label: `font-medium`,
                            }
                        }
                        endContent={
                            <div className="flex items-center text-gray-500">
                                {selectedCurrency}
                            </div>
                        }
                        type="text"
                    />
                    <Input
                        label="Base price (Friday-Sunday)"
                        // @ts-ignore
                        placeholder={formData.form8.basePriceWeekend}
                        labelPlacement="outside"
                        startContent={
                            <div className="flex items-center pointer-events-none">
                                $
                            </div>
                        }
                        variant={'bordered'}
                        classNames={
                            {
                                inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                                label: `font-medium`,
                            }
                        }
                        endContent={
                            <div className="flex items-center text-gray-500">
                                {selectedCurrency}
                            </div>
                        }
                        type="text"
                    />
                    <Input
                        label="Long term price (Monthly discount)"
                        // @ts-ignore
                        placeholder={formData.form8.longTermPrice}
                        labelPlacement="outside"
                        startContent={
                            <div className="flex items-center pointer-events-none">
                                %
                            </div>
                        }
                        variant={'bordered'}
                        classNames={
                            {
                                inputWrapper: `text-gray-500 bg-transparent border border-gray-200`,
                                label: `font-medium`,
                            }
                        }
                        endContent={
                            <div className="flex items-center text-gray-500 text-nowrap">
                                every month
                            </div>
                        }
                        type="text"
                    />
                </div>
            </div>
        </div>
    );
}

const Form9 = () => {

    const [nightsMin, setNightsMin] = useState(formData.form9.minNights);
    const [nightsMax, setNightsMax] = useState(formData.form9.maxNights);

    return (
        <div className={`flex flex-col gap-y-8 py-6 px-3`}>
            <div className={`w-full flex flex-col gap-y-2`}>
                <h2 className={`text-2xl font-semibold`}>How long can guests stay?</h2>
                <p className={`text-gray-500`}>Shorter trips can mean more reservations, but you&apos;ll turn over your
                    space
                    more often.</p>
            </div>
            <hr className={`bg-gray-300 max-w-16`}/>
            <div>
                <div className={`w-full flex flex-col gap-y-7`}>
                    <div className={`w-full flex justify-between items-center`}>
                        <p className={`font-medium`}>Minimum nights</p>
                        <PlusMinus getter={nightsMin} setter={setNightsMin}/>
                    </div>
                    <div className={`w-full flex justify-between items-center`}>
                        <p className={`font-medium`}>Maximum nights</p>
                        <PlusMinus getter={nightsMax} setter={setNightsMax}/>
                    </div>
                </div>
            </div>
            <div className={`w-full flex flex-col gap-y-2`}>
                <h2 className={`text-2xl font-semibold`}>Set your availability</h2>
                <p className={`text-gray-500`}>Editing your calendar is easy—just select a date to block or unblock it.
                    You can always make changes after you publish.</p>
            </div>
        </div>
    );
}

const Form10 = () => {
    return (
        <div className={`flex flex-col gap-y-8 py-6 px-3`}>
            <div className={`w-full flex flex-col gap-y-2`}>
                <h2 className={`text-2xl font-semibold`}>Congratulations 🎉</h2>
                <p className={`text-gray-500`}>Excellent, congratulations on completing the listing, it is waiting to be
                    reviewed for publication</p>
            </div>
            <hr className={`bg-gray-300 max-w-16`}/>
            <div className={`w-full flex flex-col gap-y-8`}>
                <div className={`w-full flex flex-col gap-y-7`}>
                    <p className={`font-semibold text-lg`}>This is your listing</p>
                    {listingsProperties.map((item, index) => (
                        <ListingCard
                            key={index}
                            discount={item.discount}
                            // @ts-ignore
                            stockimg={item.stockimg}
                            cardTitle={item.cardTitle}
                            location={item.location}
                            option1={item.option1}
                            option2={item.option2}
                            price={item.price}
                            rating={item.rating}
                            ratingcount={item.ratingcount}
                            event={''}
                        />
                    ))}
                    <div className={`flex gap-x-6`}>
                        <button
                            className={`bg-transparent border border-gray-200 px-6 py-3 rounded-full transition duration-300 hover:bg-gray-100 font-medium flex justify-center items-center gap-x-3`}>
                            <BiSolidEditAlt className={`text-xl`}/>
                            Edit
                        </button>
                        <button
                            className={`bg-primary text-white px-6 py-3 rounded-full transition duration-300 hover:bg-primary-900 font-semibold flex justify-center items-center gap-x-3`}>
                            <BsEye className={`text-xl`}/>
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AddListingPage = () => {

    const [currentForm, setCurrentForm] = useState(1);
    const [isFlight, setIsFlight] = useState(false);

    return (
        <>
            <Navigation/>
            <div className={`w-full h-full min-h-screen flex justify-center items-center px-5 dark:bg-[#0f1623]`}>
                <div className={`w-full max-w-[800px] flex flex-col gap-y-10`}>
                    <div className={`flex justify-start items-baseline gap-x-1 w-full`}>
                        <p className={`text-4xl font-bold`}>{currentForm}</p>
                        <p className={`text-lg text-gray-500`}>/</p>
                        <p className={`text-lg text-gray-500`}>10</p>
                    </div>
                    <div className={`p-3 border border-gray-300 rounded-2xl`}>
                        {currentForm === 1 && <Form1/>}
                        {currentForm === 2 && <Form2/>}
                        {currentForm === 3 && <Form3/>}
                        {currentForm === 4 && <Form4/>}
                        {currentForm === 5 && <Form5/>}
                        {currentForm === 6 && <Form6/>}
                        {currentForm === 7 && <Form7/>}
                        {currentForm === 8 && <Form8/>}
                        {currentForm === 9 && <Form9/>}
                        {currentForm === 10 && <Form10/>}
                    </div>
                    <div className={`flex justify-end items-center gap-x-3 w-full`}>
                        <SecondaryButton content={currentForm === 1 ? 'Cancel' : 'Go Back'} className={''}
                                         events={() => {
                                             if (currentForm > 1) {
                                                 setCurrentForm(currentForm - 1);
                                             }
                                         }}/>
                        <PrimaryButton content={currentForm === 10 ? 'Publish listing' : 'Continue'} className={''}
                                       events={() => {
                                           if (currentForm < 10) {
                                               setCurrentForm(currentForm + 1);
                                           }
                                       }}/>
                    </div>
                </div>
            </div>
            <Footer setIsFlight={setIsFlight}/>
        </>
    );
}

export default AddListingPage;