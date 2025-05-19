import React, { useContext, useEffect, useRef } from 'react'
import UserDetailContext from '../context/UserDetailContext'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from 'react-query'
import { getUserListings } from '../utils/api'

const useListings = () => {
    const {userDetails, setUserDetails} = useContext(UserDetailContext)
    const queryRef = useRef()
    const {user} = useAuth0()

    const {data, isLoading, isError, refetch} = useQuery({
        queryKey: "userListings",
        queryFn: () => getUserListings(user?.email, userDetails?.token),
        onSuccess : (data) => setUserDetails((prev) => ({
            ...prev,
            listings: data
        })),
        enabled: user !== undefined,
        staleTime: 30000,
    })

    queryRef.current = refetch

    useEffect(() => {
        queryRef.current && queryRef.current()
    }, [userDetails?.token])

    return {data, isLoading, isError, refetch}
}

export default useListings 