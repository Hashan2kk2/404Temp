"use client";
import Navigation from "@/components/Navigation";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import tempImg from "@/assets/img/blog/pexels-photo-3935702.webp";
import Image from "next/image";
import {BsDot, BsFacebook, BsInstagram, BsLinkedin, BsPlay, BsTwitter} from "react-icons/bs";
import Pagination from "@/components/Pagination";

const profilePicture = "https://images.pexels.com/photos/2033896/pexels-photo-2033896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"

const blogPosts = [
    {
        title: "Microsoft announces a five-year commitment to create bigger opportunities for people with disabilities",
        description: "Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
        tag: {content: "Tag 1", color: "red"},
        other: {author: "Foulcher Nathanil", date: "May 20, 2021"}
    },
    {
        title: "360-degree video: How Microsoft deployed a datacenter to the bottom of the ocean",
        description: "We’re an online magazine dedicated to covering the best in international product design. We have a passion for the new, innovative, unique and undiscovered. With our eyes firmly focused on the future.",
        tag: {content: "Tag 2", color: "blue"},
        other: {author: "Foulcher Nathanil", date: "May 20, 2021"}
    },
    {
        title: "To cool datacenter servers, Microsoft turns to boiling liquid",
        description: "We’re an online magazine dedicated to covering the best in international product design. We have a passion for the new, innovative, unique and undiscovered. With our eyes firmly focused on the future.",
        tag: {content: "Tag 3", color: "green"},
        other: {author: "Foulcher Nathanil", date: "May 20, 2021"}
    },
    {
        title: "Xbox connects people to help through Crisis Text Line",
        description: "We’re an online magazine dedicated to covering the best in international product design. We have a passion for the new, innovative, unique and undiscovered. With our eyes firmly focused on the future.",
        tag: {content: "Tag 4", color: "yellow"},
        other: {author: "Foulcher Nathanil", date: "May 20, 2021"}
    },
    {
        title: "Unusual ‘machine in the woods’ taps clean energy deep underground for new Microsoft",
        description: "We’re an online magazine dedicated to covering the best in international product design. We have a passion for the new, innovative, unique and undiscovered. With our eyes firmly focused on the future.",
        tag: {content: "Tag 5", color: "purple"},
        other: {author: "Foulcher Nathanil", date: "May 20, 2021"}
    },
    {
        title: "WNBA’s Sabrina Ionescu teams up with Xbox to empower young girls to pursue their hoop dreams",
        description: "We’re an online magazine dedicated to covering the best in international product design. We have a passion for the new, innovative, unique and undiscovered. With our eyes firmly focused on the future.",
        tag: {content: "Tag 6", color: "gray"},
        other: {author: "Foulcher Nathanil", date: "May 20, 2021"}
    }
]

const AuthorFooter = ({author, date}: {
    author?: string,
    date?: string
}) => {
    return (
        <div className={`w-fit h-auto flex gap-2 items-center justify-starts text-sm`}>
            <img aria-label="image"  src={profilePicture} alt={`profile`}
                 className={`w-7 h-7 min-w-7 min-h-7 rounded-full hidden sm:block`}/>
            <p className={`text-gray-500 font-medium hidden sm:block`}>{author}</p>
            <BsDot className={`hidden sm:block`}/>
            <p className={`text-gray-400`}>{date}</p>
        </div>
    )
}

const RecentPost = ({title, description, author, date, tag, tagStatus}: {
    title?: string,
    description?: string,
    author?: string,
    date?: string,
    tag?: { content: string, color: string },
    tagStatus?: boolean
}) => {
    return (
        <div className={`w-full flex items-center justify-between gap-x-3`}>
            <div className={`w-2/3 py-2 flex flex-col gap-y-3`}>
                {tagStatus && <div className={`w-full justify-start items-center`}>
                    <button className={`text-${tag?.color}-600 bg-${tag?.color}-100 px-3 py-1 rounded-full text-xs`}>
                        {tag?.content}
                    </button>
                </div>}
                <a aria-label="link" href={''} className={`text-lg font-medium line-clamp-2`}>{title}</a>
                <div className={`hidden sm:block`}>
                    <p className={`text-gray-500 line-clamp-2`}>{description}</p>
                </div>
                <AuthorFooter author={author} date={date}/>
            </div>
            <a aria-label="link" href={''} className={`h-full w-1/3 aspect-video rounded-2xl overflow-clip relative`}>
                <Image aria-label="image" src={tempImg} alt={`blog`} layout={`cover`}
                       className={`w-full h-full absolute left-0 top-0 object-cover`}/>
                <div
                    className={`absolute bottom-3 left-3 text-white h-8 w-8 flex justify-center items-center backdrop-blur-sm backdrop-brightness-75 rounded-full text-lg border-white border`}>
                    <BsPlay/>
                </div>
            </a>
        </div>
    )
}

