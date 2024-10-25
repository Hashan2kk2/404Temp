'use client';
import React from 'react';
import Notiflix from 'notiflix';
import InputWLabel from "@/elements/InputWLabel";
import PrimaryButton from "@/elements/PrimaryButton";
import Footer from "@/components/Footer";
import {Spinner} from "@nextui-org/react";
import useFetchUser from "@/hooks/auth";
import {BiSolidHome} from 'react-icons/bi';


const Page = () => {

    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });

    const loading = useFetchUser();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSignIn = async () => {
        if (!formData.email || !formData.password) {
            Notiflix.Notify.failure('Please fill in all fields');
            return;
        } else {
            Notiflix.Loading.pulse('Signing in...');
            try {
                const response = await fetch('/api/sign-in', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const res = await response.json();
                Notiflix.Loading.remove();
                if (res.message === 'success' && response.ok) {
                    Notiflix.Notify.success('Signed in successfully');
                    Notiflix.Loading.circle('Redirecting...');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    if (res.message === 'notactivated') {
                        Notiflix.Notify.failure('Account not activated, please check your email');

                        const verificationData = {
                            email: formData.email,
                            verificationCode: '',
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
                                                Notiflix.Loading.circle('Redirecting...');
                                                setTimeout(() => {
                                                    window.location.href = '/';
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

                    } else if (res.message === 'banned') {
                        Notiflix.Notify.failure('Account banned, please contact support');
                        Notiflix.Loading.circle('Redirecting...');
                        setTimeout(() => {
                            window.location.href = '/contact-us';
                        }, 2000);
                    } else {
                        Notiflix.Notify.failure('Invalid email or password');
                        Notiflix.Loading.remove();
                    }
                }
            } catch (error: any) {
                Notiflix.Notify.failure(error.message);
                Notiflix.Loading.remove();
            }
        }
    }

    return (
        loading ? (
            <Spinner size={'lg'} className={`top-5 left-5`} classNames={{
                circle2: 'text-primary',
            }}/>
        ) : (
                <div className='dark:bg-[#0f1623]'>
                    
                <a className="bg-primary text-white p-3 text-xl text-center rounded-full fixed top-3 left-3" href="/"><BiSolidHome/></a>

                <div className="max-w-[500px] p-4 mx-auto my-20 text-center">
                    <h2 className="text-3xl xl:text-4xl mb-4">Sign In to 404 Travels</h2>
                    <span className="text-neutral-400">Sign in to start booking your next trip</span>

                    <div className="mt-8 flex flex-col gap-y-8">
                        <InputWLabel label={'Email Address'} inputType={'email'} placeHolder={'example@gmail.com'}
                                     value={formData.email} handler={handleInputChange} name={'email'}/>

                        <InputWLabel label={'Password'} inputType={'password'} placeHolder={'********'} name={'password'}
                                     value={formData.password} handler={handleInputChange}/>
                        <a aria-label="link" href="/forgot-password" className="text-primary text-sm cursor-pointer text-start -mt-5">Forgot password?</a>
                        <PrimaryButton content={"Sign In"} className="w-full" events={handleSignIn}/>
                        <span className="block w-fit mx-auto">New user? <a aria-label="link" href="/sign-up"
                                className="text-primary font-bold cursor-pointer">Create an account</a></span>
                            <span className="block w-fit mx-auto -mt-6">Want to list your property? <a aria-label="link" href="owner/sign-in"
                                className="text-primary font-bold cursor-pointer">Sign in here</a></span>
                    </div>
                </div>
            </div>
        )
    );
}

export default Page;
