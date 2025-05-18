import React from 'react'
import about1 from '../assets/about1.png'
import about2 from '../assets/about2.png'
import { FaHome, FaBuilding, FaChartLine, FaUserTie, FaHandshake, FaSearch } from 'react-icons/fa'
import { FaCalendarAlt, FaComments, FaHeart, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa'

const About = () => {
  return (
    <section className='max-padd-container pb-16 xl:pb-28'>
      <div className='flex items-center flex-col lg:flex-row gap-12'>
        {/* SOL TARAF - RESİM */}
        <div className='flex-1'>
          <div className='relative'>
            <img src={about1} alt="Emlak Otomasyon" className='rounded-3xl'/>
            <span className='absolute top-8 left-8 bg-white px-2 rounded-full medium-14'>Emlak Danışmanları</span>
          </div>
        </div>
        {/* SAĞ TARAF - BİLGİLER */}
        <div className='flex-1'>
          <h2 className='h2'>Emlak Danışmanları İçin Profesyonel Çözümler</h2>
          <p>EmlakOtomasyon, emlak danışmanlarının işlerini kolaylaştırmak ve müşterilerine daha iyi hizmet sunmalarını sağlamak için tasarlanmış kapsamlı bir platformdur. İlan yönetimi, müşteri takibi ve raporlama özellikleriyle işinizi büyütün.</p>
          <div className='flex flex-col gap-6 mt-5'>
            <div className='flex gap-3'>
              <FaHome className='text-secondary'/>
              <p>Kolay İlan Yönetimi ve Düzenleme</p>
            </div>
            <div className='flex gap-3'>
              <FaChartLine className='text-secondary'/>
              <p>Müşteri Görüşme Takibi</p>
            </div>
            <div className='flex gap-3'>
              <FaUserTie className='text-secondary'/>
              <p>Müşteri Bilgileri ve İletişim Geçmişi</p>
            </div>
            <div className='flex gap-3'>
              <FaHandshake className='text-secondary'/>
              <p>Randevu ve Görüntüleme Takibi</p>
            </div>
            <div className='flex gap-3'>
              <FaBuilding className='text-secondary'/>
              <p>İlan Durumu ve Fiyat Güncellemeleri</p>
            </div>
          </div>
        </div>
      </div>

      {/* İKİNCİ BÖLÜM */}
      <div className='flex items-center flex-col lg:flex-row gap-12 mt-20'>
        {/* SOL TARAF - BİLGİLER */}
        <div className='flex-1'>
          <h2 className='h2'>Müşteriler İçin Akıllı Emlak Deneyimi</h2>
          <p>EmlakOtomasyon ile hayalinizdeki evi bulmak artık çok daha kolay. Gelişmiş arama özellikleri, detaylı filtreleme seçenekleri ve güvenilir emlak danışmanlarıyla tanışma fırsatı sunuyoruz.</p>
          <div className='flex flex-col gap-6 mt-5'>
            <div className='flex gap-3'>
              <FaSearch className='text-secondary'/>
              <p>Detaylı Arama ve Filtreleme</p>
            </div>
            <div className='flex gap-3'>
              <FaCalendarAlt className='text-secondary'/>
              <p>Online Randevu Sistemi</p>
            </div>
            <div className='flex gap-3'>
              <FaHeart className='text-secondary'/>
              <p>Favori İlanları Kaydetme</p>
            </div>
            <div className='flex gap-3'>
              <FaComments className='text-secondary'/>
              <p>Emlak Danışmanlarıyla İletişim</p>
            </div>
            <div className='flex gap-3'>
              <FaShieldAlt className='text-secondary'/>
              <p>Güvenli ve Şeffaf İşlemler</p>
            </div>
          </div>
        </div>
        {/* SAĞ TARAF - RESİM */}
        <div className='flex-1'>
          <div className='relative'>
            <img src={about2} alt="Müşteri Hizmetleri" className='rounded-3xl'/>
            <span className='absolute top-8 left-8 bg-white px-2 rounded-full medium-14'>Müşteriler</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About