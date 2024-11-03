import React from 'react'
import { BsBook, BsPencilSquare, BsFillPersonLinesFill, BsCameraVideo } from 'react-icons/bs';
import { PiChalkboardTeacher } from "react-icons/pi";


const Dashboard = () => {

  const earningData = [
    {
      icon: <BsBook />,
      amount: '3',
      title: 'Ujian',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: '#40e0ef',
      pcColor: 'red-600',
    },
    {
      icon: <BsPencilSquare />,
      amount: '13',
      title: 'Soal',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
    {
      icon: <BsFillPersonLinesFill />,
      amount: '250',
      title: 'Siswa',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: '#fb767c',
      pcColor: 'red-600',
    },
    {
      icon: <PiChalkboardTeacher />,
      amount: '20',
      title: 'Guru',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: '#e76df9',
      pcColor: 'red-600',
    },
    {
      icon: <BsCameraVideo />,
      amount: 'Bank Soal',
      title: 'Tutorial',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: '#47ef9b',
      pcColor: 'red-600',
    },
  ];

  return (
    <div className='mt-5'>
      <div className='flex flex-wrap lg:flex-nowrap justify-center'>
        <div className='flex m-3 flex-wrap justify-center gap-4 items-center'>
          {earningData.map((item) => (
            <div
              key={item.title}
              className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-xl border border-grey text-center' // Tambahkan 'shadow-xl' di sini
            >
              <button
                type='button'
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className='text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl mx-auto'
              >
                {item.icon}
              </button>
              <p className='mt-3'>
                <span className='text-lg font-semibold'>{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className='text-sm text-gray-400 mt-1'>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
