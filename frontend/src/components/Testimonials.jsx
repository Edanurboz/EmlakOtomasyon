import React, { useState, useEffect } from "react";
import { FaCheck, FaStar, FaClock } from "react-icons/fa";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

const Testimonials = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/comments');
        // Rastgele 10 yorum seç
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setComments(shuffled.slice(0, 10));
      } catch (error) {
        console.error('Yorumlar yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flexCenter">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <section className="max-padd-container bg-white py-16 xl:pt-28">
      {/* CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_5fr] gap-20 mb-16 rounded-2xl">
        {/* LEFT SIDE */}
        <div className="flex items-start justify-between flex-col gap-10">
          <h2 className="h2">Müşteri Yorumları ve Deneyimleri</h2>
          <div className="flex flex-col gap-1 bg-white p-2 rounded ring-1 ring-slate-900/5">
            <div className="flex text-secondary gap-2">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <div className="medium-14">
              Toplam <b>{comments.length} yorum</b> gösteriliyor
            </div>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <Swiper
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="w-full"
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
          }}
        >
          {comments.map((comment) => (
            <SwiperSlide key={comment.id}>
              <div className="rounded-lg p-4 bg-white ring-1 ring-slate-900/5 h-full">
                <div className="flexBetween">
                  <div className="flexCenter gap-x-2">
                    <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {comment.user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h5 className="bold-14">{comment.user?.email}</h5>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaClock />
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
                <hr className="h-[1px] w-full my-2" />
                <div className="flex gap-x-1 text-secondary mt-5 mb-1 text-xs">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={index < comment.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <h4 className="h4">{comment.residency?.title}</h4>
                <p className="text-gray-600">{comment.content}</p>
                {comment.residency?.image && (
                  <div className="flex gap-x-1 mt-5">
                    <img
                      src={comment.residency.image}
                      alt="propertyImg"
                      height={44}
                      width={44}
                      className="rounded aspect-square object-cover"
                    />
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
