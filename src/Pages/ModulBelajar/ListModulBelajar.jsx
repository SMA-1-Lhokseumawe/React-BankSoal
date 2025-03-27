import React from 'react';
import { useStateContext } from "../../contexts/ContextProvider";
import { FiClock, FiBook, FiAward, FiPlus, FiEye, FiHeadphones, FiActivity } from 'react-icons/fi';

const ListModulBelajar = () => {
  const modulData = [
    {
      judul: "Belajar Bilangan Phytagoras",
      deskripsi: "Modul ini mengajarkan konsep dasar bilangan Phytagoras dan aplikasinya dalam pemecahan masalah matematika.",
      jamBelajar: 50,
      kelas: "10",
      pelajaran: "Matematika",
      typeGayaBelajar: "Visual"
    },
    {
      judul: "Belajar Membuat Aplikasi Android",
      deskripsi: "Modul ini membahas tentang pengembangan aplikasi Android dasar menggunakan Android Studio dan Kotlin.",
      jamBelajar: 70,
      kelas: "11",
      pelajaran: "Pemrograman Mobile",
      typeGayaBelajar: "Auditori"
    },
    {
      judul: "Menjadi Android Developer Expert",
      deskripsi: "Modul lanjutan untuk memperdalam kemampuan dalam pengembangan aplikasi Android dengan best practices.",
      jamBelajar: 90,
      kelas: "12",
      pelajaran: "Pemrograman Mobile Lanjutan",
      typeGayaBelajar: "Kinestetik"
    }
  ];

  const { currentColor, currentMode } = useStateContext();

  // Menambahkan styling dinamis berdasarkan currentColor dan mode
  const gradientStyle = {
    background: currentMode === 'Dark' 
      ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
      : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
  };

  const buttonStyle = {
    backgroundColor: currentColor,
  };

  return (
    <div className="p-6 space-y-8 dark:bg-gray-900">
      {/* Header section with gradient background */}
      <div className="rounded-xl p-6 mb-8" style={gradientStyle}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Daftar Modul Pembelajaran</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">Temukan modul pembelajaran yang sesuai dengan gaya belajar dan kebutuhan Anda. Dari dasar hingga lanjutan, semua dirancang untuk memaksimalkan pengalaman belajar.</p>
      </div>

      <div>
          <button 
            className="inline-flex items-center px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all" 
            style={buttonStyle}
          >
            <FiPlus className="mr-2" />
            Tambah Modul
          </button>
        </div>
      
      {/* Filter section */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm text-sm font-medium">Semua Modul</button>
        <button className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm text-sm font-medium">Kelas 10</button>
        <button className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm text-sm font-medium">Kelas 11</button>
        <button className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm text-sm font-medium">Kelas 12</button>
      </div>
      
      {/* Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {modulData.map((modul, index) => {
          // Menentukan ikon dan warna gaya belajar
          let gayaBelajarIcon;
          let badgeClass;
          let hoverClass;
          
          switch (modul.typeGayaBelajar.toLowerCase()) {
            case 'visual':
              gayaBelajarIcon = <FiEye className="mr-2" />;
              badgeClass = currentMode === 'Dark' 
                ? 'bg-indigo-900 bg-opacity-30 text-indigo-300 border border-indigo-800' 
                : 'bg-indigo-100 text-indigo-800 border border-indigo-200';
              hoverClass = currentMode === 'Dark' 
                ? 'hover:border-indigo-700' 
                : 'hover:border-indigo-300';
              break;
            case 'auditori':
              gayaBelajarIcon = <FiHeadphones className="mr-2" />;
              badgeClass = currentMode === 'Dark' 
                ? 'bg-purple-900 bg-opacity-30 text-purple-300 border border-purple-800' 
                : 'bg-purple-100 text-purple-800 border border-purple-200';
              hoverClass = currentMode === 'Dark' 
                ? 'hover:border-purple-700' 
                : 'hover:border-purple-300';
              break;
            case 'kinestetik':
              gayaBelajarIcon = <FiActivity className="mr-2" />;
              badgeClass = currentMode === 'Dark' 
                ? 'bg-green-900 bg-opacity-30 text-green-300 border border-green-800' 
                : 'bg-green-100 text-green-800 border border-green-200';
              hoverClass = currentMode === 'Dark' 
                ? 'hover:border-green-700' 
                : 'hover:border-green-300';
              break;
            default:
              gayaBelajarIcon = null;
              badgeClass = currentMode === 'Dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-gray-100 text-gray-800 border border-gray-200';
              hoverClass = currentMode === 'Dark' 
                ? 'hover:border-gray-600' 
                : 'hover:border-gray-300';
          }
          
          return (
            <div 
              key={index} 
              className={`rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm ${hoverClass} transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800 flex flex-col`}
            >
              {/* Card Header with color */}
              <div className="h-3" style={{ backgroundColor: currentColor }}></div>
              
              <div className="p-6 flex-grow">
                {/* Badge for learning style */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${badgeClass}`}>
                  {gayaBelajarIcon}
                  <span className="capitalize">{modul.typeGayaBelajar}</span>
                </div>
                
                {/* Title and description */}
                <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{modul.judul}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">{modul.deskripsi}</p>
                
                {/* Stats with improved visuals */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="rounded-full p-2 mr-3" style={{backgroundColor: currentMode === 'Dark' ? `${currentColor}40` : `${currentColor}20`}}>
                      <FiClock className="text-lg" style={{color: currentColor}} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Durasi</p>
                      <p className="font-semibold dark:text-gray-200">{modul.jamBelajar} Jam</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="rounded-full p-2 mr-3" style={{backgroundColor: currentMode === 'Dark' ? `${currentColor}40` : `${currentColor}20`}}>
                      <FiAward className="text-lg" style={{color: currentColor}} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tingkat</p>
                      <p className="font-semibold dark:text-gray-200">Kelas {modul.kelas}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600 flex justify-between items-center">
                <div className="flex items-center">
                  <FiBook className="mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{modul.pelajaran}</span>
                </div>
                
                <button 
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90" 
                  style={buttonStyle}
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          );
        })}
      </div>
        
      {/* Learning Styles Info Card */}
      <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-1" style={{ backgroundColor: currentColor }}></div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full mr-3" style={{backgroundColor: currentMode === 'Dark' ? `${currentColor}40` : `${currentColor}20`}}>
              <svg
                className="h-6 w-6"
                style={{ color: currentColor }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Memahami Gaya Belajar</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg ${currentMode === 'Dark' ? 'bg-gray-700 border border-indigo-800' : 'bg-indigo-50 border border-indigo-100'}`}>
              <div className="flex items-center mb-3">
                <FiEye className={`${currentMode === 'Dark' ? 'text-indigo-300' : 'text-indigo-600'} mr-2 text-lg`} />
                <h4 className={`font-bold ${currentMode === 'Dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>Visual</h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pembelajar visual belajar terbaik melalui pengamatan, diagram, dan materi visual. 
                Mereka memproses informasi dengan baik melalui grafik, bagan, dan gambaran visual.
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${currentMode === 'Dark' ? 'bg-gray-700 border border-purple-800' : 'bg-purple-50 border border-purple-100'}`}>
              <div className="flex items-center mb-3">
                <FiHeadphones className={`${currentMode === 'Dark' ? 'text-purple-300' : 'text-purple-600'} mr-2 text-lg`} />
                <h4 className={`font-bold ${currentMode === 'Dark' ? 'text-purple-300' : 'text-purple-700'}`}>Auditori</h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pembelajar auditori mengandalkan pendengaran dan berbicara untuk belajar.
                Mereka belajar dengan baik dari diskusi, ceramah, dan penjelasan secara lisan.
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${currentMode === 'Dark' ? 'bg-gray-700 border border-green-800' : 'bg-green-50 border border-green-100'}`}>
              <div className="flex items-center mb-3">
                <FiActivity className={`${currentMode === 'Dark' ? 'text-green-300' : 'text-green-600'} mr-2 text-lg`} />
                <h4 className={`font-bold ${currentMode === 'Dark' ? 'text-green-300' : 'text-green-700'}`}>Kinestetik</h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pembelajar kinestetik belajar dengan melakukan langsung atau gerakan fisik.
                Mereka memahami konsep dengan praktik langsung, eksperimen, dan aktivitas hands-on.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListModulBelajar;