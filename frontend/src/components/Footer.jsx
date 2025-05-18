import React from 'react'
import { FaMailBulk, FaPhone } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import logo from "../assets/logo.png"


const Footer = () => {
  return (
    <footer>
      <div className='max-padd-container flex items-start justify-between flex-col lg:flex-row gap-8 py-6 mb-7 bg-gradient-to-r from-primary via-white to-white'>
        <div>
          <h4 className='h4'>Size Her Zaman Yardımcı Olmak İçin Buradayız</h4>
          <p>EmlakOtomasyon olarak, emlak sürecinizde size en iyi hizmeti sunmak için çalışıyoruz.</p>
        </div>
        <div className='flexStart flex-wrap gap-8'>
          <div className='flexCenter gap-x-6'>
            <FaLocationDot />
            <div>
              <h5 className='h5'>Adres</h5>
              <p>İstanbul, Türkiye</p>
            </div>
          </div>
          <div className='flexCenter gap-x-6'>
            <FaPhone />
            <div>
              <h5 className='h5'>Telefon</h5>
              <p>+90 212 123 45 67</p>
            </div>
          </div>
          <div className='flexCenter gap-x-6'>
            <FaMailBulk />
            <div>
              <h5 className='h5'>E-posta</h5>
              <p>info@emlakotomasyon.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className='max-padd-container flex items-start justify-between flex-wrap gap-12 mt-12'>
        {/* logo - Left side */}
        <div className='flex flex-col max-w-sm gap-y-5'>
          {/* logo */}
          <div>
            <Link to={"/"}>
              <img src={logo} alt="" className="h-16" />
            </Link>
          </div>
          <p>EmlakOtomasyon ile hayalinizdeki evi bulmak artık çok daha kolay. Güvenilir ve profesyonel hizmet anlayışımızla yanınızdayız.</p>
        </div>
        <div className='flexStart gap-7 xl:gap-x-36 flex-wrap'>
          <ul>
            <h4 className='h4 mb-3'>Müşteri Hizmetleri</h4>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Yardım Merkezi</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Ödeme Yöntemleri</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>İletişim</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>İlan Durumu</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Şikayet ve Öneriler</a></li>
          </ul>
          <ul>
            <h4 className='h4 mb-3'>Yasal</h4>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Gizlilik Politikası</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Çerez Ayarları</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Kullanım Koşulları</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>İptal Koşulları</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Yasal Uyarı</a></li>
          </ul>
          <ul>
            <h4 className='h4 mb-3'>Diğer</h4>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Ekibimiz</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Sürdürülebilirlik</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Basın</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Kariyer</a></li>
            <li className='my-2'><a href="" className='text-gray-30 regular-14 '>Bülten</a></li>
          </ul>
        </div>
      </div>
      {/* copyrights */}
      <p className='max-padd-container medium-14 py-2 px-8 rounded flexBetween mt-6 bg-gradient-to-r from-primary via-white to-white'><span>© 2024 EmlakOtomasyon</span><span>Tüm hakları saklıdır</span></p>

    </footer>
  )
}

export default Footer