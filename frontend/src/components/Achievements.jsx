import React, { useEffect, useState } from 'react'
import { FaUsers, FaHome, FaComments } from 'react-icons/fa'
import axios from 'axios'

const Achievements = () => {
  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    comments: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Kullanıcı sayısı
        const usersResponse = await axios.get('http://localhost:3000/api/user/count')
        // İlan sayısı
        const listingsResponse = await axios.get('http://localhost:3000/api/residency/count')
        // Yorum sayısı
        const commentsResponse = await axios.get('http://localhost:3000/api/comments/count')

        setStats({
          users: usersResponse.data.count || 0,
          listings: listingsResponse.data.count || 0,
          comments: commentsResponse.data.count || 0
        })
      } catch (error) {
        console.error('İstatistikler yüklenirken hata oluştu:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className='max-padd-container py-20 bg-gradient-to-b from-white to-gray-50'>
      <div className='max-padd-container'>
        {/* BAŞLIK */}
        <div className='text-center mb-16'>
          <h2 className='h2 mb-4'>Platform İstatistikleri</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            EmlakOtomasyon platformumuzda binlerce kullanıcı ve ilan ile hizmetinizdeyiz. 
            Güvenilir ve hızlı çözümler için doğru adres.
          </p>
        </div>

        {/* İSTATİSTİKLER */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          {/* Kayıtlı Kullanıcılar */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-secondary/10 p-4 rounded-full mb-6'>
                <FaUsers className='text-4xl text-secondary' />
              </div>
              <h3 className='text-4xl font-bold text-gray-800 mb-2'>{stats.users}</h3>
              <p className='text-xl font-medium text-gray-600 mb-3'>Kayıtlı Kullanıcı</p>
              <p className='text-sm text-gray-500'>
                Platformumuza kayıtlı aktif kullanıcı sayısı
              </p>
            </div>
          </div>

          {/* İlanlar */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-secondary/10 p-4 rounded-full mb-6'>
                <FaHome className='text-4xl text-secondary' />
              </div>
              <h3 className='text-4xl font-bold text-gray-800 mb-2'>{stats.listings}</h3>
              <p className='text-xl font-medium text-gray-600 mb-3'>Aktif İlan</p>
              <p className='text-sm text-gray-500'>
                Platformumuzda yayında olan toplam ilan sayısı
              </p>
            </div>
          </div>

          {/* Yorumlar */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-secondary/10 p-4 rounded-full mb-6'>
                <FaComments className='text-4xl text-secondary' />
              </div>
              <h3 className='text-4xl font-bold text-gray-800 mb-2'>{stats.comments}</h3>
              <p className='text-xl font-medium text-gray-600 mb-3'>Değerlendirme</p>
              <p className='text-sm text-gray-500'>
                Kullanıcılarımızın yaptığı toplam değerlendirme sayısı
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Achievements
