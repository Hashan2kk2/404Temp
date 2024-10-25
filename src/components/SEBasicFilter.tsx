import {BsCalendar4, BsGeoAlt, BsPersonPlus, BsSearch} from "react-icons/bs";
import PrimaryButton from "../elements/PrimaryButton";
import React, {useState} from "react";
import DateRangePick from "@/elements/DateRangePick";
import HomeFilterInput from "@/elements/HomeFilterInput";
import GuestsDropDown from "@/elements/GuestsDropDown";
import Notiflix from "notiflix";

const SEBasicFilter = ({dateRangeLabelText, type}: { dateRangeLabelText: string, type: string }) => {

    const [dateRangePickerCustom, setDateRangePickerCustom] = useState(false);

    const [formData, setFormData] = useState({
        location: '',
        dateRange: '',
        guests: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {

        const conditions = [];
        let baseUrl = "/stay/listing";

        if (formData.location === '' && formData.dateRange === '' && formData.guests === 0) {
            Notiflix.Notify.warning('Please select at least one filter');
        } else {
            if (formData.location !== '') conditions.push(`location=${formData.location}`);
            if (formData.dateRange !== '') conditions.push(`dateRange=${formData.dateRange}`);
            if (formData.guests !== 0) conditions.push(`guests=${formData.guests}`);

            if (conditions.length > 0) {
                baseUrl += `?${conditions.join('&')}`;
            }

            window.location.href = baseUrl;

        }

    }

    return (
        <>
            <div className="grid grid-cols-11 w-full gap-6">

                <div className="col-span-5 flex items-center border-r">
                    <BsGeoAlt className="text-3xl text-neutral-300"/>
                    <HomeFilterInput className="ps-4" placeholder="Location" label="Where are you going?"
                                     handler={handleChange} value={formData.location} name="location"/>
                </div>

                <div className="col-span-3 flex items-center border-r cursor-pointer"
                     onClick={() => {
                         setDateRangePickerCustom(!dateRangePickerCustom);
                     }}>
                    <BsCalendar4 className="text-4xl text-neutral-300"/>

                    <DateRangePick dateRangeLabelText={dateRangeLabelText}
                                   setDateRangePickerCustom={setDateRangePickerCustom}
                                   dateRangePickerCustom={dateRangePickerCustom} handler={handleChange}
                                   name="dateRange"/>

                </div>

                <div className="col-span-3 flex items-center">
                    <BsPersonPlus className="text-4xl text-neutral-300"/>
                    <div className="ps-4">
                        <GuestsDropDown arrowIcon={false} className="font-bold" dropDownClassName="mt-6"
                                        handler={handleChange} name="guests"/>
                        <span className="text-neutral-400">Guests</span>
                    </div>
                </div>

            </div>

            <PrimaryButton events={handleSubmit} content={<BsSearch className="text-xl -ms-2"/>}
                           className="aspect-square w-14"/>
        </>
    );
}

export default SEBasicFilter;