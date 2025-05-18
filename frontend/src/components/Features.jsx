import React from 'react'
import { FaListAlt } from 'react-icons/fa'
import { AiOutlineFileSearch} from 'react-icons/ai'
import { IoBookmarkOutline, IoTicketOutline} from 'react-icons/io5'
import { RiFileList3Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { toast } from 'react-toastify'

const Features = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth0()

  const handleFeatureClick = (feature) => {
    if (!isAuthenticated && (feature === 'favorites' || feature === 'bookings')) {
      toast.info('Bu özelliği kullanmak için giriş yapmalısınız', {
        position: "bottom-right",
        autoClose: 3000
      })
      return
    }

    switch(feature) {
      case 'listings':
        navigate('/listing')
        break
      case 'search':
        navigate('/listing')
        break
      case 'favorites':
        navigate('/favourites')
        break
      case 'bookings':
        navigate('/bookings')
        break
      default:
        break
    }
  }

  return (
    <section className='max-padd-container py-10 bg-white'>
        {/* CONTAINER */}
        <div className='max-padd-container flexBetween flex-wrap gap-8'>
            <div 
              className='flex items-start gap-x-3 cursor-pointer hover:text-secondary transition-colors duration-300'
              onClick={() => handleFeatureClick('listings')}
            >
                <RiFileList3Line className='text-3xl'/>
                <h4 className='medium-18'>Detaylı İlanlar</h4>
            </div>
            <div 
              className='flex items-start gap-x-3 cursor-pointer hover:text-secondary transition-colors duration-300'
              onClick={() => handleFeatureClick('search')}
            >
                <AiOutlineFileSearch className='text-3xl'/>
                <h4 className='medium-18'>Mülk Ara</h4>
            </div>
            <div 
              className='flex items-start gap-x-3 cursor-pointer hover:text-secondary transition-colors duration-300'
              onClick={() => handleFeatureClick('favorites')}
            >
                <IoBookmarkOutline className='text-3xl'/>
                <h4 className='medium-18'>Favorilerim</h4>
            </div>
            <div 
              className='flex items-start gap-x-3 cursor-pointer hover:text-secondary transition-colors duration-300'
              onClick={() => handleFeatureClick('bookings')}
            >
                <IoTicketOutline className='text-4xl relative bottom-1'/>
                <h4 className='medium-18'>Rezervasyonlarım</h4>
            </div>
        </div>
    </section>
  )
}

export default Features