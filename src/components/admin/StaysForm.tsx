import ImageUpload from "@/elements/ImageUpload";
import InputWLabel from "@/elements/InputWLabel";
import Label from "@/elements/Label";
import PlusMinus from "@/elements/PlusMinus";
import PrimaryButton from "@/elements/PrimaryButton";
import SecondaryButton from "@/elements/SecondaryButton";
import SelectWLabel from "@/elements/SelectWLabel";
import TextAreaWLabel from "@/elements/TextAreaWLabel";
import { Button, Checkbox, Chip, DatePicker, Input, Radio, RadioGroup } from "@nextui-org/react";
import Notiflix from "notiflix";
import { useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";

const StayForm = (
    { id, country, propertyType, propertySizeType, allAmenities, rulesForGuests, reloadProperty }: { id: number, country: any[], propertyType: any[], propertySizeType: any[], allAmenities: any, rulesForGuests: any[], reloadProperty: any }
) => {

    const [property, setProperty] = useState({});
    const [propertyTypes, setPropertyTypes] = useState(propertyType);
    const [sizeTypes, setSizeTypes] = useState(propertySizeType);
    const [countryTypes, setCountryTypes] = useState(country);
    const [amenities, setAmenities] = useState({
        generalAmenities: allAmenities.generalAmenities,
        otherAmenities: allAmenities.otherAmenities,
        safetyAmenities: allAmenities.safetyAmenities
    });
    const [loading, setLoading] = useState(true);
    const [guestCount, setGuestCount] = useState(0);
    const [bedroomCount, setBedroomCount] = useState(0);
    const [bedCount, setBedCount] = useState(0);
    const [bathroomCount, setBathroomCount] = useState(0);
    const [kitchenCount, setKitchenCount] = useState(0);
    const [minNights, setMinNights] = useState(0);
    const [maxNights, setMaxNights] = useState(0);
    const [selectedCoverImage, setSelectedCoverImage] = useState<File[]>([]);
    const [selectedListingImages, setSelectedListingImages] = useState<File[]>([]);
    const [clearTrigger, setClearTrigger] = useState(false);
    const additionalRulesRef = useRef<HTMLInputElement>(null);

    interface FormData {
        propertyType: string;
        placeName: string;
        pickLocation: string;
        address: string;
        size: number;
        propertySizeType: string;
        location: string;
        country: string;
        guests: number;
        bedrooms: number;
        beds: number;
        bathrooms: number;
        kitchen: number;
        nightMin: number;
        nightMax: number;
        property_description: string;
        mapUrl: string;
        coverImageRef: File;
        availabilitySchedule: string[];
        propertyImages: File[];
        additionalRules: string[];
        description: {
            amenities: {
                general: string[];
                other: string[];
                safety: string[];
            };
            rulesForGuests: any[];
            pricing: {
                currency: string;
                basePriceForWeekdays: string;
                basePriceForWeekends: string;
                monthlyDiscount: string;
            };
        };
    }

    const [formData, setFormData] = useState<FormData>({
        propertyType: '',
        placeName: '',
        pickLocation: '',
        address: '',
        size: 0,
        propertySizeType: '',
        location: '',
        country: '',
        guests: 0,
        bedrooms: 0,
        beds: 0,
        bathrooms: 0,
        kitchen: 0,
        nightMin: 0,
        nightMax: 0,
        property_description: '',
        mapUrl: '',
        coverImageRef: new File([''], 'coverImg'),
        availabilitySchedule: [],
        propertyImages: [],
        additionalRules: [],
        description: {
            amenities: {
                general: [],
                other: [],
                safety: []
            },
            rulesForGuests: [],
            pricing: {
                currency: '1',
                basePriceForWeekdays: '',
                basePriceForWeekends: '',
                monthlyDiscount: ''
            }
        }
    });

    const fetchProperty = async () => {
        const response = await fetch('/api/fetch-data/stays', {
            method: 'POST',
            body: JSON.stringify({ id: id }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        setProperty(data);
    }

    const setPropertyData = async (data: any) => {
        setFormData({
            propertyType: data.propertyType,
            placeName: data.placeName,
            pickLocation: data.pickLocation,
            address: data.address,
            size: data.size,
            propertySizeType: data.propertySizeType,
            location: data.location,
            country: data.country,
            guests: data.guests,
            bedrooms: data.bedrooms,
            beds: data.beds,
            bathrooms: data.bathrooms,
            kitchen: data.kitchen,
            nightMin: data.nightMin,
            nightMax: data.nightMax,
            property_description: data.property_description,
            mapUrl: data.mapUrl,
            availabilitySchedule: data.availabilitySchedule ? data.availabilitySchedule.split(',') : [],
            coverImageRef: new File([''], 'coverImg'),
            propertyImages: [],
            description: data.description,
            additionalRules: data.additionalRules ? data.additionalRules.split(',') : []
        });

        const convertUrlsToFiles = async () => {
            const coverImage = await fetch(data.coverImageRef);
            const coverImageBlob = await coverImage.blob();
            const coverImageFile = new File([coverImageBlob], data.coverImageRef.split('/').pop() || 'coverImg');

            setSelectedCoverImage([coverImageFile]);

            const propertyImagesFiles = await Promise.all(
                data.images.map(async (image: any) => {
                    const propertyImage = await fetch(image.ref);
                    const propertyImageBlob = await propertyImage.blob();
                    return new File([propertyImageBlob], image.ref.split('/').pop() || 'propertyImg');
                })
            );

            setSelectedListingImages(propertyImagesFiles);

            // @ts-ignore
            setFormData((prevState) => ({
                ...prevState,
                coverImageRef: coverImageFile,
                propertyImages: propertyImagesFiles
            }));
        };
      
        convertUrlsToFiles();

        setGuestCount(data.guests);
        setBedroomCount(data.bedrooms);
        setBedCount(data.beds);
        setBathroomCount(data.bathrooms);
        setKitchenCount(data.kitchen);
        setMinNights(data.nightMin);
        setMaxNights(data.nightMax);
    }

    const handleChange = (e: { target: { files: FileList | null; name: string; value: any } }) => {
        const { name, value, files } = e.target;

        if (files) {
            
            if (name === 'coverImageRef') {
                // @ts-ignore
                setSelectedCoverImage(Array.from(files));
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: files[0],
                }));
            } else if (name === 'propertyImages') {
                const fileArray = Array.from(files);
                // @ts-ignore
                setSelectedListingImages(fileArray);
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: fileArray,
                }));
            }
        } else {
            setFormData((prevState) => {
                const updatedState = { ...prevState };

                if (name.includes('description')) {
                    if (name.includes('description.amenities')) {
                        const amenityType = name.split('.')[2];
                        const amenityName = value;
                        // @ts-ignore
                        if (!updatedState.description.amenities[amenityType].includes(amenityName)) {
                            // @ts-ignore
                            updatedState.description.amenities[amenityType].push(amenityName);
                        }
                    } else if (name.includes('description.rulesForGuests')) {
                        const ruleName = value.name;
                        const ruleValue = value.value;

                        const ruleIndex = updatedState.description.rulesForGuests.findIndex((rule: any) => rule.name === ruleName);

                        if (ruleIndex === -1) {
                            updatedState.description.rulesForGuests.push({ name: ruleName, value: ruleValue });
                        } else {
                            updatedState.description.rulesForGuests[ruleIndex].value = ruleValue;
                        }
                    } else if (name.includes('description.pricing')) {
                        const pricingType = name.split('.')[2];

                        updatedState.description.pricing[pricingType as keyof typeof updatedState.description.pricing] = value;
                    } else if (name === 'property_description') {
                        updatedState.property_description = value;
                    }
                } else {
                    if (name.includes(".")) {
                        const keys = name.split(".");
                        let nestedObject: any = updatedState;

                        for (let i = 0; i < keys.length - 1; i++) {
                            if (!nestedObject[keys[i]]) {
                                nestedObject[keys[i]] = {};
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

    const handleSubmit = async () => {
        Notiflix.Loading.pulse('Your Request is processing...');

        if (formData.propertyType === '' || formData.placeName === '' || formData.pickLocation === '' || formData.address === '' || formData.size === 0 || formData.propertySizeType === '' ||  formData.description.pricing.basePriceForWeekdays === '' || formData.description.pricing.basePriceForWeekends === '' || formData.description.pricing.monthlyDiscount === '') {
            Notiflix.Loading.remove();
            Notiflix.Notify.failure('Please fill in all required fields.');
            return;
        }

        const formDataObject = new FormData();
        for(const key in formData) {
            if (key === 'propertyImages') {
                formData.propertyImages.forEach((file: File, index: number) => {
                    formDataObject.append(key, file);
                });
            } else if (key === 'coverImageRef') {
                formDataObject.append(key, formData[key]);
            } else if(key === 'description') {
                formDataObject.append(key, JSON.stringify(formData[key]));
            }else {
                // @ts-ignore
                formDataObject.append(key, formData[key]);
            }
        }

        // @ts-ignore
        formDataObject.append('id', property.id);

        const response = await fetch('/api/add-listing/update', {
            method: 'PUT',
            body: formDataObject
        });

        const result = await response.json();

        if (result.message === 'success') {
            fetchProperty();
            reloadProperty();
            Notiflix.Loading.remove();
            Notiflix.Notify.success('Your property has been updated successfully.');
        } else {
            Notiflix.Loading.remove();
            Notiflix.Notify.failure('An error occurred while updating your property.');
        }

    };

    const removeCoverImage = (index: number) => {
        const updatedImages = Array.isArray(selectedCoverImage)
            ? selectedCoverImage.filter((_, i) => i !== index)
            : [];

        setSelectedCoverImage(updatedImages);

        // @ts-ignore
        setFormData(prevFormData => ({
            ...prevFormData,
            coverImageRef: updatedImages
        }));
    };

    const removeListingImages = (index: number) => {
        const updatedImages = Array.isArray(selectedListingImages)
            ? selectedListingImages.filter((_, i) => i !== index)
            : [];

        setSelectedListingImages(updatedImages);

        setFormData(prevFormData => ({
            ...prevFormData,
            propertyImages: updatedImages
        }));
    };

    useEffect(() => {
        fetchProperty()
    }, []);

    useEffect(() => {
        if (Object.keys(property).length > 0) {
            setPropertyData(property);
            setLoading(false);
        }
    }, [property]);

    return (
        <>
            <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-6">

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
                    label="Pick Location"
                    inputType="text"
                    placeHolder="Enter Location"
                    value={formData.pickLocation}
                    handler={handleChange}
                    name="pickLocation"
                />

                <InputWLabel
                    label="Address"
                    inputType="text"
                    placeHolder="Enter Address"
                    value={formData.address}
                    handler={handleChange}
                    name="address"
                    className="col-span-2"
                />

                <div className="flex gap-x-2">
                    {/* @ts-ignore */}
                    <InputWLabel label="Size" inputType="number" placeHolder="0.00" value={formData.size}
                        handler={handleChange} name="size" />
                    <SelectWLabel clearTrigger={clearTrigger} label="Size Type" options={sizeTypes}
                        handler={handleChange} name="propertySizeType"
                        defaultSelectedItem={formData.propertySizeType} />
                </div>

                <InputWLabel label={"Location"} inputType={"text"} placeHolder={"Enter Location"} value={formData.location} handler={handleChange} name={"location"} />

                <div className="flex gap-x-2">
                    <SelectWLabel clearTrigger={clearTrigger} label="Country" options={countryTypes}
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

                <TextAreaWLabel label={"Description"} rows={4} placeHolder={"Please Enter Your Description."} name={'property_description'} value={formData.property_description} handler={handleChange} />

                <TextAreaWLabel label={"Map URL"} rows={4} placeHolder={"Please Copy Map URl from the google map and Past it here"} name={'mapUrl'} value={formData.mapUrl} handler={handleChange} />

                {formData.mapUrl && (
                    <iframe src={formData.mapUrl} className="col-span-full rounded-lg overflow-clip" width="100%" height="400" style={{ border: 0 }} allowFullScreen={true} loading="lazy"></iframe>
                )}

            </div>
            <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-6">
                <div className='mt-6 col-span-full'>
                    <h1>Amenities</h1>
                    <hr className='mt-4' />
                </div>
                <div className='flex flex-col gap-5'>
                    <h2 className={`w-full`}>General Amenities</h2>
                    {amenities.generalAmenities.map((amenity: any) => (
                        <Checkbox size={"sm"} key={amenity.name}
                            isSelected={formData.description.amenities.general.includes(amenity.name)}
                            onChange={
                                (e) => {
                                    handleChange({
                                        target: {
                                            name: 'description.amenities.general',
                                            value: amenity.name,
                                            files: null
                                        }
                                    })
                                }
                            }
                            value={amenity.name}
                            name={'description.amenities.general'}>{amenity.name}</Checkbox>
                    ))}
                </div>
                <div className='flex flex-col gap-5'>
                    <h2 className={`w-full`}>Other Amenities</h2>
                    {amenities.otherAmenities.map((amenity: any) => (
                        <Checkbox size={"sm"} key={amenity.name}
                            isSelected={formData.description.amenities.other.includes(amenity.name)}
                            onClick={(e) => {
                                handleChange({
                                    target: {
                                        name: 'description.amenities.other',
                                        value: amenity.name,
                                        files: null
                                    }

                                })
                            }
                            }>{amenity.name}</Checkbox>
                    ))}
                </div>
                <div className='flex flex-col gap-5'>
                    <h2 className={`w-full`}>Safety Amenities</h2>
                    {amenities.safetyAmenities.map((amenity: any) => (
                        <Checkbox size={"sm"} key={amenity.name}
                            isSelected={formData.description.amenities.safety.includes(amenity.name)}
                            onClick={(e) => {
                                handleChange({
                                    target: {
                                        name: 'description.amenities.safety',
                                        value: amenity.name,
                                        files: null
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
                {(rulesForGuests).map((rule, index) => (
                    <div key={index}>
                        <RadioGroup
                            size={"sm"}
                            label={rule.name}
                            value={formData.description.rulesForGuests.find((r: any) => r.name === rule.name)?.value}
                            onChange={(e) => {
                                handleChange({
                                    target: {
                                        name: `description.rulesForGuests.${rule.name}`,
                                        value: e.target.value,
                                        files: null
                                    }
                                });
                            }}
                        >
                            <Radio value="Allow">Allow</Radio>
                            <Radio value="Charge">Charge</Radio>
                            <Radio value="Do Not Allow">Do Not Allow</Radio>
                        </RadioGroup>
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
                            const rule = additionalRulesRef.current?.value;

                            if (rule) {
                                setFormData((prevState) => ({
                                    ...prevState,
                                    additionalRules: [...prevState.additionalRules, rule],
                                }));

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

                                            const isDateSelected = formData.availabilitySchedule.includes(formattedDate);

                                            if (!isDateSelected) {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    availabilitySchedule: [...prevState.availabilitySchedule, formattedDate]
                                                }));
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
                                        const slots = formData.availabilitySchedule.filter((_, i) => i !== index);
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            availabilitySchedule: slots
                                        }));
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
                {/*@ts-ignore*/}
                <InputWLabel label={"Base Prices (Monday - Thursday) ($)"} inputType={"text"}
                    placeHolder={"$ 0.00"}
                    value={formData.description.pricing.basePriceForWeekdays}
                    handler={handleChange} name={'description.pricing.basePriceForWeekdays'} />
                <InputWLabel label={"Base Prices (Friday - Sunday) ($)"} inputType={"text"}
                    placeHolder={"$ 0.00"}
                    value={formData.description.pricing.basePriceForWeekends}
                    handler={handleChange} name={'description.pricing.basePriceForWeekends'} />
                <InputWLabel label={"Long Term Price (Monthly Discount)"} inputType={"text"}
                    placeHolder={"% 0.00"} value={formData.description.pricing.monthlyDiscount}
                    handler={handleChange} name={'description.pricing.monthlyDiscount'}
                    className={'col-span-2'} />.
            </div>

            <div className="grid grid-cols-2 mt-4 gap-x-4 gap-y-6">
                <PrimaryButton className="" content={"Save"} events={() => {
                    handleSubmit();
                }} />
                <SecondaryButton className="" content={"Cancel"} events={() => { console.log('Cancel') }} />
            </div>

        </>
    );
}

export default StayForm;