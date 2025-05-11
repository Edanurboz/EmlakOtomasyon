import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty, removeBooking } from "../utils/api";
import { PuffLoader } from "react-spinners";
import { FaHeart, FaLocationDot, FaStar } from "react-icons/fa6";
import {
  MdOutlineBathtub,
  MdOutlineBed,
  MdOutlineGarage,
} from "react-icons/md";
import Map from "../components/Map";
import useAuthCheck from "../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../components/BookingModal";
import UserDetailContext from "../context/UserDetailContext";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import HeartBtn from "../components/HeartBtn";
import CommentList from "../components/Comments/CommentList";
import CommentForm from "../components/Comments/CommentForm";
import axios from "axios";

const Property = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [commentKey, setCommentKey] = useState(0);
  const {validateLogin} = useAuthCheck()
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const {user} = useAuth0();

  const { data, isLoading, isError } = useQuery(["resd", id], () => getProperty(id));
  const { data: comments, isLoading: commentsLoading } = useQuery(
    ["comments", id],
    async () => {
      const response = await axios.get(`http://localhost:3000/api/comments/residency/${id}`);
      return response.data;
    }
  );

  const {userDetails: {token, bookings}, setUserDetails } = useContext(UserDetailContext)

  const {mutate : cancelBooking, isLoading : cancelling} = useMutation
  ({
    mutationFn : () => removeBooking(id, user?.email, token),
    onSuccess : () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }))
      toast.success("Booking cancelled", {position: "bottom-right"})
    }
  })

  const handleCommentAdded = () => {
    setCommentKey(prev => prev + 1);
  };

  // Yorumlardan ortalama yıldız sayısını hesapla
  const calculateAverageRating = () => {
    if (!comments || comments.length === 0) return null;
    
    const totalRating = comments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
    return (totalRating / comments.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  if (isLoading || commentsLoading) {
    return (
      <div className="h-64 flexCenter">
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#555"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <span>Error while fetching property details</span>
      </div>
    );
  }

  return (
    <section className="max-padd-container my-[99px]">
      {/* IMAGE */}
      <div className="pb-2 relative">
        {data?.image ? (
          <img
            src={data.image}
            alt={data.title}
            className="rounded-tr-3xl rounded-tl-3xl max-h-[27rem] w-full object-cover aspect-square"
          />
        ) : (
          <div className="h-[27rem] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        {/* LIKE BIN */}
        <div className="absolute top-8 right-8 z-10">
          <HeartBtn id={id}/>
        </div>
      </div>
      {/* CONTAINER */}
      <div className="flex flex-col gap-8">
        {/* LEFT SIDE (Artık üst kısım olacak) */}
        <div className="w-full">
          <div className="flexStart gap-x-2">
            <FaLocationDot />
            <span>
              {data?.address} {data?.city} {data?.country}
            </span>
          </div>
          <div className="flexBetween pt-3">
            <h4 className="bold-20 line-clamp-1">{data?.title}</h4>
            <div className="bold-20">${data?.price.toLocaleString()}</div>
          </div>
          <div className="flexBetween py-1">
            <h5 className="bold-16 my-1 text-secondary">{data?.city}</h5>
            {averageRating ? (
              <div className="flex items-baseline gap-2 text-secondary">
                <h4 className="bold-18 relative bottom-0.5 text-black">{averageRating}</h4>
                {[...Array(5)].map((_, index) => (
                  <FaStar 
                    key={index}
                    className={index < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-sm text-gray-500">({comments.length} yorum)</span>
              </div>
            ) : (
              <p className="text-gray-500 italic">Bu ev daha önce hiç yorumlanmamış</p>
            )}
          </div>
          <div className="flex gap-x-4">
            <div className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
              <MdOutlineBed /> {data?.facilities.bedrooms}
            </div>
            <div className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
              <MdOutlineBathtub /> {data?.facilities.bathrooms}
            </div>
            <div className="flexCenter gap-x-2 pr-4 font-[500]">
              <MdOutlineGarage /> {data?.facilities.parkings}
            </div>
          </div>
          <h4 className="h4 mt-3">Property Details</h4>
          <p className="mb-4">{data?.description}</p>
          <div className="flexBetween pt-7">
            {bookings?.map((booking) => booking.id).includes(id) ? (
              <>
                <Button
                   onClick={() => cancelBooking()}
                   variant="outline"
                   w={"100%"}
                   color="red"
                   disabled={cancelling}
                >
                   Cancel Booking
                </Button>
                <p className="text-red-500 medium-15 ml-3">
                  You've already Booked visit for {bookings?.filter
                  ((booking) => booking?.id === id)[0].date}
                </p>
              </>
            ) : (
              <Button
              onClick={()=>{
                validateLogin() && setModalOpened(true)
              }} 
              variant="filled"
              w={"20%"}
              color="black"
              >
              Book visit
            </Button>
            )
            }
            <BookingModal 
            opened = {modalOpened}
            setOpened = {setModalOpened}
            propertyId = {id}
            email = {user?.email}
            />
          </div>
        </div>
        {/* RIGHT SIDE (Artık alt kısım olacak) */}
        <div className="flex-1">
          <Map
            address={data?.address}
            city={data?.city}
            country={data?.country}
          />
        </div>

        {/* Yorumlar Bölümü */}
        <div className="mt-12">
          <CommentForm residencyId={id} onCommentAdded={handleCommentAdded} />
          <CommentList key={commentKey} residencyId={id} />
        </div>
      </div>
    </section>
  );
};

export default Property;
