import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

const CommentForm = ({ residencyId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            console.error('Kullanıcı giriş yapmamış');
            return;
        }

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'http://localhost:3000',
                    scope: 'openid profile email'
                }
            });

            console.log('Token alındı:', token);
            console.log('Kullanıcı bilgileri:', user);

            await axios.post(
                'http://localhost:3000/api/comments',
                {
                    content,
                    rating,
                    residencyId,
                    userEmail: user.email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Form alanlarını temizle
            setContent('');
            setRating(0);
            
            // Başarı mesajı göster
            toast.success('Yorumunuz başarıyla eklendi!');
            
            // Yorum listesini yenile
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            console.error('Yorum eklenirken hata oluştu:', error);
            if (error.response) {
                console.error('Hata detayı:', error.response.data);
                toast.error(error.response.data.error || 'Yorum eklenirken bir hata oluştu');
            } else {
                toast.error('Yorum eklenirken bir hata oluştu');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold mb-4">Yorum Yap</h3>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Puanınız
                </label>
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                            <FaStar
                                key={index}
                                className="w-6 h-6 cursor-pointer"
                                color={ratingValue <= (hover || rating) ? '#FFD700' : '#e4e5e9'}
                                onClick={() => setRating(ratingValue)}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Yorumunuz
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                    placeholder="Deneyiminizi paylaşın..."
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!content || rating === 0 || !isAuthenticated}
            >
                {isAuthenticated ? 'Yorum Yap' : 'Yorum yapmak için giriş yapın'}
            </button>
        </form>
    );
};

export default CommentForm; 