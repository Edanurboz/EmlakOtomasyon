import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaTrash, FaUser, FaClock } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

const CommentList = ({ residencyId, onCommentDeleted }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/comments/residency/${residencyId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Yorumlar yüklenirken hata oluştu:', error);
            toast.error('Yorumlar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [residencyId]);

    const handleDelete = async (commentId) => {
        if (!isAuthenticated) {
            toast.error('Yorum silmek için giriş yapmalısınız');
            return;
        }

        if (!commentId) {
            toast.error('Yorum silinirken bir hata oluştu');
            return;
        }

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'http://localhost:3000',
                    scope: 'openid profile email'
                }
            });

            await axios.delete(`http://localhost:3000/api/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    userEmail: user.email
                }
            });

            toast.success('Yorum başarıyla silindi');
            fetchComments();
            if (onCommentDeleted) {
                onCommentDeleted();
            }
        } catch (error) {
            console.error('Yorum silinirken hata oluştu:', error);
            if (error.response) {
                toast.error(error.response.data.error || 'Yorum silinirken bir hata oluştu');
            } else {
                toast.error('Yorum silinirken bir hata oluştu');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-4">Yorumlar yükleniyor...</div>;
    }

    if (comments.length === 0) {
        return <div className="text-center py-4">Henüz yorum yapılmamış.</div>;
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="bg-white p-4 rounded-lg shadow mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                <FaUser className="text-gray-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{comment.user?.email || 'Anonim Kullanıcı'}</p>
                                <p className="text-sm text-gray-500 flex items-center">
                                    <FaClock className="mr-1" />
                                    {formatDate(comment.createdAt)}
                                </p>
                            </div>
                        </div>
                        {isAuthenticated && comment.userEmail === user?.email && (
                            <button
                                onClick={() => handleDelete(comment.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTrash className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                className={`${
                                    index < comment.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                </div>
            ))}
        </div>
    );
};

export default CommentList; 