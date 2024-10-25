import SelectWLabel from "@/elements/SelectWLabel";
import React, {useEffect, useState} from "react";
import {DatePicker} from "@nextui-org/react";
import InputWLabel from "@/elements/InputWLabel";
import TextAreaWLabel from "@/elements/TextAreaWLabel";
import PrimaryButton from "@/elements/PrimaryButton";
import Notiflix from "notiflix";

const CustomizeTrip = () => {

    const [countries, setCountries] = useState([])
    const [destinations, setDestinations] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        destination: '',
        durationFrom: '',
        durationTo: '',
        email: '',
        phone: '',
        notes: '',
        country: ''
    });

    useEffect(() => {
        fetchCountries().then(r => r);
        fetchDestinations().then(r => r);
    }, []);

    const fetchCountries = async () => {
        const tb = 'country';
        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tb: tb})
            });
            if (!response.ok) {
                throw new Error('Failed to fetch countries')
            }
            const data = await response.json();
            setCountries(data);
        } catch (error: any) {
            console.error(error.message)
        }
    };

    const fetchDestinations = async () => {
        const tb = 'destination';
        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tb: tb})
            });
            if (!response.ok) {
                throw new Error('Failed to fetch destinations')
            }
            const data = await response.json();
            setDestinations(data);
        } catch (error: any) {
            console.error(error.message)
        }
    }

    const handleInputChange = (e: any) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async () => {

        Notiflix.Loading.circle('Submitting...');

        try {
            const response = await fetch('/api/customize-trip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to submit the form')
            }
            const resp = await response.json();
            if (resp.message === 'Success') {
                const response = await fetch('https://formsubmit.co/ajax/vidhuraneethika000@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        // @ts-ignore
                        destination: destinations.find((d: any) => d.id.toString() === formData.destination).name,
                        durationFrom: formData.durationFrom,
                        durationTo: formData.durationTo,
                        email: formData.email,
                        phone: formData.phone,
                        notes: formData.notes,
                        // @ts-ignore
                        country: countries.find((c: any) => c.id.toString() === formData.country).name,
                        _template: 'table'
                    })
                });
                if (!response.ok) {
                    Notiflix.Notify.success('Successfully submitted');
                }
                Notiflix.Loading.remove();
            }
        } catch (error: any) {
            Notiflix.Loading.remove();
            Notiflix.Notify.failure('Failed to submit the form');
        }
    }

    return (
        <div className="w-full">
            <h2 className="mt-12 text-3xl text-center">Customize a Trip</h2>
            <hr className="mt-4 mb-12"/>
            <div className="mt-4 grid grid-cols-3 gap-4">
                <InputWLabel label={'Name'} inputType={'text'} placeHolder={'John'}
                             value={formData.name} handler={handleInputChange} name={'name'}/>

                <InputWLabel label={'Email Address'} inputType={'email'} placeHolder={'example@gmail.com'}
                             value={formData.email} handler={handleInputChange} name={'email'}/>

                {/*@ts-ignore*/}
                <SelectWLabel label={'Country'} options={countries}
                              handler={handleInputChange} name={'country'}
                              defaultSelectedItem={formData.country}/>

                {/*@ts-ignore*/}
                <SelectWLabel label={'Destinations'} options={destinations}
                              handler={handleInputChange} name={'destination'}
                              defaultSelectedItem={formData.destination}/>

                <DatePicker showMonthAndYearPickers={true} name={'durationFrom'} label={'Duration From'}
                            onChange={(e) => {
                                handleInputChange({
                                    target: {
                                        name: 'durationFrom',
                                        value: e.year + '-' + e.month + '-' + e.day
                                    }
                                });
                            }} labelPlacement={'outside'}/>

                <DatePicker showMonthAndYearPickers={true} name={'durationTo'} label={'Duration To'} onChange={(e) => {
                    handleInputChange({target: {name: 'durationTo', value: e.year + '-' + e.month + '-' + e.day}});
                }} labelPlacement={'outside'}/>

                <InputWLabel label={'Phone Number'} inputType={'tel'} placeHolder={'## ## ## ###'}
                             value={formData.phone} handler={handleInputChange} name={'phone'}/>

                <TextAreaWLabel label={'Notes'} placeHolder={'Any additional information you would like to provide'}
                                value={formData.notes} handler={handleInputChange} name={'notes'} rows={10}/>

                <PrimaryButton content="Submit" className={'mx-auto col-span-full mt-4'} events={handleSubmit}/>

            </div>
        </div>
    )
}

export default CustomizeTrip;