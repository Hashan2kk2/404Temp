"use client"
import Image from "next/image";
import Logo from "@/assets/img/logo/logo.png";
import InputWLabel from "@/elements/InputWLabel";
import PrimaryButton from "@/elements/PrimaryButton";
import React, {useEffect, useState} from "react";
import SelectWLabel from "@/elements/SelectWLabel";
import Footer from "@/components/Footer";
import Notiflix from "notiflix";

const Page = () => {

    const [countries, setCountries] = useState([])
    const [languages, setLanguages] = useState([])
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        contact: '',
        country: '',
        language: ''
    });

    useEffect(() => {
        fetchCountries().then(r => r);
        fetchLanguages().then(r => r);
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

    const fetchLanguages = async () => {
        const tb = 'language';
        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tb: tb})
            });
            if (!response.ok) {
                throw new Error('Failed to fetch languages')
            }
            const data = await response.json();
            setLanguages(data);
        } catch (error: any) {
            console.error(error.message)
        }
    };

    const handleInputChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSignUp = async () => {
        if (formData.email === '' || formData.password === '' || formData.confirmPassword === '' || formData.country === '' || formData.language === '' || formData.firstName === '') {
            Notiflix.Notify.failure('All fields are required');
            return;
        } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
            Notiflix.Notify.failure('Invalid email address');
            return;
        } else if (formData.password !== formData.confirmPassword) {
            Notiflix.Notify.failure('Passwords do not match');
            return;
        } else if (formData.password.length < 6) {
            Notiflix.Notify.failure('Password must be at least 6 characters');
            return;
        } else {
            Notiflix.Loading.circle('Creating account...');
            try {

                const response = await fetch('/api/owner/sign-up', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const res = await response.json();
                Notiflix.Loading.remove();

                if (res.message === 'Success' && response.ok) {
                    Notiflix.Notify.success('Account created successfully');
                    const verificationData = {
                        email: formData.email,
                        verificationCode: '',
                    }
                    const response = await fetch('/api/owner/verification-code', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(verificationData)
                    });
                    const res = await response.json();
                    if (res.message === 'Success' && response.ok) {
                        Notiflix.Notify.success('Verification code sent to your email address');
                    } else {
                        Notiflix.Notify.failure('Failed to send verification code');
                    }

                    setTimeout(() => {
                        Notiflix.Confirm.prompt(
                            'Account Created',
                            'You have to verify your email address to continue',
                            '',
                            'Verify',
                            'Cancel',
                            async clientAnswer => {
                                if (clientAnswer) {
                                    verificationData.verificationCode = clientAnswer;
                                    Notiflix.Loading.circle('Verifying email...');
                                    try {
                                        const response = await fetch('/api/owner/verification-code', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(verificationData)
                                        });
                                        const res = await response.json();
                                        Notiflix.Loading.remove();
                                        if (res.message === 'Success' && response.ok) {
                                            Notiflix.Notify.success('Email verified successfully');
                                            setTimeout(() => {
                                                window.location.href = '/owner/sign-in';
                                            }, 1000);
                                        } else {
                                            Notiflix.Notify.failure('Invalid verification code');
                                        }
                                    } catch (error: any) {
                                        console.error(error.message)
                                    }
                                }
                            },
                            function () {
                                window.location.href = '/owner/sign-in';
                            }
                        )
                    }, 1000);

                } else {
                    Notiflix.Notify.failure(res.message);
                }

            } catch (error: any) {
                Notiflix.Notify.failure(error.message);
                Notiflix.Loading.remove();
            }
        }
    }

    const [isFlight, setIsFlight] = useState(false);

    return (
        <>
            <div className='w-full dark:bg-[#0f1623]'>
                <div className="max-w-[500px] w-full p-4 text-center mx-auto">
                    <Image aria-label="image" src={Logo} alt="logo" className="h-20 w-fit object-contain lg:mx-auto my-5"/>
                    <h2 className="text-3xl xl:text-4xl mb-4">Owner - Sign Up</h2>
                    <span className="text-neutral-400">Sign up to access your Privileges</span>

                    <div className="mt-8 flex flex-col gap-y-8">
                        <InputWLabel label={'First Name'} inputType={'text'} placeHolder={'John'}
                                     value={formData.firstName} handler={handleInputChange} name={'firstName'}/>
                        <InputWLabel label={'Last Name'} inputType={'text'} placeHolder={'Doe'}
                                     value={formData.lastName} handler={handleInputChange} name={'lastName'}/>
                        <InputWLabel label={'Email Address'} inputType={'email'} placeHolder={'example@gmail.com'}
                                     value={formData.email} handler={handleInputChange} name={'email'}/>
                        <InputWLabel label={'Password'} inputType={'password'} placeHolder={'********'}
                                     name={'password'}
                                     value={formData.password} handler={handleInputChange}/>
                        <InputWLabel label={'Confirm Password'} inputType={'password'} placeHolder={'********'}
                                     name={'confirmPassword'} value={formData.confirmPassword}
                                     handler={handleInputChange}/>
                        <InputWLabel label={'Contact'} inputType={'tel'} placeHolder={'### ## ## ###'}
                                     value={formData.contact} handler={handleInputChange} name={'contact'}/>
                        {/*@ts-ignore*/}
                        <SelectWLabel label={'Country'} options={countries}
                                      handler={handleInputChange} name={'country'}
                                      defaultSelectedItem={formData.country}/>
                        {/*@ts-ignore*/}
                        <SelectWLabel label={'Language'} options={languages}
                                      handler={handleInputChange} name={'language'}
                                      defaultSelectedItem={formData.language}/>
                        <PrimaryButton content={"Sign Up"} className="w-full" events={handleSignUp}/>
                        <span className="block w-fit mx-auto mt-4">Already have an account? <a aria-label="link" href="/owner/sign-in"
                                                                                               className="text-primary font-bold">Sign In</a></span>
                    </div>
                </div>
            </div>
            <Footer setIsFlight={setIsFlight}/>
        </>
    );
}

export default Page;