import React from 'react'
import { useSelector } from "react-redux";
import { Link, NavLink } from 'react-router-dom'
import { MdOutlineCancel } from 'react-icons/md'
import { AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiEdit, FiPieChart } from 'react-icons/fi';
import { BsKanban, BsBook, BsFillPersonLinesFill, BsPencilSquare, BsPeople, BsDoorOpen, BsChatLeftText } from 'react-icons/bs';
import { BiColorFill, BiSolidDashboard, BiSolidBookBookmark, BiSolidBookmarks } from 'react-icons/bi';
import { PiChalkboardTeacher } from "react-icons/pi";
import { CgPassword } from "react-icons/cg";

import LogoSMA from "../assets/Logo1.png";


import { useStateContext } from '../contexts/ContextProvider'

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize, currentColor } = useStateContext()

  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || 'siswa'; // Default to 'siswa' if role is not provided

  // Full links configuration
  const allLinks = [
    {
      title: 'Dashboard',
      links: [
        {
          name: 'dashboard',
          displayName: 'dashboard',
          icon: <BiSolidDashboard />,
          allowedRoles: ['admin', 'guru', 'siswa'], // All roles can access dashboard
        },
      ],
    },
  
    {
      title: 'Pages',
      links: [
        {
          name: 'siswa',
          displayName: 'siswa',
          icon: <BsFillPersonLinesFill />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access siswa
        },
        {
          name: 'guru',
          displayName: 'guru',
          icon: <PiChalkboardTeacher />,
          allowedRoles: ['admin'], // Only admin can access guru
        },
        {
          name: 'kelas',
          displayName: 'kelas',
          icon: <BsDoorOpen />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access kelas
        },
        {
          name: 'quiz',
          displayName: 'quiz',
          icon: <BsPencilSquare />,
          allowedRoles: ['siswa'], // Admin and guru can access soal
        },
        {
          name: 'nilai',
          displayName: 'nilai',
          icon: <BiSolidBookBookmark />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access nilai
        },
        {
          name: 'pelajaran',
          displayName: 'pelajaran',
          icon: <BiSolidBookBookmark />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access pelajaran
        },
        {
          name: 'modul-belajar',
          displayName: 'modul belajar',
          icon: <BiSolidBookmarks />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access modul belajar
        },
      ],
    },
    {
      title: 'Apps',
      links: [
        {
          name: 'diskusi',
          displayName: 'diskusi',
          icon: <BsChatLeftText />,
          allowedRoles: ['admin', 'guru', 'siswa'], // All roles can access diskusi
        },
        {
          name: 'kanban',
          displayName: 'kanban',
          icon: <BsKanban />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access kanban
        },
        {
          name: 'editor',
          displayName: 'editor',
          icon: <FiEdit />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access editor
        },
        {
          name: 'color-picker',
          displayName: 'color picker',
          icon: <BiColorFill />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access color-picker
        },
      ],
    },
    {
      title: 'Charts',
      links: [
        {
          name: 'line',
          displayName: 'line',
          icon: <AiOutlineStock />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access line
        },
        {
          name: 'area',
          displayName: 'area',
          icon: <AiOutlineAreaChart />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access area
        },
  
        {
          name: 'bar',
          displayName: 'bar',
          icon: <AiOutlineBarChart />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access bar
        },
        {
          name: 'pie',
          displayName: 'pie',
          icon: <FiPieChart />,
          allowedRoles: ['admin', 'guru'], // Admin and guru can access pie
        },
      ],
    },
    {
      title: 'Setting',
      links: [
        {
          name: 'ganti-password',
          displayName: 'ganti password',
          icon: <CgPassword />,
          allowedRoles: ['admin', 'guru', 'siswa'], // All roles can access ganti password
        },
        {
          name: 'users',
          displayName: 'users',
          icon: <BsPeople />,
          allowedRoles: ['admin'], // Only admin can access users
        },
      ],
    },
  ];

  // Filter links based on user role
  const filterLinksByRole = (links, role) => {
    // Filter each category
    const filteredCategories = links.map(category => {
      // Filter links within this category
      const filteredLinks = category.links.filter(link => 
        link.allowedRoles.includes(role)
      );
      
      // Return category with filtered links (only if it has any links)
      return {
        ...category,
        links: filteredLinks
      };
    });
    
    // Only include categories that have at least one link
    return filteredCategories.filter(category => category.links.length > 0);
  };

  // Get links based on user role
  const links = filterLinksByRole(allLinks, userRole);

  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <= 900){
      setActiveMenu(false)
    }
  }

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
      {activeMenu && (<>
        <div className='flex justify-between items-center'>
          <Link to="/dashboard" onClick={handleCloseSideBar} className='items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900'>
          <img src={LogoSMA} alt="Logo SMA 1 Lhokseumawe" style={{width: "35px"}} /> <span>SMA 1 Lhokseumawe</span>
          </Link>
            <button type='button' onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} className='text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden'>
              <MdOutlineCancel />
            </button>
        </div>
        <div className='mt-10'>
          {links.map((item) => (
            <div key={item.title}>
              <p className='text-gray-400 m-3 mt-4 uppercase'>
                {item.title}
              </p>
              {item.links.map((link) => (
                <NavLink to={`/${link.name}`} key={link.name} onClick={handleCloseSideBar} style={({ isActive }) => ({ backgroundColor: isActive ? currentColor: '' })} className={({ isActive }) => isActive ? activeLink : normalLink }>
                  {link.icon}
                  <span className='capitalize'>{link.displayName}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </>)}
    </div>
  )
}

export default Sidebar