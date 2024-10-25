import SelectWLabel from "@/elements/SelectWLabel";
import InputWLabel from "@/elements/InputWLabel";
import React, { useEffect, useState } from "react";
import TextAreaWLabel from "@/elements/TextAreaWLabel";
import ImageUpload from "@/elements/ImageUpload";
import PrimaryButton from "@/elements/PrimaryButton";
import Notiflix from "notiflix";

const TourForm = ({
  fetchTourData,
  isUpdate,
  tourData,
  tourImages,
  tourId,
}: {
  fetchTourData?: any;
  isUpdate?: boolean;
  tourData?: [];
  tourImages?: [];
  tourId?: number;
}) => {
  const [tourTypes, setTourTypes] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [tourCategories, setTourCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    tourType: "",
    tourCategory: "",
    location: "",
    host: "",
    noOfNights: "",
    languages: "",
    description: {
      des: "",
      cancellationPolicy: "",
      guestRequirement: "",
      whatToBring: "",
      specialNote: "",
      pax: "",
    },
    image: [],
    inclusionsExclusions: {
      inclusions: "",
      exclusions: "",
    },
    price: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);

  const [clearTrigger, setClearTrigger] = useState(false);

  useEffect(() => {
    fetchTourTypes().then((r) => r);
    fetchLanguages().then((r) => r);
    fetchTourCategories().then((r) => r);
    if (isUpdate) {
      handleUpdateForm();
    }
  }, []);

  const fetchTourTypes = async () => {
    const tb = "tour_type";
    try {
      const response = await fetch("/api/fetch-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tb: tb }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch-data fetch-data types");
      }
      const data = await response.json();
      setTourTypes(data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchLanguages = async () => {
    const tb = "language";
    try {
      const response = await fetch("/api/fetch-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tb: tb }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch-data languages");
      }
      const data = await response.json();
      setLanguages(data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchTourCategories = async () => {
    const tb = "tour_category";
    try {
      const response = await fetch("/api/fetch-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tb: tb }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch-data tour categories");
      }
      const data = await response.json();
      setTourCategories(data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleChange = (e: {
    target: { files: FileList | null; name: string; value: string };
  }) => {
    const { name, value, files } = e.target;

    if (files) {
      const fileArray = Array.from(files);
      // @ts-ignore
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
            // @ts-ignore
            ...prevState[keys[0]],
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
    const updatedImages = Array.isArray(selectedImages)
      ? selectedImages.filter((_, i) => i !== index)
      : [];

    setSelectedImages(updatedImages);

    setFormData((prevFormData) => ({
      ...prevFormData,
      image: updatedImages,
    }));
  };

  const handleSubmit = async () => {
    Notiflix.Loading.circle("Your request is processing");

    if (formData.image.length === 0) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure("Please upload an image");
      return;
    }

    if (
      !formData.title ||
      !formData.tourType ||
      !formData.tourCategory ||
      !formData.location ||
      !formData.host ||
      !formData.noOfNights ||
      !formData.languages ||
      !formData.description.des ||
      !formData.description.cancellationPolicy ||
      !formData.description.guestRequirement ||
      !formData.description.whatToBring ||
      !formData.description.specialNote ||
      !formData.description.pax ||
      !formData.inclusionsExclusions.inclusions ||
      !formData.inclusionsExclusions.exclusions ||
      !formData.price
    ) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure("Please fill all fields");
      return;
    }

    try {
      const formDataObject = new FormData();
      for (const key in formData) {
        if (key === "description" || key === "inclusionsExclusions") {
          formDataObject.append(key, JSON.stringify(formData[key]));
        } else if (key === "image") {
          formData.image.forEach((file: File, index: number) => {
            formDataObject.append("image", file);
          });
        } else {
          // @ts-ignore
          formDataObject.append(key, formData[key]);
        }
      }

      let url = "insert";

      if (isUpdate) {
        // @ts-ignore
        formDataObject.append("tourId", tourId);
        url = "update";
      }
      const response = await fetch("/api/tour/" + url, {
        method: "POST",
        body: formDataObject,
      });

      if (!response.ok) {
        Notiflix.Loading.remove();
        Notiflix.Notify.failure("Failed operation");
        throw new Error("Failed operation");
      }

      const res = await response.json();

      if (res === "Success" && !isUpdate) {
        Notiflix.Loading.remove();
        clearForm();
        setSelectedImages([]);
      }

      fetchTourData();
      Notiflix.Loading.remove();
      Notiflix.Notify.success("Operation Successful");
    } catch (error: any) {
      console.error(error.message);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure("Failed operation");
    }
  };

  const clearForm = () => {
    setSelectedImages([]);
    setClearTrigger((prev) => !prev);
    setFormData({
      title: "",
      tourType: "",
      tourCategory: "",
      location: "",
      host: "",
      noOfNights: "",
      languages: "",
      description: {
        des: "",
        cancellationPolicy: "",
        guestRequirement: "",
        whatToBring: "",
        specialNote: "",
        pax: "",
      },
      image: [],
      inclusionsExclusions: {
        inclusions: "",
        exclusions: "",
      },
      price: "",
    });
  };

  const handleUpdateForm = () => {
    const updateFromData = { ...formData, image: [] };

    // @ts-ignore
    tourData.filter((tour: any) => {
      if (tour.id === tourId) {
        updateFromData.title = tour.title;
        updateFromData.tourType = tour.tourType;
        updateFromData.tourCategory = tour.tourCategoryId;
        updateFromData.location = tour.location;
        updateFromData.host = tour.host;
        updateFromData.noOfNights = tour.noOfNight;
        updateFromData.languages = tour.language;
        updateFromData.description = {
          des: tour.description.des,
          cancellationPolicy: tour.description.cancellationPolicy,
          guestRequirement: tour.description.guestRequirement,
          whatToBring: tour.description.whatToBring,
          specialNote: tour.description.specialNote,
          pax: tour.description.pax,
        };
        updateFromData.inclusionsExclusions = {
          inclusions: tour.inclusions_exclusions.inclusions,
          exclusions: tour.inclusions_exclusions.exclusions,
        };
        updateFromData.price = tour.price;
      }
    });

    // @ts-ignore
    const imagesForTour = tourImages.filter((image) => image.tourId === tourId);
    const convertUrlsToFiles = async () => {
      const fileList = await Promise.all(
        imagesForTour.map(async (image) => {
          // @ts-ignore
          const response = await fetch(image.image);
          const blob = await response.blob();
          // @ts-ignore
          return new File([blob], image.image.split("/").pop() || "image");
        })
      );
      // @ts-ignore
      setSelectedImages(fileList);
      // @ts-ignore
      updateFromData.image = fileList;
      setFormData(updateFromData);
    };

    convertUrlsToFiles();
  };

  return (
    <div className="grid gap-6 mt-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <InputWLabel
        label="Title"
        inputType="text"
        placeHolder="Enter Title"
        value={formData.title}
        handler={handleChange}
        name="title"
        className={""}
      />
      {/*@ts-ignore*/}
      <SelectWLabel
        label="Tour Type"
        options={tourTypes}
        handler={handleChange}
        name="tourType"
        defaultSelectedItem={formData.tourType}
        clearTrigger={clearTrigger}
      />
      {/*@ts-ignore*/}
      <SelectWLabel
        label="Tour Category"
        options={tourCategories}
        handler={handleChange}
        name="tourCategory"
        defaultSelectedItem={formData.tourCategory}
        clearTrigger={clearTrigger}
      />
      <InputWLabel
        label="Location"
        inputType="text"
        placeHolder="Enter Location"
        value={formData.location}
        handler={handleChange}
        name="location"
      />
      <InputWLabel
        label="No of Nights"
        inputType="number"
        placeHolder="Enter No of Nights"
        value={formData.noOfNights}
        handler={handleChange}
        name="noOfNights"
      />
      <InputWLabel
        label="Host"
        inputType="text"
        placeHolder="Enter Host"
        value={formData.host}
        handler={handleChange}
        name="host"
      />
      <InputWLabel
        label="PAX"
        inputType="text"
        placeHolder="Enter PAX"
        value={formData.description.pax}
        handler={handleChange}
        name="description.pax"
      />
      {/*@ts-ignore*/}
      <SelectWLabel
        label="Language"
        options={languages}
        handler={handleChange}
        name="languages"
        defaultSelectedItem={formData.languages}
        clearTrigger={clearTrigger}
      />
      <TextAreaWLabel
        label="Description"
        rows={5}
        placeHolder="Enter Description"
        value={formData.description.des}
        handler={handleChange}
        name="description.des"
      />
      <div className="col-span-full">
        <label className="text-[12px] font-bold ms-2 mb-2 block">
          Upload Image
        </label>
        <ImageUpload
          handler={handleChange}
          name="image"
          setSelectedImages={setSelectedImages}
          selectedImages={selectedImages}
          handleRemoveImage={handleImageRemove}
          isMultiple={true}
        />
      </div>
      <TextAreaWLabel
        label="Inclusions"
        rows={3}
        placeHolder="Enter Inclusions"
        value={formData.inclusionsExclusions.inclusions}
        handler={handleChange}
        name="inclusionsExclusions.inclusions"
      />
      <TextAreaWLabel
        label="Exclusions"
        rows={3}
        placeHolder="Enter Exclusions"
        value={formData.inclusionsExclusions.exclusions}
        handler={handleChange}
        name="inclusionsExclusions.exclusions"
      />
      <TextAreaWLabel
        label="Cancellation Policy"
        rows={5}
        placeHolder="Enter Cancellation Policy"
        value={formData.description.cancellationPolicy}
        handler={handleChange}
        name="description.cancellationPolicy"
      />
      <TextAreaWLabel
        label="Guest Requirement"
        rows={5}
        placeHolder="Enter Guest Requirement"
        value={formData.description.guestRequirement}
        handler={handleChange}
        name="description.guestRequirement"
      />
      <TextAreaWLabel
        label="What to Bring"
        rows={5}
        placeHolder="What to Bring"
        value={formData.description.whatToBring}
        handler={handleChange}
        name="description.whatToBring"
      />
      <TextAreaWLabel
        label="Special Note"
        rows={5}
        placeHolder="Enter Special Note"
        value={formData.description.specialNote}
        handler={handleChange}
        name="description.specialNote"
      />
      <InputWLabel
        label="Price ($)"
        inputType="text"
        placeHolder="$ 0.00"
        value={formData.price}
        handler={handleChange}
        name="price"
      />
      <PrimaryButton
        content="Submit"
        className="text-sm col-span-full w-fit"
        events={handleSubmit}
      />
    </div>
  );
};

export default TourForm;
