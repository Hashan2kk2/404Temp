"use client";

import ListingCard from "@/components/ListingCard";
import { useEffect, useState } from "react";
import { LuDot } from "react-icons/lu";
// @ts-ignore
import Footer from "@/components/Footer";
import HeroSectionListing from "@/components/HeroSectionListing";
import Navigation from "@/components/Navigation";
import NewsLetter from "@/components/NewsLetter";
import PlusMinus from "@/elements/PlusMinus";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeCalendar,
  Slider,
  SliderValue,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import Notiflix from "notiflix";
import { BsChevronDown } from "react-icons/bs";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import GuestsDropDown from "@/elements/GuestsDropDown";

const ITEMS_PER_PAGE = 16;

const Listing = () => {
  const getReqSearchParams = useSearchParams();
  const location = getReqSearchParams.get("location");
  const guests = getReqSearchParams.get("guests");
  const dateRange = getReqSearchParams.get("dateRange");

  const [otherFilters, setOtherFilters] = useState(false);
  interface Listing {
    guests: number;
    availabilitySchedule: any;
    country: string;
    propertyType: string;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    description: {
      pricing: {
        basePriceForWeekdays: number;
      };
      amenities: {
        general: string[];
        other: string[];
        safety: string[];
      };
      rulesForGuests: { name: string }[];
    };
    coverImageRef: string;
    placeName: string;
    location: string;
    id: string;
    rating: number; // Added rating property
  }

  const [listingData, setListingData] = useState<Listing[]>([]);
  const [filteredData, setFilteredData] = useState<Listing[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [bedRoomsCount, setBedRoomsCount] = useState(0);
  const [bedsCount, setBedsCount] = useState(0);
  const [bathRoomsCount, setBathRoomsCount] = useState(0);

  const [sliderMaxPrice, setSliderMaxPrice] = useState(1000);

  const [form, setForm] = useState<{
    propertyType: string;
    bedRooms: number;
    beds: number;
    bathRooms: number;
    minPrice: number;
    maxPrice: number;
    amenities: { name: string; value: boolean }[];
    rules: { name: string; value: boolean }[];
    location: string;
    dateRange: string;
    guests: number;
  }>({
    propertyType: "",
    bedRooms: bedRoomsCount,
    beds: bedsCount,
    bathRooms: bathRoomsCount,
    minPrice: 0,
    maxPrice: 300,
    amenities: [],
    rules: [],
    location: "",
    dateRange: "",
    guests: 0,
  });

  const handleFormChange = (e: { target: { name: any; value: any } }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const selectedAmenities = form.amenities
      .filter((amenity) => amenity.value)
      .map((amenity) => amenity.name);
    const selectedRules = form.rules
      .filter((rule) => rule.value)
      .map((rule) => rule.name);

    const filteredData = listingData.filter((listing) => {
      const matchesPropertyType = form.propertyType
        ? listing.propertyType === form.propertyType
        : true;
      const matchesBedRooms = form.bedRooms
        ? listing.bedrooms >= form.bedRooms
        : true;
      const matchesBeds = form.beds ? listing.beds >= form.beds : true;
      const matchesBathRooms = form.bathRooms
        ? listing.bathrooms >= form.bathRooms
        : true;
      const matchesPrice =
        listing.description.pricing.basePriceForWeekdays >= form.minPrice &&
        listing.description.pricing.basePriceForWeekdays <= form.maxPrice;
      const hasAllAmenities = selectedAmenities.every(
        (amenity) =>
          listing.description.amenities.general.includes(amenity) ||
          listing.description.amenities.other.includes(amenity) ||
          listing.description.amenities.safety.includes(amenity)
      );
      const matchesLocation = form.location
        ? listing.location === form.location
        : true;
      const matchesGuests = listing.guests >= form.guests;
      const unavailableDates = listing.availabilitySchedule
        .split(",")
        .map((date: string) => new Date(date.trim()));
      const checkInDate = new Date(form.dateRange.split(" - ")[0]);
      const checkOutDate = new Date(form.dateRange.split(" - ")[1]);
      const isUnavailable = unavailableDates.some(
        (date: Date) => date >= checkInDate && date <= checkOutDate
      );
      const hasAllRules = selectedRules.every((rule) =>
        listing.description.rulesForGuests.some(
          (guestRule) => guestRule.name === rule
        )
      );
      return (
        matchesPropertyType &&
        matchesBedRooms &&
        matchesBeds &&
        matchesBathRooms &&
        matchesPrice &&
        hasAllAmenities &&
        hasAllRules &&
        matchesLocation &&
        matchesGuests &&
        !isUnavailable
      );
    });

    setFilteredData(filteredData);
    setCurrentPage(1);
  };

  const handleClearForm = () => {
    setForm({
      propertyType: "",
      bedRooms: 0,
      beds: 0,
      bathRooms: 0,
      minPrice: 0,
      maxPrice: sliderMaxPrice,
      amenities: form.amenities.map((amenity) => ({
        ...amenity,
        value: false,
      })),
      rules: form.rules.map((rule) => ({ ...rule, value: false })),
      location: "",
      dateRange: "",
      guests: 0,
    });

    setFilteredData(listingData);
  };

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const fetchStayListingData = async () => {
    try {
      const res = await fetch("/api/fetch-data/listing/search", {
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
      extractAmenitiesAndRules(data);

      const maxPrice = Math.max(
        ...data.map(
          (listing: Listing) => listing.description.pricing.basePriceForWeekdays
        )
      );
      setForm((prevForm) => ({
        ...prevForm,
        maxPrice: maxPrice,
      }));
      setSliderMaxPrice(maxPrice);

      const uniqueLocations = Array.from(
        new Set(data.map((listing: Listing) => listing.location))
      );
      const uniquePropertyTypes = Array.from(
        new Set(data.map((listing: Listing) => listing.propertyType))
      );

      setLocations(uniqueLocations as string[]);
      setPropertyTypes(uniquePropertyTypes as string[]);
    } catch (e) {
      console.error("An error occurred while fetching data:", e);
    }
  };

  const setSearchParams = () => {
    if (location) {
      setForm((prevForm) => ({
        ...prevForm,
        location: location,
      }));
    }
    if (guests) {
      setForm((prevForm) => ({
        ...prevForm,
        guests: parseInt(guests),
      }));
    }
    if (dateRange) {
      setForm((prevForm) => ({
        ...prevForm,
        dateRange: dateRange,
      }));
    }
  };

  const initialFetch = async () => {
    try {
      await fetchStayListingData();
      setSearchParams();
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  useEffect(() => {
    Notiflix.Loading.circle("Loading...");
    initialFetch().then(() => {
      Notiflix.Loading.remove();
    });
  }, []);

  useEffect(() => {
    handleSearch();
  }, [form]);

  const extractAmenitiesAndRules = (data: any[]) => {
    const amenitiesSet = new Set();
    const rulesSet = new Set();

    data.forEach(
      (item: {
        description: {
          amenities: { general: any[]; other: any[]; safety: any[] };
          rulesForGuests: any[];
        };
      }) => {
        item.description.amenities.general.forEach((amenity: unknown) =>
          amenitiesSet.add(amenity)
        );
        item.description.amenities.other.forEach((amenity: unknown) =>
          amenitiesSet.add(amenity)
        );
        item.description.amenities.safety.forEach((amenity: unknown) =>
          amenitiesSet.add(amenity)
        );
        item.description.rulesForGuests.forEach((rule: { name: unknown }) =>
          rulesSet.add(rule.name)
        );
      }
    );

    const amenities = Array.from(amenitiesSet).map((name) => ({
      name: name as string,
      value: false,
    }));
    const rules = Array.from(rulesSet).map((name) => ({
      name: name as string,
      value: false,
    }));

    setForm((prevForm) => ({
      ...prevForm,
      amenities,
      rules,
    }));
  };

  const currentItems = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const roomsAndBeds = [
    {
      name: "Bed Rooms",
      getterName: "bedRooms",
      getter: bedRoomsCount,
      setter: setBedRoomsCount,
    },
    {
      name: "Beds",
      getterName: "beds",
      getter: bedsCount,
      setter: setBedsCount,
    },
    {
      name: "Bath Rooms",
      getterName: "bathRooms",
      getter: bathRoomsCount,
      setter: setBathRoomsCount,
    },
  ];

  const router = useRouter();
  const handleSingleView = (id: any) => {
    router.push(`/stay/detail?id=${id}`);
  };

  const [isFlight, setIsFlight] = useState(false);
  
  return (
    <div className="w-full mx-auto">
      <div
        className={`w-full h-screen bg-white dark:bg-gray-900 fixed top-0 left-0 -z-20`}
      ></div>
      <Navigation />

      <div className="w-full max-w-[1300px] mx-auto px-6 md:px-24 xl:px-0 overflow-clip md:overflow-visible">
        {/* Hero Section */}
        <HeroSectionListing page="stay" isFlight={isFlight}/>

        <div className="mx-auto px-4 mt-20">
          <div className="pb-10 pg-title-container">
            <div>
              <h2 className="text-4xl font-semibold">Find Your Stay</h2>
            </div>
            <div className="flex items-center pt-2">
              <span className="text-sm font-light text-neutral-400">
              Discover Your Perfect Getaway, Find the Ideal Stay for Every Adventure!
              </span>
            </div>
          </div>
        </div>

        <Accordion className="px-4 mx-auto">
          <AccordionItem
            key={1}
            title="Filters"
            aria-label="Filters"
            className="bg-neutral-50 px-4 rounded-lg mt-8"
          >
            <div className="mx-autop-4 gap-4 items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 bg-white p-4 rounded-lg mb-3">
              <Autocomplete
                label={false}
                placeholder="Select Property Type"
                variant="flat"
                radius="full"
                isClearable={true}
                classNames={{ base: "rounded-full min-w-fit" }}
                onInputChange={(e) => {
                  handleFormChange({
                    target: { name: "propertyType", value: e },
                  });
                }}
                inputValue={form.propertyType}
              >
                {propertyTypes.map((item: string) => (
                  <AutocompleteItem key={item} value={item}>
                    {item}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              <Autocomplete
                label={false}
                placeholder="Select Location"
                variant="flat"
                radius="full"
                isClearable={true}
                classNames={{ base: "rounded-full min-w-fit" }}
                onInputChange={(e) => {
                  handleFormChange({ target: { name: "location", value: e } });
                }}
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
                    Rooms & Beds <BsChevronDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="grid grid-cols-1 gap-4 p-4">
                    {roomsAndBeds.map((item, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4">
                        <span>{item.name}</span>
                        <PlusMinus
                          getter={item.getter}
                          setter={item.setter}
                          handler={() => {
                            handleFormChange({
                              target: {
                                name: item.getterName,
                                value: item.getter + 1,
                              },
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button className="rounded-full flex justify-between  bg-neutral-100">
                    Check In & Out <BsChevronDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="shadow-none">
                  <div className="grid grid-cols-1 gap-4 p-4">
                    <RangeCalendar
                      showShadow={false}
                      className="shadow-none bg-transparent"
                      aria-label="Select a range"
                      visibleMonths={2}
                      color="primary"
                      onChange={(value) => {
                        const startDate = new Date(
                          value.start.year,
                          value.start.month - 1,
                          value.start.day
                        );
                        const endDate = new Date(
                          value.end.year,
                          value.end.month - 1,
                          value.end.day
                        );
                        const dateRange = `${
                          startDate.getMonth() + 1
                        }/${startDate.getDate()}/${startDate.getFullYear()} - ${
                          endDate.getMonth() + 1
                        }/${endDate.getDate()}/${endDate.getFullYear()}`;
                        setForm({ ...form, dateRange });
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              <GuestsDropDown
                arrowIcon={true}
                className="rounded-full px-4 py-2 bg-neutral-100"
                dropDownClassName="w-full"
                handler={(e: any) => {
                  handleFormChange(e);
                }}
                name="guests"
              />

              <Button
                className="rounded-full flex justify-between bg-neutral-100"
                onClick={() => setOtherFilters(true)}
              >
                Other Filters <BsChevronDown />
              </Button>
              <Modal
                isOpen={otherFilters}
                onClose={() => setOtherFilters(false)}
                scrollBehavior="inside"
                className="max-w-[1300px]"
              >
                <ModalContent>
                  <ModalHeader>
                    <p className="text-3xl">Other Filters</p>
                  </ModalHeader>
                  <ModalBody>
                    <Accordion defaultExpandedKeys={"1"}>
                      <AccordionItem
                        key={1}
                        title="Amenities"
                        aria-label="Amenities"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {form.amenities.map((item, index) => (
                            <Checkbox
                              checked={item.value}
                              isSelected={item.value}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  amenities: form.amenities.map(
                                    (amenity, i) => {
                                      if (i === index) {
                                        return {
                                          ...amenity,
                                          value: e.target.checked,
                                        };
                                      }
                                      return amenity;
                                    }
                                  ),
                                });
                              }}
                              key={index}
                              size="md"
                            >
                              <span>{item.name}</span>
                            </Checkbox>
                          ))}
                        </div>
                      </AccordionItem>
                      <AccordionItem key={2} title="Rules" aria-label="Rules">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {form.rules.map((item, index) => (
                            <Checkbox
                              checked={item.value}
                              isSelected={item.value}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  rules: form.rules.map((rule, i) => {
                                    if (i === index) {
                                      return {
                                        ...rule,
                                        value: e.target.checked,
                                      };
                                    }
                                    return rule;
                                  }),
                                });
                              }}
                              key={index}
                              size="md"
                            >
                              <span>{item.name}</span>
                            </Checkbox>
                          ))}
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      onClick={() => {
                        setForm({
                          ...form,
                          amenities: form.amenities.map((item) => {
                            return {
                              ...item,
                              value: false,
                            };
                          }),
                          rules: form.rules.map((item) => {
                            return {
                              ...item,
                              value: false,
                            };
                          }),
                        });
                      }}
                      color="default"
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={() => setOtherFilters(false)}
                      color="primary"
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

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
                  className="col-span-full"
                  onChange={(value: number | number[]) => {
                    if (Array.isArray(value)) {
                      setForm({
                        ...form,
                        minPrice: value[0],
                        maxPrice: value[1],
                      });
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
                  className="w-full md:w-fit min-w-20 rounded-full md:hidden"
                />
                <Input
                  type="number"
                  name="maxPrice"
                  label="Max Price"
                  value={form.maxPrice.toString()}
                  onChange={handleFormChange}
                  placeholder="Max Price"
                  className="w-full md:w-fit min-w-20 rounded-full"
                />
              </div>

              <Button
                onClick={handleSearch}
                className="rounded-full"
                color="primary"
              >
                Search
              </Button>
              <Button
                onClick={handleClearForm}
                className="rounded-full bg-white border border-primary"
              >
                Clear All
              </Button>
            </div>
          </AccordionItem>
        </Accordion>

        <div className="grid px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 max-w-[1300px] gap-10 mx-auto buttons-bar">
          {currentItems.map((item: any, index) => {
            // @ts-ignore
            return (
              <div key={index} className="grid-cols-1">
                <ListingCard
                  key={index}
                  className={"hidden"}
                  discount={10}
                  stockimg={item.coverImageRef}
                  cardTitle={item.placeName}
                  location={item.location}
                  option1={item.bedrooms + " Bed Rooms"}
                  option2={item.bathrooms + " Bath Rooms"}
                  price={item.description.pricing.basePriceForWeekdays}
                  rating={item.review}
                  ratingcount={100}
                  event={() => {
                    handleSingleView(item.id);
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="max-w-[1300px] mx-auto flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, index) => (
            <div
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-11 font-medium aspect-square rounded-full flex items-center justify-center cursor-pointer ${
                currentPage === index + 1
                  ? "bg-primary text-white"
                  : "bg-white border border-neutral-300 text-neutral-400"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <NewsLetter />
        <Footer setIsFlight={setIsFlight}/>
      </div>
    </div>
  );
};

export default Listing;
