'use client';
import React, {useEffect, useState} from 'react';
import Footer from "@/components/Footer";
import PrimaryButton from "@/elements/PrimaryButton";
import InputWLabel from "@/elements/InputWLabel";
import SelectWLabel from "@/elements/SelectWLabel";
import Notiflix from 'notiflix';


const Page = () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetchCountries();
        fetchLanguages();
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [countries, setCountries] = useState([])

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

    const [languages, setLanguages] = useState([])

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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        language: '',
        firstName: ''
    });

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleRegister = async () => {

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
                const response = await fetch('/api/sign-up', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const res = await response.json();
                Notiflix.Loading.remove();
                if (res.message === 'success' && response.ok) {
                    Notiflix.Notify.success('Account created successfully');
                    const verificationData = {
                        email: formData.email,
                        verificationCode: '',
                        name: formData.firstName,
                    }
                    try {
                        const response = await fetch('/api/verification-code', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(verificationData)
                        });
                        const res = await response.json();
                        if (res.message === 'success' && response.ok) {
                            Notiflix.Notify.success('Verification code sent to your email address');
                        } else {
                            Notiflix.Notify.failure('Failed to send verification code');
                        }
                    } catch (error: any) {
                        console.error(error.message)
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
                                        const response = await fetch('/api/verification-code', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(verificationData)
                                        });
                                        const res = await response.json();
                                        Notiflix.Loading.remove();
                                        if (res.message === 'success' && response.ok) {
                                            Notiflix.Notify.success('Email verified successfully');
                                            setTimeout(() => {
                                                window.location.href = '/sign-in';
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
                                window.location.href = '/sign-in';
                            }
                        )
                    }, 1000);

                } else {
                    Notiflix.Notify.failure(res.message);
                }
            } catch (error: any) {
                console.error(error.message)
            }
        }

    }

    const [isFlight, setIsFlight] = useState(false);

    return (
        <div className='w-full dark:bg-[#0f1623]'>
            <div className="max-w-[500px] p-4 mx-auto my-20 text-center">
                <h2 className="text-3xl xl:text-4xl mb-4">Sign Up to 404 Travels</h2>
                <span className="text-neutral-400">Create an account to start booking your next trip</span>

                <div className={`flex flex-col gap-y-8 mt-8`}>
                    <InputWLabel label={'Email Address'} inputType={'email'} placeHolder={'example@gmail.com'}
                                 value={formData.email} handler={handleInputChange} name={'email'}/>
                    <InputWLabel label={'firstName'} inputType={'text'} placeHolder={'John'}
                                 value={formData.firstName} handler={handleInputChange} name={'firstName'}/>
                    {/*@ts-ignore*/}
                    <SelectWLabel label={'Country'} options={countries}
                                  handler={handleInputChange} name={'country'} defaultSelectedItem={formData.country}/>
                    <SelectWLabel label={'Language'} options={languages}
                                  handler={handleInputChange} name={'language'} defaultSelectedItem={formData.language}/>
                    <InputWLabel label={'Password'} inputType={'password'} placeHolder={'********'} name={'password'}
                                 value={formData.password} handler={handleInputChange}/>
                    <InputWLabel label={'Confirm Password'} inputType={'password'} placeHolder={'********'}
                                 name={'confirmPassword'} value={formData.confirmPassword}
                                 handler={handleInputChange}/>
                </div>
                <PrimaryButton content={'Register'} className={'w-full mt-8'} events={handleRegister}/>
                <span className="block w-fit mx-auto mt-4">Already have an account? <a aria-label="link" href="/sign-in"
                                                                                       className="text-primary font-bold">Sign In</a></span>
            </div>
            <Footer setIsFlight={setIsFlight}/>
        </div>
    )
}


export default Page;

