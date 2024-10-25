"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AiOutlineFacebook } from "react-icons/ai";
import { BsInstagram, BsTwitter, BsYoutube } from "react-icons/bs";
import React, { useState } from "react";
import NewsLetter from "@/components/NewsLetter";
import InputWLabel from "@/elements/InputWLabel";
import TextAreaWLabel from "@/elements/TextAreaWLabel";
import PrimaryButton from "@/elements/PrimaryButton";
import Notiflix from "notiflix";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    Notiflix.Loading.circle("Submitting...");

    if (formData.name === "" || formData.email === "" || formData.message === "") {
      Notiflix.Loading.remove();
      Notiflix.Notify.warning("Please fill the required fields");
    } else {
      const response = await fetch(
        "https://formsubmit.co/ajax/vidhuraneethika000@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            "Mail Type": "Contact Form",
            "Name": formData.name,
            "Email": formData.email,
            "Message": formData.message,
            _subject: "Contact Form Submission",
            _template: "table",
          }),
        }
      );
      if (!response.ok) {
        Notiflix.Notify.failure("Failed to submit");
        Notiflix.Loading.remove();
      } else {
        Notiflix.Notify.success("Submitted successfully");
        Notiflix.Loading.remove();
      }
    }
  };

  const [isFlight, setIsFlight] = useState(false);

  return (
    <>
      <Navigation />
      <div className="mt-28 max-w-[1000px] mx-auto px-4 xl:px-0">
        <h2 className="text-3xl text-center xl:text-5xl">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-28">
          <div className="w-full xl:pe-16">
            <h3 className="text-sm uppercase">🗺 Address</h3>
            <p className="mt-2 text-lg text-neutral-400">
              Cinnamon Lake Inn, Paththiyawatta, Nakanda, Hikkaduwa
            </p>

            <h3 className="mt-10 text-sm uppercase">💌 Email</h3>
            <p className="mt-2 text-lg text-neutral-400">info@404travels.com</p>

            <h3 className="mt-10 text-sm uppercase">☎ Phone</h3>
            <p className="mt-2 text-lg text-neutral-400">+94 76 371 8806</p>
            <div className="flex flex-col mt-6 gap-y-3">
              <div className="text-sm">
                <strong>Amila Dulan</strong>
                <div className="flex justify-between w-full">
                  <span>Mobile</span>
                  <span>+39 334 242 4969</span>
                </div>
                <div className="flex justify-between w-full">
                  <span>Email</span>
                  <span>dulan@404travels.com</span>
                </div>
              </div>
              <div className="text-sm">
                <strong>Dumindu Karunarathne</strong>
                <div className="flex justify-between w-full">
                  <span>Mobile</span>
                  <span>+94 72 028 1580</span>
                </div>
                <div className="flex justify-between w-full">
                  <span>Email</span>
                  <span>dumindu@404travels.com</span>
                </div>
              </div>
              <div className="text-sm">
                <strong>Bhadrani Jayasooriya</strong>
                <div className="flex justify-between w-full">
                  <span>Mobile</span>
                  <span>+94 71 811 7071</span>
                </div>
                <div className="flex justify-between w-full">
                  <span>Email</span>
                  <span>jayasooriya@404travels.com</span>
                </div>
              </div>
            </div>

            <h3 className="mt-10 text-sm uppercase">🌏 Social</h3>
            <div className="flex gap-3 mt-2">
              <AiOutlineFacebook className="text-lg text-neutral-500" />
              <BsTwitter className="text-lg text-neutral-500" />
              <BsYoutube className="text-lg text-neutral-500" />
              <BsInstagram className="text-lg text-neutral-500" />
            </div>
          </div>

          <div className="flex flex-col w-full mt-10 md:mt-0 gap-y-6">
              <InputWLabel handler={handleFormChange} name="name" value={formData.name} label="Your Name" inputType="text" placeHolder="John Doe"/>
              <InputWLabel handler={handleFormChange} name="email" value={formData.email} label="Email Address" inputType="text" placeHolder="example@gmail.com"/>
              <TextAreaWLabel handler={handleFormChange} name="message" value={formData.message} label="Message" placeHolder="Your message here..." rows={10} />
              <PrimaryButton content="Send" events={handleSubmit} className=""/>
          </div>
        </div>
      </div>

      <NewsLetter />

      <Footer setIsFlight={setIsFlight}/>
    </>
  );
};

export default Page;
