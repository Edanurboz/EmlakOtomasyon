import { Button, Modal } from '@mantine/core'
import React, { useContext, useState, useEffect } from 'react'
import { DatePickerInput } from "@mantine/dates"
import { useMutation, useQuery } from 'react-query'
import UserDetailContext from '../context/UserDetailContext'
import { bookVisit, getPropertyBookings } from '../utils/api'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

const BookingModal = ({opened, setOpened, email, propertyId}) => {
    const [value, setValue] = useState([null, null])
    const {userDetails: {token}, setUserDetails} = useContext(UserDetailContext)
    const [excludedDates, setExcludedDates] = useState([])

    // Fetch all bookings for this property
    const { data: propertyBookings } = useQuery({
        queryKey: ['propertyBookings', propertyId],
        queryFn: () => getPropertyBookings(propertyId),
        enabled: opened
    })

    useEffect(() => {
        if (propertyBookings) {
            const dates = propertyBookings.map(booking => {
                const start = new Date(booking.startDate.split('/').reverse().join('-'))
                const end = new Date(booking.endDate.split('/').reverse().join('-'))
                return { start, end }
            })
            setExcludedDates(dates)
        }
    }, [propertyBookings])

    const isDateExcluded = (date) => {
        return excludedDates.some(({ start, end }) => {
            return date >= start && date <= end
        })
    }

    const handleBookingSuccess = () => {
        toast.success("Rezervasyonunuz başarıyla oluşturuldu", {position: "bottom-right"})
        setUserDetails((prev) => 
            ({
                ...prev,
                bookings: [
                    ...prev.bookings,
                    {
                        id: propertyId,
                        startDate: dayjs(value[0]).format("DD/MM/YYYY"),
                        endDate: dayjs(value[1]).format("DD/MM/YYYY"),
                    }
                 ]
                }))
    }

    const {mutate, isLoading} = useMutation({
        mutationFn: () => bookVisit(value, propertyId, email, token),
        onSuccess: () => handleBookingSuccess(),
        onError: ({response}) => toast.error(response.data.message),
        onSettled: () => setOpened(false)
    })

    return (
        <Modal
            opened={opened}
            title="Rezervasyon Tarih Aralığını Seçin"
            centered
            onClose={() => setOpened(false)}
        >
            <div className='flexCenter flex-col gap-4 '>
                <DatePickerInput
                    type="range"
                    value={value}
                    onChange={setValue}
                    minDate={new Date()}
                    placeholder="Tarih aralığı seçin"
                    locale="tr"
                    firstDayOfWeek={1}
                    excludeDate={isDateExcluded}
                />
                <Button 
                    disabled={!value[0] || !value[1] || isLoading} 
                    onClick={() => mutate()}
                >
                    Rezervasyon Yap
                </Button>
            </div>
        </Modal>
    )
}

export default BookingModal