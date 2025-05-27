import asyncHandler from "express-async-handler"
import { prisma } from "../config/prismaConfig.js"

export const createUser = asyncHandler(async (req, res) => {
    console.log("creating a user")

    let { email } = req.body
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (!userExists) {
        const user = await prisma.user.create({ data: req.body })
        res.send({
            message: "User registered succesfully",
            user: user,
        })
    }
    else res.status(201).send({ message: "User already registerd" })
})

export const bookVisit = asyncHandler(async (req, res) => {
    const { email, startDate, endDate } = req.body
    const { id } = req.params
    try {
        // Check if user already has a booking for this property
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        })

        if (user.bookedVisits.some((visit) => visit.id === id)) {
            return res.status(400).json({ message: "Bu mülk için zaten bir rezervasyonunuz bulunmaktadır" })
        }

        // Check if the date range overlaps with any existing bookings
        const allUsers = await prisma.user.findMany({
            select: { bookedVisits: true }
        })

        const hasOverlap = allUsers.some(user => 
            user.bookedVisits.some(visit => {
                if (visit.id === id) {
                    const existingStart = new Date(visit.startDate.split('/').reverse().join('-'))
                    const existingEnd = new Date(visit.endDate.split('/').reverse().join('-'))
                    const newStart = new Date(startDate.split('/').reverse().join('-'))
                    const newEnd = new Date(endDate.split('/').reverse().join('-'))

                    return (newStart <= existingEnd && newEnd >= existingStart)
                }
                return false
            })
        )

        if (hasOverlap) {
            return res.status(400).json({ message: "Seçtiğiniz tarih aralığı başka bir kullanıcı tarafından rezerve edilmiş" })
        }

        // Add the new booking
        await prisma.user.update({
            where: { email: email },
            data: {
                bookedVisits: { 
                    push: { 
                        id, 
                        startDate,
                        endDate 
                    } 
                }
            }
        })

        res.send("Rezervasyonunuz başarıyla oluşturuldu")
    } catch (err) {
        throw new Error(err.message)
    }
})

export const getallBookings = asyncHandler(async (req, res) => {
    const { email } = req.body
    try {
        const bookings = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        })
        res.status(200).send(bookings)
    } catch (err) {
        throw new Error(err.message)
    }
})

export const cancelBooking = asyncHandler(async (req, res) => {
    const { email } = req.body
    const { id } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        })
        const index = user.bookedVisits.findIndex((visit) => visit.id === id)
        if (index === -1) {
            res.status(404).json({ message: "Rezervasyon bulunamadı!" })
        } else {
            user.bookedVisits.splice(index, 1)
            await prisma.user.update({
                where: { email },
                data: {
                    bookedVisits: user.bookedVisits
                }
            })
            res.send("Rezervasyon başarıyla iptal edildi")
        }
    } catch (err) {
        throw new Error(err.message)
    }
})
export const toFav = asyncHandler(async (req, res) => {
    const { email } = req.body
    const { rid } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (user.favResidenciesID.includes(rid)) {
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        set: user.favResidenciesID.filter((id) => id !== rid)
                    }
                }
            })
            res.send({ message: "Removed from favourite", user: updateUser })
        } else {
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        push: rid
                    }
                }
            })
            res.send({ message: "Updated favourites", user: updateUser })
        }
    } catch (err) {
        throw new Error(err.message)
    }
})

export const getAllFav = asyncHandler(async (req, res) => {
    const { email } = req.body
    try {
        const favResd = await prisma.user.findUnique({
            where: { email },
            select: { favResidenciesID: true }
        })
        res.status(200).send(favResd)
    } catch (err) {
        throw new Error(err.message)
    }
})

export const getUserCount = asyncHandler(async (req, res) => {
    try {
        const count = await prisma.user.count();
        res.status(200).json({ count });
    } catch (err) {
        throw new Error(err.message);
    }
});

export const getPropertyBookings = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const allUsers = await prisma.user.findMany({
            select: { 
                email: true,
                bookedVisits: true 
            }
        })

        const propertyBookings = allUsers.reduce((acc, user) => {
            const userBookings = user.bookedVisits
                .filter(visit => visit.id === id)
                .map(visit => ({
                    ...visit,
                    userEmail: user.email
                }))
            return [...acc, ...userBookings]
        }, [])

        res.status(200).json(propertyBookings)
    } catch (err) {
        throw new Error(err.message)
    }
})