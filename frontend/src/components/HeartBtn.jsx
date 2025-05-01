import React, { useContext, useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import useAuthCheck from '../hooks/useAuthCheck'
import UserDetailContext from '../context/UserDetailContext'
import { useMutation } from 'react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { toFav } from '../utils/api'
import { checkFavourites, updateFavourites } from '../utils/common'

const HeartBtn = ({id}) => {

    const [heartColor, setheartColor] = useState("white")
    const { validateLogin } = useAuthCheck()
    const {user} = useAuth0()

    const {userDetails: {token, favourites }, setUserDetails } = useContext(UserDetailContext)

  const {mutate} = useMutation
  ({
    mutationFn : () => toFav(id , user?.email, token),
    onSuccess : () => setUserDetails((prev) => ( {
        ...prev, 
        favourites: updateFavourites(id, prev.favourites)
    })),
  })

    const handleLike = () => {
        if (validateLogin()) {
            mutate()
            setheartColor((prev) => prev === "#8ac243" ? "white" : "#8ac243")
        }
    }

    useEffect(()=>{
        setheartColor(() => checkFavourites(id, favourites))
    }, [favourites])

  return (
    <FaHeart 
    onClick={(e)=>{
        e.stopPropagation()
        handleLike()
    }}
    color= {heartColor}
    size={23}
    className='cursor-pointer drop-shadow-sm'
    />
  )
}

export default HeartBtn