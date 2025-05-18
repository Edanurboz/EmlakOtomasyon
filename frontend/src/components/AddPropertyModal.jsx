import { Container, Modal, Stepper } from "@mantine/core";
import React, { useState } from "react";
import AddLocation from "./AddLocation";
import { useAuth0 } from "@auth0/auth0-react";
import UploadImage from "./UploadImage";
import BasicDetails from "./BasicDetails";
import Facilities from "./Facilities";

const AddPropertyModal = ({ opened, setOpened }) => {

    const [active, setActive] = useState(0);
    const {user} = useAuth0()
    const [propertyDetails, setPropertyDetails] = useState({
        title: "",
        description: "",
        price: "",
        country : "",
        city : "",
        address : "",
        image : null,
        image2 : null,
        image3 : null,
        image4 : null,
        facilities : {
            bedrooms : 0,
            bathrooms : 0,
            parkings : 0
        },
        userEmail : user?.email
    })

    const nextStep = () => {
        setActive((current) => (current < 4 ? current + 1 : current));
      };

    const prevStep = () => {
      setActive((current) => (current > 0 ? current - 1 : current));
    };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      closeOnClickOutside
      size={"90rem"}
    >
      <Container h={"34rem"} w={"100%"}>
        <>
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step label="Konum" description="Adres">
              <AddLocation 
              nextStep ={nextStep}
              propertyDetails = {propertyDetails}
              setPropertyDetails = {setPropertyDetails}
              />
            </Stepper.Step>
            <Stepper.Step label="Görsel" description="Yükle">
            <UploadImage
              prevStep ={prevStep} 
              nextStep ={nextStep}
              propertyDetails = {propertyDetails}
              setPropertyDetails = {setPropertyDetails}
              />
            </Stepper.Step>
            <Stepper.Step label="Temel" description="Detaylar">
              <BasicDetails
              prevStep ={prevStep} 
              nextStep ={nextStep}
              propertyDetails = {propertyDetails}
              setPropertyDetails = {setPropertyDetails}
               />
            </Stepper.Step>
            <Stepper.Step label="Özellikler" description="Olanaklar">
              <Facilities
              prevStep ={prevStep} 
              propertyDetails = {propertyDetails}
              setPropertyDetails = {setPropertyDetails}
              setOpened = {setOpened}
              setActiveStep = {setActive}
               />
            </Stepper.Step>
            <Stepper.Completed>
              Tamamlandı, önceki adıma dönmek için geri butonuna tıklayın
            </Stepper.Completed>
          </Stepper>
        </>
      </Container>
    </Modal>
  );
};

export default AddPropertyModal;