const Blog = () => {

    const [isFlight, setIsFlight] = useState(false);

    return (
        <>
            <Navigation/>

            <div
                className={`w-full max-w-[1300px] flex flex-col justify-center items-center mx-auto gap-y-16 px-10 my-10`}>

                <div className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10`}>
                    <div className={`w-full flex flex-col gap-y-4`}>
                        <div className={`w-full relative overflow-clip rounded-2xl aspect-video-horizontal-portrait`}>
                            <Image aria-label="image" src={tempImg} alt={`blog`} layout={`cover`}
                                   className={`w-full h-full object-cover`}/>
                            <div className={`absolute top-3 right-3 flex flex-col gap-y-2`}>
                                <button
                                    className={`text-gray-600 bg-white w-7 h-7 rounded-full flex justify-center items-center text-xs`}>
                                    <BsFacebook/>
                                </button>
                                <button
                                    className={`text-gray-600 bg-white w-7 h-7 rounded-full flex justify-center items-center text-xs`}>
                                    <BsTwitter/>
                                </button>
                                <button
                                    className={`text-gray-600 bg-white w-7 h-7 rounded-full flex justify-center items-center text-xs`}>
                                    <BsLinkedin/>
                                </button>
                                <button
                                    className={`text-gray-600 bg-white w-7 h-7 rounded-full flex justify-center items-center text-xs`}>
                                    <BsInstagram/>
                                </button>
                            </div>
                        </div>
                        <h1 className={`text-2xl`}>Lenovo’s smarter devices stoke professional passions</h1>
                        <p className={`text-lg text-gray-500`}>Aenean lectus. Pellentesque eget nunc. Donec quis orci
                            eget orci vehicula condimentum.
                        </p>
                        <AuthorFooter author={
                            "Foulcher Nathanil"
                        } date={"May 20, 2021"}/>
                    </div>
                    <div className={`w-full flex flex-col gap-y-10`}>
                        {blogPosts.slice(0, 3).map((post, index) => {
                            return (
                                <RecentPost key={index} title={post.title} description={post.description}
                                            author={post.other.author} date={post.other.date} tag={post.tag}
                                            tagStatus={false}/>
                            )
                        })}
                    </div>
                </div>

                {/*ADS*/}
                <div className={`w-full flex justify-center items-center`}>
                    <div className={`w-full h-28 bg-rose-200 rounded-2xl relative`}>
                        <p className={`text-center text-2xl font-medium text-black absolute top-1/2 left-1/2 -translate-x-9 -translate-y-1/4 opacity-15`}>A
                            . D . S</p>
                        <p className={`text-center text-2xl font-medium text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}>A
                            . D . S</p>
                    </div>
                </div>

                <div className={`w-full grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-10`}>

                    <div className={`flex flex-col gap-y-5 lg:col-span-2`}>
                        <div className={`w-full flex flex-col gap-y-2`}>
                            <h2 className={`text-4xl`}>Latest Articles 🎈</h2>
                            <p className={`text-lg text-gray-500`}>Discover the most outstanding articles in all topics
                                of
                                life.</p>
                        </div>
                        <div className={`w-full flex flex-col gap-y-10 lg:grid-span-1`}>
                            {blogPosts.map((post, index) => {
                                return (
                                    <RecentPost key={index} title={post.title} description={post.description}
                                                author={post.other.author} date={post.other.date} tag={post.tag}
                                                tagStatus={true}/>
                                )
                            })}

                            <div className={`w-full flex justify-center items-center`}>
                                <Pagination totalPages={5} activePage={3}/>
                            </div>
                        </div>
                    </div>

                    <div className={`w-full flex flex-col gap-y-5 lg:grid-cols-1`}>

                        <div className={`w-full flex flex-col bg-gray-100 py-4 rounded-3xl gap-y-6`}>
                            <div className={`w-full flex items-center justify-between px-4 mt-3`}>
                                <h3 className={`text-lg`}>🏷 Discover more tags</h3>
                                <a href={''} className={`text-primary font-bold`}>View all</a>
                            </div>
                            <hr className={`w-full bg-gray-200`}/>
                            <div className={`w-full flex gap-3 px-4 flex-wrap`}>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Outdoors
                                    (14)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Health
                                    (4)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Electronics
                                    (7)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Industrial
                                    (26)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Health
                                    (20)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Toys
                                    (22)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Sports
                                    ()
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Automotive
                                    (9)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Computers
                                    (26)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Design
                                    (15)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Beauty
                                    (27)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Books
                                    (25)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>life
                                    Style (18)
                                </button>
                                <button
                                    className={`text-gray-600 bg-white px-4 py-3 text-sm rounded-lg transition duration-300 border border-transparent hover:border-gray-200`}>Graphic
                                    Design (25)
                                </button>
                            </div>
                        </div>

                        <div className={`w-full flex flex-col bg-gray-100 rounded-3xl overflow-clip`}>
                            <div className={`w-full flex items-center justify-between py-8 px-4`}>
                                <h3 className={`text-lg`}>✨ Trending topic</h3>
                                <a href={''} className={`text-primary font-bold`}>View all</a>
                            </div>

                            <div className={`w-full flex flex-col`}>
                                <div className={`w-full flex items-center justify-start gap-3 px-4 py-5 border-y`}>
                                    <Image aria-label="image" src={tempImg} alt={`blog`} className={`w-12 h-12 rounded-lg`}/>
                                    <div className={`w-full flex flex-col`}>
                                        <p className={`font-bold`}>Garden</p>
                                        <small>13 articles</small>
                                    </div>
                                </div>
                            </div>
                            <div className={`w-full flex flex-col`}>
                                <div className={`w-full flex items-center justify-start gap-3 px-4 py-5 border-y`}>
                                    <Image aria-label="image" src={tempImg} alt={`blog`} className={`w-12 h-12 rounded-lg`}/>
                                    <div className={`w-full flex flex-col`}>
                                        <p className={`font-bold`}>Jewelry</p>
                                        <small>16 articles</small>
                                    </div>
                                </div>
                            </div>
                            <div className={`w-full flex flex-col`}>
                                <div className={`w-full flex items-center justify-start gap-3 px-4 py-5 border-y`}>
                                    <Image aria-label="image" src={tempImg} alt={`blog`} className={`w-12 h-12 rounded-lg`}/>
                                    <div className={`w-full flex flex-col`}>
                                        <p className={`font-bold`}>Industrial</p>
                                        <small>15 articles</small>
                                    </div>
                                </div>
                            </div>
                            <div className={`w-full flex flex-col`}>
                                <div className={`w-full flex items-center justify-start gap-3 px-4 py-5 border-y`}>
                                    <Image aria-label="image" src={tempImg} alt={`blog`} className={`w-12 h-12 rounded-lg`}/>
                                    <div className={`w-full flex flex-col`}>
                                        <p className={`font-bold`}>Tools</p>
                                        <small>21 articles</small>
                                    </div>
                                </div>
                            </div>
                            <div className={`w-full flex flex-col`}>
                                <div className={`w-full flex items-center justify-start gap-3 px-4 py-5 border-y`}>
                                    <Image aria-label="image" src={tempImg} alt={`blog`} className={`w-12 h-12 rounded-lg`}/>
                                    <div className={`w-full flex flex-col`}>
                                        <p className={`font-bold`}>Automotive</p>
                                        <small>16 articles</small>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className={`w-full flex flex-col bg-gray-100 rounded-3xl overflow-clip`}>
                            <div className={`w-full flex items-center justify-between py-8 px-4`}>
                                <h3 className={`text-lg`}>🎯 Popular Posts</h3>
                                <a href={''} className={`text-primary font-bold`}>View all</a>
                            </div>

                            <div className={`w-full flex flex-col`}>
                                <div className={`w-full flex items-center justify-between gap-3 px-4 py-5 border-y`}>
                                    <div className={`w-full flex flex-col gap-y-3`}>
                                        <AuthorFooter author={"Foulcher Nathanil"} date={"May 20, 2021"}/>
                                        <p className={`font-semibold`}>New tools for Black pregnant and postpartum
                                            mothers to save lives</p>
                                    </div>
                                    <Image aria-label="image" src={tempImg} alt={`blog`} className={`h-24 w-24 object-cover rounded-lg`}/>
                                </div>
                                <div className={`w-full flex items-center justify-between gap-3 px-4 py-5 border-y`}>
                                    <div className={`w-full flex flex-col gap-y-3`}>
                                        <AuthorFooter author={"Foulcher Nathanil"} date={"May 20, 2021"}/>
                                        <p className={`font-semibold`}>New tools for Black pregnant and postpartum
                                            mothers to save lives</p>
                                    </div>
                                    <Image aria-label="image" src={tempImg} alt={`blog`} className={`h-24 w-24 object-cover rounded-lg`}/>
                                </div>
                                <div className={`w-full flex items-center justify-between gap-3 px-4 py-5 border-y`}>
                                    <div className={`w-full flex flex-col gap-y-3`}>
                                        <AuthorFooter author={"Foulcher Nathanil"} date={"May 20, 2021"}/>
                                        <p className={`font-semibold`}>New tools for Black pregnant and postpartum
                                            mothers to save lives</p>
                                    </div>
                                    <Image aria-label="image" src={tempImg} alt={`blog`} className={`h-24 w-24 object-cover rounded-lg`}/>
                                </div>
                                <div className={`w-full flex items-center justify-between gap-3 px-4 py-5 border-y`}>
                                    <div className={`w-full flex flex-col gap-y-3`}>
                                        <AuthorFooter author={"Foulcher Nathanil"} date={"May 20, 2021"}/>
                                        <p className={`font-semibold`}>New tools for Black pregnant and postpartum
                                            mothers to save lives</p>
                                    </div>
                                    <Image aria-label="image" src={tempImg} alt={`blog`} className={`h-24 w-24 object-cover rounded-lg`}/>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <Footer setIsFlight={setIsFlight}/>
        </>
    )
}

export default Blog;