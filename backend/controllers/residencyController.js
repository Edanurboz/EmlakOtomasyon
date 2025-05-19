import asyncHandler from "express-async-handler"
import { prisma } from "../config/prismaConfig.js"


export const createResidency = asyncHandler(async (req, res) => {
    try {
        const data = req.body.data || req.body;
        console.log("Gelen veri:", data);

        // Veri doğrulama
        if (!data.title || !data.description || !data.price || !data.address || !data.country || !data.city || !data.image || !data.userEmail) {
            return res.status(400).json({ message: "Gerekli alanlar eksik" });
        }

        // Veriyi hazırla - userEmail'i çıkar
        const residencyData = {
            title: data.title,
            description: data.description,
            price: parseInt(data.price),
            address: data.address,
            country: data.country,
            city: data.city,
            facilities: data.facilities,
            image: data.image
        };

        // Opsiyonel resimleri ekle
        if (data.image2) residencyData.image2 = data.image2;
        if (data.image3) residencyData.image3 = data.image3;
        if (data.image4) residencyData.image4 = data.image4;

        console.log("Oluşturulacak veri:", residencyData);

        const residency = await prisma.residency.create({
            data: {
                ...residencyData,
                owner: { connect: { email: data.userEmail } }
            }
        });

        console.log("Oluşturulan residency:", residency);
        res.status(201).json({ message: "Residency created successfully", residency });

    } catch (err) {
        console.error("Hata detayı:", {
            message: err.message,
            code: err.code,
            stack: err.stack
        });

        if (err.code === "P2002") {
            return res.status(400).json({ message: "Already have a residency with this address" });
        }

        res.status(500).json({ 
            message: "Bir hata oluştu", 
            error: err.message 
        });
    }
})

export const getAllResidencies = asyncHandler(async (req, res) => {
    const residencies = await prisma.residency.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.send( residencies )
})

export const getResidency = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const residency = await prisma.residency.findUnique({where:{id}})
        res.send(residency)
    } catch (err) {
        throw new Error(err.message)
    }
})

export const getResidencyCount = asyncHandler(async (req, res) => {
    try {
        const count = await prisma.residency.count();
        res.status(200).json({ count });
    } catch (err) {
        throw new Error(err.message);
    }
});

export const getUserListings = asyncHandler(async (req, res) => {
    const { email } = req.params;
    try {
        const listings = await prisma.residency.findMany({
            where: { userEmail: email },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.status(200).json(listings);
    } catch (err) {
        throw new Error(err.message);
    }
});

export const updateResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    const updateData = req.body;

    try {
        // Önce ilanın kullanıcıya ait olup olmadığını kontrol et
        const residency = await prisma.residency.findUnique({
            where: { id }
        });

        if (!residency) {
            return res.status(404).json({ message: "İlan bulunamadı" });
        }

        if (residency.userEmail !== email) {
            return res.status(403).json({ message: "Bu ilanı güncelleme yetkiniz yok" });
        }

        // İlanı güncelle
        const updatedResidency = await prisma.residency.update({
            where: { id },
            data: {
                title: updateData.title,
                description: updateData.description,
                price: parseInt(updateData.price),
                address: updateData.address,
                country: updateData.country,
                city: updateData.city,
                facilities: updateData.facilities,
                image: updateData.image,
                image2: updateData.image2,
                image3: updateData.image3,
                image4: updateData.image4
            }
        });

        res.status(200).json({ message: "İlan başarıyla güncellendi", residency: updatedResidency });
    } catch (err) {
        throw new Error(err.message);
    }
});

export const deleteResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        // Önce ilanın kullanıcıya ait olup olmadığını kontrol et
        const residency = await prisma.residency.findUnique({
            where: { id }
        });

        if (!residency) {
            return res.status(404).json({ message: "İlan bulunamadı" });
        }

        if (residency.userEmail !== email) {
            return res.status(403).json({ message: "Bu ilanı silme yetkiniz yok" });
        }

        // İlanı sil
        await prisma.residency.delete({
            where: { id }
        });

        res.status(200).json({ message: "İlan başarıyla silindi" });
    } catch (err) {
        throw new Error(err.message);
    }
});