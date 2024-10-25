import {Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@nextui-org/dropdown";
import {Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure} from "@nextui-org/react";
import {LuChevronDown} from "react-icons/lu";
import {Checkbox} from "@nextui-org/checkbox";
import {GoXCircleFill} from "react-icons/go";
import PlusMinus from "@/elements/PlusMinus";
import React, {useRef, useState} from "react";

// @ts-ignore
export default function ProductFilter({page}: { page: string }) {

    const [bedRoomsCount, setBedRoomsCount] = useState(0);
    const [bedsCount, setBedsCount] = useState(0);
    const [bathRoomsCount, setBathRoomsCount] = useState(0);
    const [passengerCount, setPassengerCount] = useState(0);
    const [bagsCount, setBagsCount] = useState(0);
    const minPrice = useRef(null);
    const maxPrice = useRef(null);
    // for modal
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    // for stay listing

    const roomsAndBeds = [
        {
            name: 'Bed Rooms',
            getter: bedRoomsCount,
            setter: setBedRoomsCount
        },
        {
            name: 'Beds',
            getter: bedsCount,
            setter: setBedsCount
        },
        {
            name: 'Bath Rooms',
            getter: bathRoomsCount,
            setter: setBathRoomsCount
        },
    ]

    const typeOfPlaces = [
        {
            name: 'Entire Place',
            description: 'Have a place to yourself'
        },
        {
            name: 'Private Room',
            description: 'Have your own room and share some common spaces'
        },
        {
            name: 'Hotel Room',
            description: 'Have a private and shared room in a boutique hotel, hostel, and more'
        },
        {
            name: 'Shared Room',
            description: 'Stay in a shared space, like a common room'
        },
    ]

    const moreFiltersStay = {
        "amenities": [
            {"name": "kitchen"},
            {"name": "wifi"},
            {"name": "air conditioning"},
            {"name": "indoor fireplace"},
            {"name": "heating"},
            {"name": "breakfast"},
            {"name": "dryer"},
            {"name": "hair dryer"},
            {"name": "washer"},
            {"name": "dedicated workspace"}
        ],
        "facilities": [
            {"name": "Free parking on premises"},
            {"name": "Pool"},
            {"name": "Hot tub"},
            {"name": "EV Charger"},
            {"name": "Gym"}
        ],
        "propertyType": [
            {"name": "House"},
            {"name": "Chalet"},
            {"name": "Bed and breakfast"},
            {"name": "Condominium"},
            {"name": "Apartment"},
            {"name": "Cottage"},
            {"name": "Boutique hotel"},
            {"name": "Guest suite"},
            {"name": "Guesthouse"},
            {"name": "Bungalow"}
        ],
        "rules": [
            {"name": "Pets Allowed"},
            {"name": "Smoking Allowed"}
        ]
    }
    // for stay listing
    // for car listing

    const carType = [
        {name: 'Sedan'},
        {name: 'SUV'},
        {name: 'Van'},
        {name: 'Coupe'},
        {name: 'Convertible'},
        {name: 'Truck'},
        {name: 'Wagon'},
        {name: 'Luxury'},
        {name: 'Sports'},
        {name: 'Electric'},
    ]

    const guestsAndBags = [
        {name: 'Passengers', getter: passengerCount, setter: setPassengerCount},
        {name: 'Bags', getter: bagsCount, setter: setBagsCount},
    ]

    const moreFiltersCars = {
        "carspecifications": [
            {"name": "With air conditioning"},
            {"name": "Automatic transmission"},
            {"name": "Manual transmission"},
            {"name": "2 doors"},
            {"name": "4+ doors"},
        ],
        "milage": [
            {"name": "Unlimited"},
            {"name": "Limited"},
        ],
        "supplier": [
            {"name": "Alamo"},
            {"name": "Avis"},
            {"name": "Budget"},
            {"name": "Dollar"},
        ],
        "insurance": [
            {"name": "No Insurance"},
            {"name": "Inclusive"},
            {"name": "Zero Excess"},
        ]
    };


    // for car listing


    // @ts-ignore
    return (
        <>
            <div
                className="max-w-[1300px] gap-x-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mx-auto buttons-bar px-4">
                <Popover placement="bottom">
                    <PopoverTrigger>
                        <Button
                            className="py-2 px-4 rounded-full flex items-center justify-evenly border border-neutral-300"
                            variant='bordered'>
                            {page === 'stay' ? 'Type of Place' : page === 'car' ? 'Car Type' : ''} <LuChevronDown/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="px-4 py-2 max-w-96">
                            {page === 'stay' ? (
                                typeOfPlaces.map((place, index) => (
                                    <label key={index} className='grid grid-cols-6 items-center my-4'>
                                        <div className='col-span-1'>
                                            <Checkbox/>
                                        </div>
                                        <div className='col-span-5 flex flex-col'>
                                            <span className='text-medium'>{place.name}</span>
                                            <span className='text-tiny'>{place.description}</span>
                                        </div>
                                    </label>
                                ))
                            ) : page === 'car' ? (
                                carType.map((car, index) => (
                                    <label key={index} className='grid grid-cols-6 items-center my-4'>
                                        <div className='col-span-1'>
                                            <Checkbox/>
                                        </div>
                                        <div className='col-span-5 flex flex-col'>
                                            <span className='text-medium'>{car.name}</span>
                                        </div>
                                    </label>
                                ))
                            ) : null}
                        </div>
                        <div className='flex w-full p-4 items-center justify-between'>
                            <div>
                                <Button variant={"bordered"} radius={"full"}
                                        className='w-full text-neutral-800 dark:text-neutral-300 text-medium'>Clear</Button>
                            </div>
                            <div>
                                <Button radius={"full"}
                                        className='w-full text-white text-medium bg-primary'>Apply</Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Dropdown closeOnSelect={false} className='dark:bg-gray-800'>
                    <DropdownTrigger>
                        <Button
                            className="py-2 bg-[#eef2ff] px-4 rounded-full flex items-center justify-evenly border border-primary text-primary"
                            variant="bordered"
                        >
                            $0 - $1000 <GoXCircleFill className='text-primary text-large'/>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" className='w-72'
                                  variant={"bordered"}
                                  itemClasses={{
                                      base: 'hover:border-0 border-0',
                                  }}>
                        <DropdownSection
                        >
                            <DropdownItem key="max" className='w-full p-4'
                                          onClick={() => {
                                              if (minPrice.current) {
                                                  // @ts-ignore
                                                  minPrice.current.focus();
                                              }
                                          }}>
                                <div className='flex flex-col'>
                                    <label htmlFor="minPrice">Min Price</label>
                                    <input
                                        type="number"
                                        className='focus:outline-none border border-neutral-500 h-10 rounded-full w-full bg-white text-neutral-800 px-2 mt-3'
                                        ref={minPrice}
                                    />
                                </div>
                            </DropdownItem>
                            <DropdownItem key="min" className='w-full p-4'
                                          onClick={() => {
                                              if (maxPrice.current) {
                                                  // @ts-ignore
                                                  maxPrice.current.focus();
                                              }
                                          }}>
                                <div className='flex flex-col'>
                                    <label htmlFor="maxPrice">Max Price</label>
                                    <input
                                        type="number"
                                        className='h-10 focus:outline-none border border-neutral-500 rounded-full w-full bg-white text-neutral-800 px-2 mt-3'
                                        ref={maxPrice}
                                    />
                                </div>
                            </DropdownItem>
                        </DropdownSection>
                        <DropdownItem className='w-full p-4 bg-neutral-100 dark:bg-gray-900'>
                            <div className='flex w-full items-center justify-between'>
                                <div>
                                    <Button variant={"bordered"} radius={"full"}
                                            className='w-full text-neutral-800 dark:text-neutral-300 text-medium'>Clear</Button>
                                </div>
                                <div>
                                    <Button radius={"full"}
                                            className='w-full text-white text-medium bg-primary'>Apply</Button>
                                </div>
                            </div>
                        </DropdownItem>


                    </DropdownMenu>
                </Dropdown>

                <Popover placement={"bottom"}>
                    <PopoverTrigger>
                        <Button
                            className="py-2 px-4 rounded-full flex items-center justify-evenly border border-neutral-300"
                            variant="bordered"
                        >
                            {page === 'stay' ? 'Rooms of Beds' : page === 'car' ? 'Guests & Bags' : ''} <LuChevronDown/>

                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={`w-fit flex flex-col gap-y-5 p-4`}>
                        {page === 'stay' ? (
                            roomsAndBeds.map((room, index) => (
                                <div key={index} className='w-full flex justify-between items-center gap-x-3 px-2 py-3'>
                                    <p className='font-medium'>{room.name}</p>
                                    <PlusMinus getter={room.getter} setter={room.setter}/>
                                </div>
                            ))
                        ) : page === 'car' ? (
                            guestsAndBags.map((guest, index) => (
                                <div key={index} className='w-full flex justify-between items-center gap-x-3 px-2 py-3'>
                                    <p className='font-medium'>{guest.name}</p>
                                    <PlusMinus getter={guest.getter} setter={guest.setter}/>
                                </div>
                            ))
                        ) : null}

                        <div className='flex w-full items-center justify-between'>
                            <div>
                                <Button variant={"bordered"} radius={"full"}
                                        className='w-full text-neutral-800 dark:text-neutral-300 text-medium'>Clear</Button>
                            </div>
                            <div>
                                <Button radius={"full"}
                                        className='w-full text-white text-medium bg-primary'>Apply</Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Button onPress={onOpen}
                        className="py-2 px-4 rounded-full flex items-center justify-evenly border border-primary bg-[#eef2ff] text-primary"
                        variant="bordered"
                >
                    More Filters (3) <GoXCircleFill className='text-primary text-large'/>
                </Button>
                <Modal size={"3xl"} isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    <Divider className="my-4"/>
                                </ModalHeader>
                                <ModalBody>
                                    <h3>
                                        {page === 'stay' ? 'Amenities' : page === 'car' ? 'Car Specifications' : ''}
                                    </h3>
                                    <div className="grid grid-cols-4">
                                        {page === 'stay' ? (
                                            moreFiltersStay.amenities.map((amenity, index) => (
                                                <label key={index} className="flex py-2 items-center gap-2">
                                                    <Checkbox/>
                                                    <span className="capitalize">{amenity.name}</span>
                                                </label>
                                            ))
                                        ) : page === 'car' ? (
                                            moreFiltersCars.carspecifications.map((spec, index) => (
                                                <label key={index} className="flex py-2 items-center gap-2">
                                                    <Checkbox/>
                                                    <span className="capitalize">{spec.name}</span>
                                                </label>
                                            ))
                                        ) : null}
                                    </div>
                                    <Divider className="my-4"/>

                                    <h3>
                                        {page === 'stay' ? 'Facilities' : page === 'car' ? 'Milage' : ''}
                                    </h3>
                                    <div className="grid grid-cols-4">
                                        {page === 'stay' ? (
                                            moreFiltersStay.facilities.map((facility, index) => (
                                                <label key={index} className="flex py-2 items-center gap-2">
                                                    <Checkbox/>
                                                    <span className="capitalize">{facility.name}</span>
                                                </label>
                                            ))
                                        ) : page === 'car' ? (
                                            moreFiltersCars.milage.map((milage, index) => (
                                                <label key={index} className="flex py-2 items-center gap-2">
                                                    <Checkbox/>
                                                    <span className="capitalize">{milage.name}</span>
                                                </label>
                                            ))
                                        ) : null}
                                    </div>
                                    <Divider className="my-4"/>
                                    <h3>
                                        {page === 'stay' ? 'Property Type' : page === 'car' ? 'Supplier' : ''}
                                    </h3>
                                    <div className="grid grid-cols-4">
                                        {page === 'stay' ? (
                                            moreFiltersStay.propertyType.map((property, index) => (
                                                <label key={index} className="flex py-2 items-center gap-2">
                                                    <Checkbox/>
                                                    <span className="capitalize">{property.name}</span>
                                                </label>
                                            ))
                                        ) : page === 'car' ? (
                                            moreFiltersCars.supplier.map((supplier, index) => (
                                                <label key={index} className="flex py-2 items-center gap-2">
                                                    <Checkbox/>
                                                    <span className="capitalize">{supplier.name}</span>
                                                </label>
                                            ))
                                        ) : null}
                                    </div>
                                    <Divider className="my-4"/>
                                    <h3>
                                        {page === 'stay' ? 'Rules' : page === 'car' ? 'Insurance' : ''}
                                    </h3>
                                    <div className="grid grid-cols-4">
                                        {page === 'stay' ? (
                                            moreFiltersStay.rules.map((rule, index) => (
                                                <label key={index} className="flex py-2 items-center gap-2">
                                                    <Checkbox/>
                                                    <span className="capitalize">{rule.name}</span>
                                                </label>
                                            ))
                                        ) : page === 'car' ? (
                                            moreFiltersCars.insurance.map((insurance, index) => (
                                                <label key={index} className="flex py-2 items-center gap-2">
                                                    <Checkbox/>
                                                    <span className="capitalize">{insurance.name}</span>
                                                </label>
                                            ))
                                        ) : null}
                                    </div>
                                    <Divider className="my-8"/>

                                </ModalBody>
                                <ModalFooter>
                                    <div className='flex w-full items-center justify-between'>
                                        <div>
                                            <Button variant={"bordered"} radius={"full"}
                                                    className='w-full text-neutral-800 dark:text-neutral-300 text-medium'>Clear</Button>
                                        </div>
                                        <div>
                                            <Button radius={"full"}
                                                    className='w-full text-white text-medium bg-primary'>Apply</Button>
                                        </div>
                                    </div>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
}