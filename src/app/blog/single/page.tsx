"use client";
import Navigation from "@/components/Navigation";
import React, { useState } from "react";
import {BsFacebook, BsInstagram, BsTwitter, BsYoutube} from "react-icons/bs";
import tempImg from "@/assets/img/blog/img.png";
import Image from "next/image";

import im1 from "@/assets/img/blog/pexels-photo-3935702.webp";
import im2 from "@/assets/img/blog/pexels-photo-3218718.webp";
import im3 from "@/assets/img/blog/pexels-photo-3155666.webp";
import im4 from "@/assets/img/blog/pexels-photo-8241135.webp";
import Footer from "@/components/Footer";

const BlogSingle = () => {

    const profilePicture = "https://images.pexels.com/photos/2033896/pexels-photo-2033896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"

    const [isFlight, setIsFlight] = useState(false);

    return (
        <>
            <Navigation/>

            <div
                className={`w-full max-w-[1300px] flex flex-col justify-center items-center mx-auto gap-y-8 px-10 mt-10`}>

                <div className={`w-full max-w-[800px] flex flex-col gap-y-8`}>
                    <button
                        className={`w-fit text-center text-sm rounded-full py-1 px-2 bg-purple-100 text-purple-800 hover:text-white hover:bg-purple-800 transition-colors duration-300`}>Traveler
                    </button>
                    <h1 className={`text-5xl font-semibold`}>Keep up the spirit of the desire to travel around the
                        world</h1>
                    <p className={`text-neutral-700`}>We’re an online magazine dedicated to covering the best in
                        international product design. We started as a little blog back in 2002 covering student work and
                        over time</p>
                    <hr className={`bg-neutral-100`}/>
                    <div
                        className={`w-full flex items-start sm:items-center justify-start sm:justify-between flex-col sm:flex-row gap-y-5`}>
                        <div className={`flex items-center justify-start gap-x-2`}>
                            <img aria-label="image"  src={profilePicture} alt="placeholder"
                                 className={`object-cover rounded-full w-12 h-12`}/>
                            <div className={`flex flex-col`}>
                                <p>Fones Mimi</p>
                                <small className={`text-neutral-600 text-nowrap`}>May 20, 2021·6 min read</small>
                            </div>
                        </div>
                        <div className={`flex justify-center items-center gap-x-5 text-lg`}>
                            <BsFacebook/>
                            <BsTwitter/>
                            <BsInstagram/>
                            <BsYoutube/>
                        </div>
                    </div>
                </div>

                <Image aria-label="image" src={tempImg} className={`w-full h-full object-cover rounded-lg aspect-video`} alt={''}/>

                <div className={`w-full max-w-[800px] flex flex-col gap-y-8`}>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure vel officiis ipsum placeat itaque
                        neque dolorem modi perspiciatis dolor distinctio veritatis sapiente, minima corrupti dolores
                        necessitatibus suscipit accusantium dignissimos culpa cumque.</p>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page
                        when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
                        distribution of letters.</p>
                    <h2 className={`text-2xl`}>Typography should be easy</h2>
                    <p>So that&apos;s a header for you — with any luck if we&apos;ve done our job correctly that will
                        look pretty
                        reasonable.</p>
                    <p>Something a wise person once told me about typography is:</p>
                </div>

                <div className={`w-full max-w-[800px] flex flex-col gap-y-8`}>
                    <Image aria-label="image" src={tempImg} alt="placeholder"
                           className={`w-full h-full object-cover rounded-lg aspect-video`}/>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page
                        when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
                        distribution of letters.</p>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page
                        when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
                        distribution of letters.</p>

                    <h2 className={`text-2xl`}>Typography should be easy</h2>
                    <p>So that&apos;s a header for you — with any luck if we&apos;ve done our job correctly that will
                        look pretty
                        reasonable.</p>
                    <p>Something a wise person once told me about typography is:</p>

                    <h2 className={`text-2xl`}>Code should look okay by default.</h2>

                    <p>I think most people are going to use highlight.js or Prism or something if they want to style
                        their code blocks but it wouldn&apos;t hurt to make them look okay out of the box, even with no
                        syntax highlighting.</p>
                    <p>What I&apos;ve written here is probably long enough, but adding this final sentence can&apos;t
                        hurt.</p>
                    <p>Hopefully that looks good enough to you.</p>

                    <h2 className={`text-2xl`}>We still need to think about stacked headings though.</h2>
                    <p> Phew, with any luck we have styled the headings above this text and they look pretty good.</p>
                </div>

                <div className={`w-full max-w-[800px] flex items-center justify-start gap-x-2`}>
                    <button
                        className={`font-light border border-neutral-100 text-sm hover:border-neutral-200 transition duration-300 bg-transparent px-3 py-2 rounded-lg`}>Garden
                    </button>
                    <button
                        className={`font-light border border-neutral-100 text-sm hover:border-neutral-200 transition duration-300 bg-transparent px-3 py-2 rounded-lg`}>Jewelry
                    </button>
                    <button
                        className={`font-light border border-neutral-100 text-sm hover:border-neutral-200 transition duration-300 bg-transparent px-3 py-2 rounded-lg`}>Tools
                    </button>
                </div>

                <hr className={`bg-neutral-100`}/>

                <div className={`w-full max-w-[800px] flex flex-col gap-y-8`}>
                    <div className={`flex items-center justify-start gap-x-2`}>
                        <img aria-label="image"  src={profilePicture} alt="placeholder"
                             className={`object-cover rounded-full w-20 h-20 aspect-square`}/>
                        <div className={`flex flex-col`}>
                            <small className={`capitalize text-neutral-700`}>WRITEN BY</small>
                            <p>Fones Mimi</p>
                            <p className={`text-neutral-600`}>There’s no stopping the tech giant. Apple now
                                opens its 100th store in China.There’s no stopping the tech giant. <a
                                    className={`text-purple-600`} href={"/"}>Read
                                    More</a></p>
                        </div>
                    </div>
                </div>

            </div>

            <div className={`w-full h-auto bg-gray-100 py-32 my-20`}>
                <div
                    className={`w-full max-w-[1300px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto gap-8 px-10`}>

                    <h2 className={`text-3xl col-span-full text-start`}>Related Posts</h2>

                    <div
                        className={`w-full max-w-[800px] relative overflow-clip rounded-2xl aspect-video-vertical-portrait`}>
                        <Image aria-label="image" src={im1} alt="placeholder"
                               className={`w-full h-full object-cover rounded-lg absolute top-0 left-0 hover:scale-105 transition duration-300 origin-center z-0`}/>
                        <div
                            className={`w-full h-1/2 bg-gradient-to-t from-neutral-900 to-transparent z-10 bottom-0 left-0 absolute`}></div>
                        <div className={`w-full h-full p-3 flex flex-col items-start justify-end gap-y-3 text-white`}>
                            <button
                                className={`text-sm px-3 py-1 rounded-full bg-blue-200 text-blue-700 w-fit z-20`}>Categories
                            </button>
                            <h3 className={`text-lg z-20`}>Keep up the spirit of the desire to travel around the
                                world</h3>
                            <div className={`flex gap-x-3 justify-start items-center z-20`}>
                                <small>
                                    Foulcher Nathanil
                                </small>
                                <small className={`text-xs text-neutral-300`}>
                                    May 20, 2021
                                </small>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`w-full max-w-[800px] relative overflow-clip rounded-2xl aspect-video-vertical-portrait`}>
                        <Image aria-label="image" src={im2} alt="placeholder"
                               className={`w-full h-full object-cover rounded-lg absolute top-0 left-0 hover:scale-105 transition duration-300 origin-center z-0`}/>
                        <div
                            className={`w-full h-1/2 bg-gradient-to-t from-neutral-900 to-transparent z-10 bottom-0 left-0 absolute`}></div>
                        <div className={`w-full h-full p-3 flex flex-col items-start justify-end gap-y-3 text-white`}>
                            <button
                                className={`text-sm px-3 py-1 rounded-full bg-blue-200 text-blue-700 w-fit z-20`}>Categories
                            </button>
                            <h3 className={`text-lg z-20`}>Keep up the spirit of the desire to travel around the
                                world</h3>
                            <div className={`flex gap-x-3 justify-start items-center z-20`}>
                                <small>
                                    Foulcher Nathanil
                                </small>
                                <small className={`text-xs text-neutral-300`}>
                                    May 20, 2021
                                </small>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`w-full max-w-[800px] relative overflow-clip rounded-2xl aspect-video-vertical-portrait`}>
                        <Image aria-label="image" src={im3} alt="placeholder"
                               className={`w-full h-full object-cover rounded-lg absolute top-0 left-0 hover:scale-105 transition duration-300 origin-center z-0`}/>
                        <div
                            className={`w-full h-1/2 bg-gradient-to-t from-neutral-900 to-transparent z-10 bottom-0 left-0 absolute`}></div>
                        <div className={`w-full h-full p-3 flex flex-col items-start justify-end gap-y-3 text-white`}>
                            <button
                                className={`text-sm px-3 py-1 rounded-full bg-blue-200 text-blue-700 w-fit z-20`}>Categories
                            </button>
                            <h3 className={`text-lg z-20`}>Keep up the spirit of the desire to travel around the
                                world</h3>
                            <div className={`flex gap-x-3 justify-start items-center z-20`}>
                                <small>
                                    Foulcher Nathanil
                                </small>
                                <small className={`text-xs text-neutral-300`}>
                                    May 20, 2021
                                </small>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`w-full max-w-[800px] relative overflow-clip rounded-2xl aspect-video-vertical-portrait`}>
                        <Image aria-label="image" src={im4} alt="placeholder"
                               className={`w-full h-full object-cover rounded-lg absolute top-0 left-0 hover:scale-105 transition duration-300 origin-center z-0`}/>
                        <div
                            className={`w-full h-1/2 bg-gradient-to-t from-neutral-900 to-transparent z-10 bottom-0 left-0 absolute`}></div>
                        <div className={`w-full h-full p-3 flex flex-col items-start justify-end gap-y-3 text-white`}>
                            <button
                                className={`text-sm px-3 py-1 rounded-full bg-blue-200 text-blue-700 w-fit z-20`}>Categories
                            </button>
                            <h3 className={`text-lg z-20`}>Keep up the spirit of the desire to travel around the
                                world</h3>
                            <div className={`flex gap-x-3 justify-start items-center z-20`}>
                                <small>
                                    Foulcher Nathanil
                                </small>
                                <small className={`text-xs text-neutral-300`}>
                                    May 20, 2021
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer setIsFlight={setIsFlight}/>
        </>
    )
}

export default BlogSingle;