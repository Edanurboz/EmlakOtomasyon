import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getProperty } from "../utils/api"
import { Box, Button, Container, Flex, Grid, Image, Paper, Select, Text, Textarea, TextInput, Title } from "@mantine/core"
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation } from "react-query"
import { bookVisit } from "../utils/api"
import { toast } from "react-toastify"
import { DateInput } from '@mantine/dates'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Listing = () => {
    const { id } = useParams()
    const [propertyDetails, setPropertyDetails] = useState(null)
    const { user } = useAuth0()
    const [modalOpened, setModalOpened] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [dateValue, setDateValue] = useState(null)

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                const data = await getProperty(id)
                setPropertyDetails(data)
            } catch (error) {
                console.error("Error fetching property details:", error)
            }
        }
        fetchPropertyDetails()
    }, [id])

    const { mutate: bookVisitMutation, isLoading } = useMutation({
        mutationFn: () => bookVisit(dateValue, id, user?.email, user?.token),
        onError: ({ response }) => toast.error(response?.data?.message || "Something went wrong", { position: "bottom-right" }),
        onSuccess: () => {
            toast.success("Booking successful", { position: "bottom-right" })
            setModalOpened(false)
            setBookingSuccess(true)
        }
    })

    if (!propertyDetails) {
        return <div>Loading...</div>
    }

    return (
        <Container size="lg">
            <Paper shadow="md" p="md" radius="md">
                <Grid>
                    <Grid.Col span={12}>
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000 }}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <SwiperSlide>
                                <Image
                                    src={propertyDetails.image}
                                    height={400}
                                    fit="cover"
                                    style={{ width: "100%" }}
                                />
                            </SwiperSlide>
                            {propertyDetails.image2 && (
                                <SwiperSlide>
                                    <Image
                                        src={propertyDetails.image2}
                                        height={400}
                                        fit="cover"
                                        style={{ width: "100%" }}
                                    />
                                </SwiperSlide>
                            )}
                            {propertyDetails.image3 && (
                                <SwiperSlide>
                                    <Image
                                        src={propertyDetails.image3}
                                        height={400}
                                        fit="cover"
                                        style={{ width: "100%" }}
                                    />
                                </SwiperSlide>
                            )}
                            {propertyDetails.image4 && (
                                <SwiperSlide>
                                    <Image
                                        src={propertyDetails.image4}
                                        height={400}
                                        fit="cover"
                                        style={{ width: "100%" }}
                                    />
                                </SwiperSlide>
                            )}
                        </Swiper>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Title order={2}>{propertyDetails.title}</Title>
                        <Text size="lg" color="dimmed" mt="sm">
                            {propertyDetails.address}, {propertyDetails.city}, {propertyDetails.country}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Text size="xl" weight={700} color="blue">
                            ${propertyDetails.price}
                        </Text>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Text size="lg">{propertyDetails.description}</Text>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Title order={3}>Facilities</Title>
                        <Grid mt="md">
                            <Grid.Col span={4}>
                                <Text>Bedrooms: {propertyDetails.facilities.bedrooms}</Text>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Text>Bathrooms: {propertyDetails.facilities.bathrooms}</Text>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Text>Parking: {propertyDetails.facilities.parkings}</Text>
                            </Grid.Col>
                        </Grid>
                    </Grid.Col>

                    {user && !bookingSuccess && (
                        <Grid.Col span={12}>
                            <Button
                                variant="filled"
                                color="blue"
                                onClick={() => setModalOpened(true)}
                                fullWidth
                            >
                                Book Visit
                            </Button>
                        </Grid.Col>
                    )}

                    {bookingSuccess && (
                        <Grid.Col span={12}>
                            <Text color="green" size="lg" weight={700}>
                                Visit Booked Successfully!
                            </Text>
                        </Grid.Col>
                    )}
                </Grid>
            </Paper>

            {/* Booking Modal */}
            {modalOpened && (
                <Box
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000
                    }}
                >
                    <Paper p="xl" radius="md" style={{ width: "400px" }}>
                        <Title order={3} mb="md">Book a Visit</Title>
                        <DateInput
                            value={dateValue}
                            onChange={setDateValue}
                            label="Select Date"
                            placeholder="Pick a date"
                            mb="md"
                        />
                        <Button
                            variant="filled"
                            color="blue"
                            onClick={() => bookVisitMutation()}
                            loading={isLoading}
                            fullWidth
                        >
                            Confirm Booking
                        </Button>
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={() => setModalOpened(false)}
                            fullWidth
                            mt="sm"
                        >
                            Cancel
                        </Button>
                    </Paper>
                </Box>
            )}
        </Container>
    )
}

export default Listing 