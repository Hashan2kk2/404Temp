'use client';
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Accordion, AccordionItem, Avatar, Button, Chip, Code, Divider, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import StaysForm from "@/components/owner/StaysForm";
import { BsSearch, BsStarFill } from "react-icons/bs";
import Notiflix, { Notify } from "notiflix";

const Page = () => {

  const [userDetails, setUserDetails] = useState({
    id: 0,
    role: '',
    email: '',
    name: ''
  });
  const [propertyList, setPropertyList] = useState([]);
  const [propertyListFiltered, setPropertyListFiltered] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [sizeTypes, setSizeTypes] = useState([]);
  const [country, setCountry] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [amenities, setAmenities] = useState({
    generalAmenities: [],
    otherAmenities: [],
    safetyAmenities: []
  });
  const [rulesForGuests, setRulesForGuests] = useState([]);
  const ruleTypes = ['Allow', 'Do Not Allow', 'Charge'];

  useEffect(() => {
    Notiflix.Loading.circle('Please wait...');
    initialFetch();
    fetchUser();
  }, []);

  useEffect(() => {
    fetchProperties();
    Notiflix.Loading.remove();
  }, [userDetails]);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (response.ok) {
        setUserDetails((prevState) => ({
          ...prevState,
          id: data.id,
          role: data.role,
          email: data.email,
          name: data.name ? data.name : data.firstName,
        }));
      } else {
        throw new Error(data.message);
      }

      if (data.role !== "owner") {
        Notify.failure("You are not authorized to access this page");
        location.href = "/";
        throw new Error("You are not authorized to access this page");
      }

    } catch (error) {
      console.error(error);
    }
  };

  const initialDataList = [
    {
      tb: 'currency',
      setter: setCurrencies
    }, {
      tb: 'property_size_type',
      setter: setSizeTypes
    }, {
      tb: 'property_type',
      setter: setPropertyTypes
    }, {
      tb: 'country',
      setter: setCountry
    }, {
      tb: 'general_amenities',
      setter: (data: any) => {
        const generalAmenities = data.map((amenity: any) => ({ name: amenity.name }));
        setAmenities((prevState: any) => ({ ...prevState, generalAmenities }));
      }
    },
    {
      tb: 'other_amenities',
      setter: (data: any) => {
        const otherAmenities = data.map((amenity: any) => ({ name: amenity.name }));
        setAmenities((prevState: any) => ({ ...prevState, otherAmenities }));
      }
    },
    {
      tb: 'safety_amenities',
      setter: (data: any) => {
        const safetyAmenities = data.map((amenity: any) => ({ name: amenity.name }));
        setAmenities((prevState: any) => ({ ...prevState, safetyAmenities }));
      }
    }, {
      tb: 'property_rules',
      setter: (data: any) => {
        const propertyRules = data.map((rule: any) => ({
          name: rule.name,
          rules: ruleTypes.map(type => ({ name: type }))
        }));
        setRulesForGuests(propertyRules);
      }
    }
  ];

  const initialFetch = async () => {
    for (const data of initialDataList) {
      try {
        const response = await fetch('/api/fetch-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tb: data.tb })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        data.setter(responseData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch(`/api/fetch-data/stays?id=${userDetails.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();
      setPropertyList(responseData);
      setPropertyListFiltered(responseData);
    } catch (error) {
      console.error(error);
    }
  }

  const searchProperty = async (searchQuery: string) => {

    if (searchQuery === '') {
      setPropertyListFiltered(propertyList);
      return;
    }

    const filteredList = propertyList.filter((property: any) => {
      return (
        property.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.propertyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.ownerFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.ownerLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.availability.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(property.insertedDate).toLocaleString().includes(searchQuery.toLowerCase()) ||
        property.availability.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setPropertyListFiltered(filteredList);
  }

  const [isFlight, setIsFlight] = useState(false);

  return (
    <>
      {userDetails.role === 'owner' && (
        <>
          <Navigation />
          <div className="w-full max-w-[1300px] mx-auto px-4 xl:px-0 my-16">
            <h2 className="text-2xl">My Listings</h2>
            <hr className="my-2" />

            <Input label="Search for a property" className="w-full mb-10" endContent={<Button size="sm"><BsSearch /></Button>} onChange={(e) => { searchProperty(e.target.value) }} />

            <Accordion>
              {propertyListFiltered.map((property: any, index: number) => (
                <AccordionItem key={index} title={<>
                  <div className="font-light flex justify-between items-center mb-2 -mt-2">
                    <div className="flex space-x-4 items-center">
                      <p className="font-medium">{property.placeName}</p>
                      <Divider orientation="vertical" className="h-4" />
                      <p>{property.location}</p>
                      <Divider orientation="vertical" className="h-4" />
                      <Code>{property.ownerFirstName + ' ' + property.ownerLastName}</Code>
                    </div>
                    {property.review && <Code size="sm" className="flex gap-x-2 justify-center items-center">{property.review} <BsStarFill className="text-yellow-400" /></Code>}
                  </div>
                </>} startContent={<Avatar src={property.coverImage} size="lg" radius="md" />} subtitle={
                  <>
                    <div className="font-light flex justify-between items-center">
                      <div className="flex gap-x-2">
                        <Chip className="scale-90" size="sm" color={`${property.availability === 'Available' ? 'success' : 'default'}`}>{property.availability}</Chip>
                        <Chip className="scale-90" size="sm" color="primary">{property.propertyType}</Chip>
                      </div>
                      <small>{new Date(property.insertedDate).toLocaleString()}</small>
                    </div>
                  </>
                }>
                  <StaysForm id={property.id} country={country} propertyType={propertyTypes} propertySizeType={sizeTypes} allAmenities={amenities} rulesForGuests={rulesForGuests} reloadProperty={fetchProperties} />
                </AccordionItem>
              ))}
            </Accordion>

          </div>
          <Footer setIsFlight={setIsFlight}/>
        </>
      )}
    </>
  );
};

export default Page;
