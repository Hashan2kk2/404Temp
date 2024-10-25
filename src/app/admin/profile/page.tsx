"use client"
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import InputWLabel from "@/elements/InputWLabel";
import {useEffect, useState} from "react";
import PrimaryButton from "@/elements/PrimaryButton";
import SecondaryButton from "@/elements/SecondaryButton";
import {Divider} from "@nextui-org/react";
import Notiflix from "notiflix";

const Page = () => {
    const [userDetails, setuserDetails] = useState({});
    const [resetPassword, setResetPassword] = useState({});

    const [passwordSection, setPasswordSection] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/admin/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to fetch user', errorData);
                throw new Error(`Failed to fetch user: ${errorData?.error || response.statusText}`);
            }
            const data = await response.json();

            try {
                const response = await fetch('/api/admin/profile/fetch-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email: data.email, id: data.id})
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to fetch user', errorData);
                    throw new Error(`Failed to fetch user: ${errorData?.error || response.statusText}`);
                }
                const userData = await response.json();
                setuserDetails(userData);
                Notiflix.Loading.remove();
            } catch (error) {
                console.error('Failed to fetch user', error || response.statusText);
            }

        } catch (error) {
            console.error('Failed to fetch user', error);
            Notiflix.Notify.failure('You are not logged in');
            Notiflix.Loading.circle('Redirecting to login page');
            setTimeout(() => {
                window.location.href = '/admin/sign-in';
            }, 2000);
        }
    };

    useEffect(() => {
        Notiflix.Loading.circle('Fetching user data');
        fetchUser().then(() => {
            Notiflix.Loading.remove();
        });

    }, []);

    const changeHandler = (e: any) => {
        let {name, value} = e.target;

        if (name.includes('Password')) {
            setResetPassword((prevState: any) => ({
                ...prevState,
                [name]: value
            }));
            return;
        }

        if (name === 'email') {
            Notiflix.Notify.failure('Email cannot be changed');
            return;
        }

        setuserDetails((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    }

    const submitHandler = async () => {
        try {
            setuserDetails((prevState: any) => ({
                ...prevState,
                ['password']: 'false'
            }));
            const response = await fetch('/api/admin/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails)
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to update user', errorData);
                throw new Error(`Failed to update user: ${errorData.message}`);
            }
            Notiflix.Notify.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update user', error);
            Notiflix.Notify.failure(`Failed to update profile ${error}`);
        }
    }

    const submitPasswordHandler = async () => {
        // @ts-ignore
        if (resetPassword['newPassword'] !== resetPassword['confirmPassword']) {
            Notiflix.Notify.failure('Passwords do not match');
            return;
            // @ts-ignore
        } else if (resetPassword['newPassword'].isEmpty) {
            Notiflix.Notify.failure('Password cannot be empty');
            return;
        }
        // @ts-ignore
        else if (resetPassword['newPassword'].length < 8) {
            Notiflix.Notify.failure('Password must be at least 8 characters');
            return;
            // @ts-ignore
        } else if (resetPassword['newPassword'] === resetPassword['currentPassword']) {
            Notiflix.Notify.failure('New password must be different from current password');
            return;
        } else {
            try {

                setResetPassword((prevState: any) => ({
                    ...prevState,
                    // @ts-ignore
                    ['id']: userDetails['id'],
                    // @ts-ignore
                    ['email']: userDetails['email'],
                    ['password']: 'true'
                }));

                const response = await fetch('/api/admin/profile/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(resetPassword)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to update user', errorData);
                    throw new Error(`Failed to update user: ${errorData?.error || response.statusText}`);
                }
                Notiflix.Notify.success('Password updated successfully');
            } catch (error) {
                console.error('Failed to update user', error);
                Notiflix.Notify.failure('Failed to update password');
            }
        }
    }

    const [isFlight, setIsFlight] = useState(false);

    return (
        <>
            <Navigation/>
            <div className={`w-full h-auto`}>
                <div className={`w-full max-w-[1000px] mx-auto p-5`}>
                    <div className={`w-full p-5 rounded-2xl border`}>

                        <h1 className={`text-2xl text-center`}>
                            Account Information
                        </h1>

                        <Divider className={'my-5'}/>

                        {passwordSection ? (
                            <div className={`grid grid-cols-1 gap-5`}>
                                {/*@ts-ignore*/}
                                <InputWLabel placeHolder={'*****'} name={'currentPassword'} label={'Current Password'} inputType={'password'} handler={changeHandler} value={resetPassword['currentPassword']}/>
                                {/*@ts-ignore*/}
                                <InputWLabel placeHolder={'*****'} name={'newPassword'} label={'New Password'} inputType={'password'} handler={changeHandler} value={resetPassword['newPassword']}/>
                                {/*@ts-ignore*/}
                                <InputWLabel placeHolder={'*****'} name={'confirmPassword'} label={'Confirm Password'} inputType={'password'} handler={changeHandler} value={resetPassword['confirmPassword']}/>
                            </div>
                        ) : (
                            <div className={`w-full`}>
                                <p className={`text-xl py-5`}>
                                    {/*@ts-ignore*/}
                                    Hello {userDetails['name']}
                                </p>
                                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5`}>
                                    {/*@ts-ignore*/}
                                    <InputWLabel label={'Name'} inputType={'text'} placeHolder={'Name'} handler={changeHandler} name={'name'} value={userDetails['name']}/>
                                    {/*@ts-ignore*/}
                                    <InputWLabel label={'Email Address'} inputType={'email'} placeHolder={'Email Address'} handler={changeHandler} name={'email'} value={userDetails['email']}/>
                                </div>
                            </div>
                        )}

                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5`}>
                            {
                                passwordSection ? (
                                    <PrimaryButton content={'Update Password'} events={submitPasswordHandler} className={''}/>
                                ) : (
                                    <PrimaryButton content={'Update'} events={submitHandler} className={''}/>
                                )
                            }
                            <SecondaryButton content={passwordSection ? 'Back' : 'Change Password'} events={() => {
                                setPasswordSection(!passwordSection);
                            }} className={''}/>
                        </div>

                    </div>
                </div>
            </div>
            <Footer setIsFlight={setIsFlight}/>
        </>

    )
        ;
}
export default Page;