"use client"
import Image from "next/image";
import Logo from "@/assets/img/logo/logo.png";
import InputWLabel from "@/elements/InputWLabel";
import PrimaryButton from "@/elements/PrimaryButton";
import React, {useState} from "react";
import Notiflix from "notiflix";
import useFetchUser from "@/hooks/auth";
import {Spinner} from "@nextui-org/react";
import {BiSolidHome} from "react-icons/bi";

const Page = () => {

    const loading = useFetchUser();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSignIn = async () => {

        if (formData.email === '' || formData.password === '') {
            alert('Please fill all the fields');
            return;
        } else {
            Notiflix.Loading.pulse('Signing in...');

            try {
                const response = await fetch('/api/owner/sign-in', {
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
                            const response = await fetch('/api/owner/verification-code', {
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
                                            const response = await fetch('/api/owner/verification-code', {
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
                                    window.location.href = '/owner/sign-in';
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
                <div>
                    
                <a className="bg-primary text-white p-3 text-xl text-center rounded-full fixed top-3 left-3" href="/"><BiSolidHome/></a>
                    
                <div className='dark:bg-[#0f1623] min-h-screen flex justify-center items-center'>
                    <div className="max-w-[500px] w-full p-4 text-center -mt-24">
                        <Image aria-label="image" src={Logo} alt="logo" className="h-20 w-fit object-contain lg:mx-auto my-5"/>
                        <h2 className="text-3xl xl:text-4xl mb-4">Owner - Sign In</h2>
                        <span className="text-neutral-400">Sign in to access your Privileges</span>

                        <div className="mt-8 flex flex-col gap-y-8">
                            <InputWLabel label={'Email Address'} inputType={'email'} placeHolder={'example@gmail.com'}
                                         value={formData.email} handler={handleInputChange} name={'email'}/>

                            <InputWLabel label={'Password'} inputType={'password'} placeHolder={'********'}
                                         name={'password'}
                                         value={formData.password} handler={handleInputChange}/>

                            <PrimaryButton content={"Sign In"} className="w-full" events={handleSignIn}/>
                            <span className="block w-fit mx-auto mt-4">New User ? <a aria-label="link" href="/owner/sign-up"
                                                                                     className="text-primary font-bold">Sign Up</a></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default Page;