'use client';
import React, {useState} from "react";
import PrimaryButton from "@/elements/PrimaryButton";
import InputWLabel from "@/elements/InputWLabel";
import Notiflix from "notiflix";
import SecondaryButton from "@/elements/SecondaryButton";

const Page = () => {
    const [stage, setStage] = useState(1);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value);
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

    const handleVerificationCodeSubmit = async () => {
        if (!email) {
            Notiflix.Notify.failure('Please enter your email');
        } else {
            try {
                Notiflix.Loading.pulse('Sending verification code');
                await sendVerificationCode(email);
                Notiflix.Loading.remove();
            } catch (e) {
                console.error(e);
            }
        }
    }
    const sendVerificationCode = async (email: string) => {
        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email, name: 'User'})
            });

            const res = await response.json();

            if (res.message === 'success') {
                setStage(2);
                Notiflix.Notify.success('Verification code sent successfully');
            } else {
                Notiflix.Notify.failure('Failed to send verification code');
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleNewPasswordSubmit = async () => {
        if (!verificationCode) {
            Notiflix.Notify.failure('Please enter the verification code');
        } else if (!newPassword) {
            Notiflix.Notify.failure('Please enter your new password');
        } else if (!confirmPassword) {
            Notiflix.Notify.failure('Please confirm your new password');
        } else if (newPassword !== confirmPassword) {
            Notiflix.Notify.failure('Passwords do not match');
        } else {
            try {
                Notiflix.Loading.pulse('Resetting password');
                await resetPassword(email, verificationCode, newPassword);
                Notiflix.Loading.remove();
            } catch (e) {
                console.error(e);
            }
        }
    }
    const resetPassword = async (email: string, verificationCode: string, newPassword: string) => {
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email, verificationCode: verificationCode, newPassword: newPassword})
            });

            const res = await response.json();

            if (res.message === 'success') {
                setStage(3);
                Notiflix.Notify.success('Password reset successfully');
            } else {
                Notiflix.Notify.failure('Failed to reset password');
            }
        } catch (e) {
            console.error(e);
        }
    }

    const renderStage = () => {
        switch (stage) {
            case 1:
                return (
                    <div className="mt-8 flex flex-col gap-y-8">
                        <InputWLabel label={'Email Address'} inputType={'email'} placeHolder={'example@gmail.com'}
                                     value={email} handler={handleEmailChange} name={"email"}/>
                        <PrimaryButton content={"Reset Password"} className={`w-full`} events={handleVerificationCodeSubmit}/>
                    </div>
                );
            case 2:
                return (
                    <div className="mt-8 flex flex-col gap-y-8">
                        <InputWLabel label={'Verification Code'} inputType={'text'} placeHolder={'123456'}
                                     value={verificationCode} handler={handleVerificationCodeChange} name={"verificationCode"}/>
                        <InputWLabel label={'New Password'} inputType={'password'} placeHolder={'********'}
                                     value={newPassword} handler={handleNewPasswordChange} name={"newPassword"}/>
                        <InputWLabel label={'Confirm Password'} inputType={'password'} placeHolder={'********'}
                                     value={confirmPassword} handler={handleConfirmPasswordChange} name={"confirmPassword"}/>
                        <div className={`w-full flex gap-x-3`}>
                            <SecondaryButton content={"Resend Code"} className={`w-fit text-nowrap`} events={handleVerificationCodeSubmit}/>
                            <PrimaryButton content={"Reset Password"} className={`w-full`} events={handleNewPasswordSubmit}/>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="mt-8 flex flex-col gap-y-8">
                        <span className="text-2xl text-primary">Password reset successful</span>
                        <span className="text-neutral-400">You can now sign in with your new password</span>
                        <PrimaryButton content={"Sign In"} className={`w-full`} events={() => window.location.href = '/sign-in'}/>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className='dark:bg-[#0f1623] min-h-screen w-full flex justify-center items-center'>
                <div className="max-w-[500px] p-4 text-center w-full -mt-20">
                    <h2 className="text-3xl xl:text-4xl mb-4">Reset Password</h2>
                    <span className="text-neutral-400">Enter your email address to reset your password</span>
                    {renderStage()}
                </div>
            </div>
        </>
    );
}

export default Page;