import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import AddPropertyModal from './AddPropertyModal'
import useAuthCheck from '../hooks/useAuthCheck'

const Navbar = ({containerStyles}) => {
const [modalOpened, setmodalOpened] = useState(false)
const { validateLogin } = useAuthCheck()
const handleAddPropertyClick = () => {
    if (validateLogin()) {
        setmodalOpened(true)
    }
}
  return (
    <nav className={`${containerStyles}`}>
        <NavLink to={'/'} className={({isActive}) => isActive ? 'active-link py-1' : 'py-1'}>
            Ana Sayfa
        </NavLink>
        <NavLink to={'/listing'} className={({isActive}) => isActive ? 'active-link py-1' : 'py-1'}>
            İlanlar
        </NavLink>
        <NavLink to={'mailto:info@emlakotomasyon.com'} className={({isActive}) => isActive ? 'active-link py-1' : 'py-1'}>
            İletişim
        </NavLink>
        <div onClick={handleAddPropertyClick} className={'py-1 cursor-pointer'}>
            İlan Ekle
        </div>
        <AddPropertyModal opened ={modalOpened} setOpened={setmodalOpened}/>
    </nav>
  )
}

export default Navbar