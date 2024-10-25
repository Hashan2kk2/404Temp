import SelectWLabel from "@/elements/SelectWLabel";
import InputWLabel from "@/elements/InputWLabel";
import React, { useEffect, useState } from "react";
import TextAreaWLabel from "@/elements/TextAreaWLabel";
import Notiflix from "notiflix";
import ImageUpload from "@/elements/ImageUpload";
import PrimaryButton from "@/elements/PrimaryButton";
import { Chip } from "@nextui-org/react";

interface FormData {
    vehicleType: number;
    transmissionType: number;
    fuelTypeId: number;
    engineCapacity: number;
    seatingCapacity: number;
    vehicleBrand: string;
    model: string;
    manufactureYear: number;
    luggageCapacity: number;
    location: string;
    districtId: number;
    availabilityId: number;
    ownerName: string;
    vehicleDescription: string;
    vehicleNumber: string;
    specialNote: string;
    images: File[];
    pricing: {
        basePrice1: string;
        basePrice2: string;
        basePrice3: string;
    };
    inclusions: string;
}

const RentalForm = ({
    fetchRentalData,
    isUpdate,
    rentalData,
    rentalImages,
    rentalId,
}: {
    fetchRentalData?: any;
    isUpdate?: boolean;
    rentalData?: any[];
    rentalImages?: any[];
    rentalId?: number;
}) => {
    const [formData, setFormData] = useState<FormData>({
        vehicleType: 0,
        transmissionType: 0,
        fuelTypeId: 0,
        engineCapacity: 0,
        seatingCapacity: 0,
        vehicleBrand: "",
        model: "",
        manufactureYear: 0,
        luggageCapacity: 0,
        location: "",
        districtId: 0,
        availabilityId: 0,
        ownerName: "",
        vehicleDescription: "",
        vehicleNumber: "",
        specialNote: "",
        images: [],
        pricing: {
            basePrice1: "",
            basePrice2: "",
            basePrice3: "",
        },
        inclusions: "",
    });

    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [transmissionTypes, setTransmissionTypes] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [inclusions, setInclusions] = useState("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [clearTrigger, setClearTrigger] = useState(false);

    const fetchList = [
        { setter: setVehicleTypes, table: "vehicle_type" },
        { setter: setTransmissionTypes, table: "transmission_type" },
        { setter: setFuelTypes, table: "fuel_type" },
        { setter: setDistricts, table: "district" },
        { setter: setCurrencies, table: "currency" },
        { setter: setAvailability, table: "availability" },
    ];

    useEffect(() => {
        fetchList.forEach((item) => {
            fetchData(item.table).then((r) => item.setter(r));
        });
        if (isUpdate) {
            handleUpdateForm();
        }
    }, []);

    const fetchData = async (table: string) => {
        try {
            const response = await fetch("/api/fetch-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tb: table }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            return await response.json();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleChange = (e: {
        target: { files: FileList | null; name: string; value: string };
    }) => {
        const { name, value, files } = e.target;

        if (files) {
            const fileArray = Array.from(files);
            setSelectedImages(fileArray);
            setFormData((prevState) => ({
                ...prevState,
                [name]: fileArray,
            }));
        } else {
            if (name.includes(".")) {
                const keys = name.split(".");
                setFormData((prevState) => ({
                    ...prevState,
                    [keys[0]]: {
                        ...(prevState as any)[keys[0]],
                        [keys[1]]: value,
                    },
                }));
            } else {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                }));
            }
        }
    };

    const handleImageRemove = (index: number) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
        setFormData((prevFormData) => ({
            ...prevFormData,
            images: updatedImages,
        }));
    };

    const handleAddInclusion = () => {
        if (inclusions.trim() !== "") {
            setFormData((prevState) => ({
                ...prevState,
                inclusions: prevState.inclusions
                    ? prevState.inclusions.concat(",", inclusions)
                    : inclusions,
            }));
            setInclusions("");
        } else {
            Notiflix.Notify.warning("Inclusion field is empty");
        }
    };

    const handleRemoveInclusion = (index: number) => {
        setFormData((prevState) => ({
            ...prevState,
            inclusions: prevState.inclusions
                .split(",")
                .filter((_, i) => i !== index)
                .join(","),
        }));
    };

    const handleSubmit = async () => {
        Notiflix.Loading.circle("Your request is processing");

        if (formData.images.length === 0) {
            Notiflix.Loading.remove();
            Notiflix.Notify.failure("Please upload at least one image");
            return;
        }

        if (
            !formData.vehicleType ||
            !formData.transmissionType ||
            !formData.fuelTypeId ||
            !formData.engineCapacity ||
            !formData.seatingCapacity ||
            !formData.vehicleBrand ||
            !formData.model ||
            !formData.manufactureYear ||
            !formData.luggageCapacity ||
            !formData.location ||
            !formData.districtId ||
            !formData.ownerName ||
            !formData.vehicleDescription ||
            !formData.specialNote ||
            !formData.pricing.basePrice1 ||
            !formData.pricing.basePrice2 ||
            !formData.pricing.basePrice3
        ) {
            Notiflix.Loading.remove();
            Notiflix.Notify.failure("Please fill all the fields");
            return;
        }

        try {
            const formDataObject = new FormData();
            for (const key in formData) {
                if (key === "pricing") {
                    formDataObject.append(key, JSON.stringify(formData[key]));
                } else if (key === "images") {
                    formData.images.forEach((file: File) => {
                        formDataObject.append("images", file);
                    });
                } else {
                    formDataObject.append(key, (formData as any)[key]);
                }
            }

            let url = "insert";
            if (isUpdate) {
                if (rentalId !== undefined) {
                    formDataObject.append("rentalId", rentalId.toString());
                }
                url = "update";
            }

            const response = await fetch("/api/rental/" + url, {
                method: "POST",
                body: formDataObject,
            });

            if (!response.ok) {
                Notiflix.Loading.remove();
                Notiflix.Notify.failure("Failed to insert data");
                throw new Error("Failed to insert data");
            }

            const res = await response.json();

            if (res === "Success" && !isUpdate) {
                Notiflix.Loading.remove();
                clearForm();
                setSelectedImages([]);
            }
            console.log(fetchRentalData);
            fetchRentalData('all');
            Notiflix.Loading.remove();
            Notiflix.Notify.success("Operation Successful");
        } catch (error) {
            console.error("Error:", error);
            Notiflix.Loading.remove();
            Notiflix.Notify.failure("Failed operation");
        }
    };

    const clearForm = () => {
        setSelectedImages([]);
        setClearTrigger((prev) => !prev);
        setFormData({
            vehicleType: 0,
            transmissionType: 0,
            fuelTypeId: 0,
            engineCapacity: 0,
            seatingCapacity: 0,
            vehicleBrand: "",
            model: "",
            manufactureYear: 0,
            luggageCapacity: 0,
            location: "",
            districtId: 0,
            availabilityId: 0,
            ownerName: "",
            vehicleDescription: "",
            vehicleNumber: "",
            specialNote: "",
            images: [],
            pricing: {
                basePrice1: "",
                basePrice2: "",
                basePrice3: "",
            },
            inclusions: "",
        });
    };

    const handleUpdateForm = () => {
        const updateFormData: FormData = { ...formData, images: [] as File[] };

        (rentalData ?? []).forEach((rental: any) => {
            if (rental.id === rentalId) {
                updateFormData.vehicleType = rental.vehicleType;
                updateFormData.transmissionType = rental.transmissionType;
                updateFormData.fuelTypeId = rental.fuel_type_id;
                updateFormData.engineCapacity = rental.engineCapacity;
                updateFormData.seatingCapacity = rental.seatingCapacity;
                updateFormData.vehicleBrand = rental.vehicleBrand;
                updateFormData.model = rental.model;
                updateFormData.manufactureYear = rental.manufactureYear;
                updateFormData.luggageCapacity = rental.luggageCapacity;
                updateFormData.location = rental.location;
                updateFormData.districtId = rental.district_id;
                updateFormData.availabilityId = rental.availability_id;
                updateFormData.ownerName = rental.ownerName;
                updateFormData.vehicleDescription = rental.vehicleDescription;
                updateFormData.vehicleNumber = rental.vehicleNumber;
                updateFormData.specialNote = rental.specialNote;
                updateFormData.pricing = rental.pricing;
                updateFormData.inclusions = rental.inclusions;
            }
        });

        const imagesForRental = (rentalImages ?? []).filter(
            (image: any) => image.vehicleId === rentalId
        );
        const convertUrlsToFiles = async () => {
            const fileList = await Promise.all(
                imagesForRental.map(async (image: any) => {
                    const response = await fetch(image.image);
                    const blob = await response.blob();
                    return new File([blob], image.image.split("/").pop() || "image");
                })
            );
            setSelectedImages(fileList);
            updateFormData.images = fileList;
            setFormData(updateFormData);
        };

        convertUrlsToFiles();
    };

    return (
        <div className="grid gap-6 mt-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <SelectWLabel
                label="Vehicle Type"
                options={vehicleTypes}
                defaultSelectedItem={formData.vehicleType.toString()}
                name="vehicleType"
                handler={handleChange}
                className=""
                clearTrigger={clearTrigger}
            />
            <SelectWLabel
                label="Transmission Type"
                options={transmissionTypes}
                defaultSelectedItem={formData.transmissionType.toString()}
                name="transmissionType"
                handler={handleChange}
                className=""
                clearTrigger={clearTrigger}
            />
            <SelectWLabel
                label="Fuel Type"
                options={fuelTypes}
                defaultSelectedItem={formData.fuelTypeId.toString()}
                name="fuelTypeId"
                handler={handleChange}
                className=""
                clearTrigger={clearTrigger}
            />
            <InputWLabel
                label="Engine Capacity"
                inputType="text"
                placeHolder="Engine Capacity"
                name="engineCapacity"
                value={formData.engineCapacity.toString()}
                handler={handleChange}
                className=""
            />
            <InputWLabel
                label="Year"
                inputType="text"
                placeHolder="Year"
                name="manufactureYear"
                value={formData.manufactureYear.toString()}
                handler={handleChange}
                className=""
            />
            <InputWLabel
                label="Brand"
                inputType="text"
                placeHolder="Brand"
                name="vehicleBrand"
                value={formData.vehicleBrand.toString()}
                handler={handleChange}
                className="col-span-2"
            />
            <InputWLabel
                label="Model"
                inputType="text"
                placeHolder="Model"
                name="model"
                value={formData.model.toString()}
                handler={handleChange}
                className="col-span-2"
            />
            <InputWLabel
                label="Vehicle Number"
                inputType="text"
                placeHolder="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber.toString()}
                handler={handleChange}
                className=""
            />
            <InputWLabel
                label="Location"
                inputType="text"
                placeHolder="Location"
                name="location"
                value={formData.location.toString()}
                handler={handleChange}
                className="col-span-2"
            />
            <SelectWLabel
                label="District"
                options={districts}
                defaultSelectedItem={formData.districtId.toString()}
                name="districtId"
                handler={handleChange}
                className=""
                clearTrigger={clearTrigger}
            />
            <InputWLabel
                label="Owner Name"
                inputType="text"
                placeHolder="Owner Name"
                name="ownerName"
                value={formData.ownerName.toString()}
                handler={handleChange}
                className="col-span-2"
            />
            <SelectWLabel
                label="Availability"
                options={availability}
                defaultSelectedItem={formData.availabilityId.toString()}
                name="availabilityId"
                handler={handleChange}
                className=""
                clearTrigger={clearTrigger}
            />
            <InputWLabel
                label="Seating Capacity"
                inputType="text"
                placeHolder="Seating Capacity"
                name="seatingCapacity"
                value={formData.seatingCapacity.toString()}
                handler={handleChange}
                className=""
            />
            <InputWLabel
                label="Luggage Capacity"
                inputType="text"
                placeHolder="Luggage Capacity"
                name="luggageCapacity"
                value={formData.luggageCapacity.toString()}
                handler={handleChange}
                className=""
            />
            <TextAreaWLabel
                label="Vehicle Description"
                rows={10}
                placeHolder="Vehicle Description"
                name="vehicleDescription"
                value={formData.vehicleDescription.toString()}
                handler={handleChange}
                className=""
            />
            <TextAreaWLabel
                label="Special Note"
                rows={5}
                placeHolder="Special Note"
                name="specialNote"
                value={formData.specialNote.toString()}
                handler={handleChange}
                className=""
            />
            <div className="col-span-full">
                <label className="text-[12px] font-bold ms-2 mb-2 block">
                    Upload Image
                </label>
                <ImageUpload
                    handler={handleChange}
                    name="images"
                    setSelectedImages={setSelectedImages}
                    selectedImages={selectedImages}
                    handleRemoveImage={handleImageRemove}
                    isMultiple={true}
                />
            </div>
            <div className="grid grid-cols-4 mt-4 gap-x-4 gap-y-6 col-span-full">
                <div className="mt-6 col-span-full">
                    <hr className="mt-4" />
                </div>
                <InputWLabel
                    label="Base Price (1 - 9 Days) ($)"
                    inputType="text"
                    placeHolder="$ 0.00"
                    name="pricing.basePrice1"
                    value={formData.pricing.basePrice1.toString()}
                    handler={handleChange}
                />
                <InputWLabel
                    label="Base Price (10 - 29 Days) ($)"
                    inputType="text"
                    placeHolder="$ 0.00"
                    name="pricing.basePrice2"
                    value={formData.pricing.basePrice2.toString()}
                    handler={handleChange}
                />
                <InputWLabel
                    label="More than month Price"
                    inputType="text"
                    placeHolder="$ 0.00"
                    name="pricing.basePrice3"
                    value={formData.pricing.basePrice3.toString()}
                    handler={handleChange}
                />
            </div>
            <div className="flex flex-col mt-6 col-span-full gap-y-6">
                <div className="flex flex-col">
                    <hr className="mt-4" />
                </div>
                <TextAreaWLabel
                    label="Inclusions"
                    rows={3}
                    placeHolder="Enter Inclusions"
                    value={inclusions}
                    handler={(e: any) => setInclusions(e.target.value)}
                    name="inclusions"
                />
                <button onClick={handleAddInclusion}>Add Inclusion</button>
                <div className={`flex gap-3 flex-wrap mt-5`}>
                    {formData.inclusions
                        .split(",")
                        .map((inclusion: any, index: number) => (
                            <Chip
                                key={index}
                                color="primary"
                                onClick={() => handleRemoveInclusion(index)}
                                className="cursor-pointer"
                            >
                                {inclusion}
                            </Chip>
                        ))}
                </div>
            </div>
            <PrimaryButton
                content="Submit"
                className="text-sm col-span-full w-fit"
                events={handleSubmit}
            />
        </div>
    );
};

export default RentalForm;
