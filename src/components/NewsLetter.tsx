"use client"
import {FaArrowRight} from "react-icons/fa6";
import Image from "next/image";
import NewsLetterImg from "@/assets/img/others/SVG-subcribe2.webp";
import React, {useRef} from "react";
import Notiflix from "notiflix";

const NewsLetter = () => {

    const newsletter = useRef(null);

    const handleSubmit = async () => {
        // @ts-ignore
        const email = newsletter.current.value;
        if (email === '') {
            Notiflix.Notify.failure('Please enter your email');
        } else {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email})
            });

            const respData = await response.json();

            if (respData.message==='Success') {
                Notiflix.Notify.success('Subscribed successfully');
            } else {
                Notiflix.Notify.failure(respData.message);
            }
        }
    }

    return (
        <>
            <div className="max-w-[1300px] px-4 mx-auto grid lg:grid-cols-2 items-center md:mt-28">
                <div className="lg:col-span-1">
                    <h2 className='text-4xl mt-20'>Join our newsletter 🎉</h2>
                    <p className='text-neutral-400 text-medium mt-5 pr-10'>Read and share new perspectives on just
                        about
                        any
                        topic. Everyone’s welcome.</p>
                    <div className="mt-8">
                        <div className='flex items-center my-2 gap-4 font-medium text-neutral-600'>
                            <p className='bg-[#dbeafe] text-primary py-1 px-3 rounded-full text-small w-fit'>01</p>
                            <span className="text-neutral-400">Get more discount</span>
                        </div>
                        <div className='flex items-center my-2 gap-4 font-medium text-neutral-600'>
                            <p className='bg-[#fee2e2] text-red-500 py-1 px-3 rounded-full text-small w-fit'>02</p>
                            <span className="text-neutral-400">Get premium magazines</span>
                        </div>
                        <div className='grid grid-cols-2'>
                            <div
                                className='col-span-full my-8 flex items-center justify-between py-2 px-4 border border-neutral-300 dark:border-neutral-500 rounded-full max-w-[400px]'>
                                <input ref={newsletter} type="text"
                                       className='text-small border-0 outline-none bg-transparent w-full me-4'
                                       placeholder='Enter your email'/>
                                <button className='text-white bg-primary p-2 rounded-full' onClick={handleSubmit}>
                                    <FaArrowRight/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="img col-span-full">
                        <Image aria-label="image" src={NewsLetterImg} alt="Subscribe Our News Letter"/>
                    </div>
                </div>

            </div>
        </>
    );
}

export default NewsLetter;