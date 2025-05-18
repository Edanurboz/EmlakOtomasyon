import { prisma } from "../config/prismaConfig.js";

// Yorum ekleme
const createComment = async (req, res) => {
    try {
        const { content, rating, residencyId, userEmail } = req.body;
        
        if (!userEmail) {
            console.error('E-posta adresi bulunamadı');
            return res.status(400).json({ error: 'Kullanıcı e-posta adresi bulunamadı' });
        }

        // Önce residency'nin var olup olmadığını kontrol et
        const residency = await prisma.residency.findUnique({
            where: { id: residencyId }
        });

        if (!residency) {
            console.log('Ev bulunamadı:', residencyId);
            return res.status(404).json({ error: 'Ev bulunamadı' });
        }

        // Kullanıcıyı bul veya oluştur
        let user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) {
            console.log('Kullanıcı bulunamadı, yeni kullanıcı oluşturuluyor...');
            user = await prisma.user.create({
                data: {
                    email: userEmail,
                    name: userEmail,
                    image: null,
                    bookedVisits: [],
                    favResidenciesID: []
                }
            });
            console.log('Yeni kullanıcı oluşturuldu:', user);
        } else {
            // Mevcut kullanıcının bilgilerini güncelle
            user = await prisma.user.update({
                where: { email: userEmail },
                data: {
                    name: userEmail
                }
            });
            console.log('Kullanıcı bilgileri güncellendi:', user);
        }

        // Yorumu oluştur
        const comment = await prisma.comment.create({
            data: {
                content,
                rating,
                userEmail,
                residencyId,
                createdAt: new Date()
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        email: true
                    }
                }
            }
        });

        console.log('Yorum oluşturuldu:', comment);
        res.status(201).json(comment);
    } catch (error) {
        console.error('Yorum ekleme hatası:', error);
        console.error('Hata detayı:', error.stack);
        res.status(500).json({ error: error.message });
    }
};

// Bir ev için tüm yorumları getirme
const getCommentsByResidency = async (req, res) => {
    try {
        const { residencyId } = req.params;
        console.log('Aranan residencyId:', residencyId);

        // Önce residency'nin var olup olmadığını kontrol et
        const residency = await prisma.residency.findUnique({
            where: { id: residencyId }
        });

        if (!residency) {
            console.log('Ev bulunamadı:', residencyId);
            return res.status(404).json({ error: 'Ev bulunamadı' });
        }

        console.log('Ev bulundu:', residency);

        // Prisma client'ı kontrol et
        if (!prisma || !prisma.comment) {
            console.error('Prisma client veya comment modeli bulunamadı');
            return res.status(500).json({ error: 'Veritabanı bağlantısı hatası' });
        }

        const comments = await prisma.comment.findMany({
            where: {
                residencyId: residencyId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('Bulunan yorumlar:', comments);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Yorumları getirme hatası:', error);
        console.error('Hata detayı:', error.stack);
        res.status(500).json({ error: error.message });
    }
};

// Yorum silme
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userEmail } = req.body;

        console.log('Silme isteği:', { commentId, userEmail });

        if (!commentId) {
            console.error('Yorum ID bulunamadı');
            return res.status(400).json({ error: 'Yorum ID bulunamadı' });
        }

        if (!userEmail) {
            console.error('Kullanıcı e-postası bulunamadı');
            return res.status(400).json({ error: 'Kullanıcı e-posta adresi bulunamadı' });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        console.log('Bulunan yorum:', comment);

        if (!comment) {
            console.error('Yorum bulunamadı:', commentId);
            return res.status(404).json({ error: 'Yorum bulunamadı' });
        }

        if (comment.userEmail !== userEmail) {
            console.error('Yetkisiz silme denemesi:', { commentUserEmail: comment.userEmail, requestUserEmail: userEmail });
            return res.status(403).json({ error: 'Bu yorumu silme yetkiniz yok' });
        }

        await prisma.comment.delete({
            where: { id: commentId }
        });

        console.log('Yorum başarıyla silindi:', commentId);
        res.status(200).json({ message: 'Yorum başarıyla silindi' });
    } catch (error) {
        console.error('Yorum silme hatası:', error);
        console.error('Hata detayı:', error.stack);
        res.status(500).json({ error: error.message });
    }
};

// Tüm yorumları getirme
const getAllComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            include: {
                user: {
                    select: {
                        email: true
                    }
                },
                residency: {
                    select: {
                        title: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(comments);
    } catch (error) {
        console.error('Yorumlar getirilirken hata oluştu:', error);
        res.status(500).json({ error: 'Yorumlar getirilirken bir hata oluştu' });
    }
};

// Yorum sayısını getirme
const getCommentCount = async (req, res) => {
    try {
        const count = await prisma.comment.count();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Yorum sayısı alınırken hata oluştu:', error);
        res.status(500).json({ error: 'Yorum sayısı alınırken bir hata oluştu' });
    }
};

export {
    createComment,
    getCommentsByResidency,
    deleteComment,
    getAllComments,
    getCommentCount
}; 