import { useAuth0 } from '@auth0/auth0-react';
import React, { useContext } from 'react'
import UserDetailContext from '../context/UserDetailContext';
import useProperties from '../hooks/useProperties';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { Box, Button, Group, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createResidency } from '../utils/api';

const Facilities = ({prevStep, propertyDetails, setPropertyDetails, setOpened, setActiveStep}) => {
  const form = useForm({
    initialValues: {
        title: propertyDetails.facilities.bedrooms,
        description: propertyDetails.facilities.parkings,
        price: propertyDetails.facilities.bathrooms,
    },
    validate: {
        bedrooms: (value) => value < 1 ? "Must have at least one bedroom" : null,
        bathrooms: (value) => value < 1 ? "Must have at least one bathroom" : null,
    },
  });
  const { bedrooms, parkings, bathrooms} = form.values;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
        setPropertyDetails((prev) => ({
            ...prev,
            facilities: {bedrooms, parkings, bathrooms},
        }));
        mutate();
    }
  };

  // upload
  const { user } = useAuth0();
  const {
    userDetails: { token },
  } = useContext(UserDetailContext);
  const { refetch: refetchProperties} = useProperties();

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
        createResidency(
            {
                ...propertyDetails,
                facilities: { bedrooms, parkings, bathrooms},
            },
            token,
            user?.email
        ),
        onError: ({ response }) =>
            toast.error(response.data.message, { position: "bottom-right"}),
        onSettled: () => {
            toast.success("Added Succesfully", {position: "bottom-right"});
            setPropertyDetails({
                title: "",
                description: "",
                price: 0,
                country: "",
                city: "",
                address: "",
                image: null,
                facilities: {
                    bedrooms: 0,
                    parkings: 0,
                    bathrooms: 0,
                },
                userEmail: user?.email,
            });
            setOpened(false);
            setActiveStep(0);
            refetchProperties();
        },
  });

  return (
    <Box maw={"30%"} mx="auto" my={"sm"}> 
        <form
        onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
        }}
        >
            <NumberInput 
            withAsterisk
            label = "No of Bedrooms"
            min={0}
            {...form.getInputProps("bedrooms")}
            />
            <NumberInput 
            withAsterisk
            label = "No of parkings"
            min={0}
            {...form.getInputProps("parkings")}
            />
            <NumberInput 
            withAsterisk
            label = "No of Bathrooms"
            min={0}
            {...form.getInputProps("bathrooms")}
            />
            <Group position="center" mt="xl">
                <Button variant='default' onClick={prevStep}>
                    Back
                </Button>
                <Button type='submit' color='green' disabled={isLoading}>
                    {isLoading ? "Submitting" : "Add Property"}
                </Button>
            </Group>
        </form>
    </Box>
  );
};
export default Facilities;