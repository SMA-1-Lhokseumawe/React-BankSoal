import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { Tooltip } from "react-tooltip"; // Import Tooltip dari react-tooltip

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import { Dashboard } from "./Pages";

import { useStateContext } from "./contexts/ContextProvider";

import "./App.css";
import ListSiswa from "./Pages/ListSiswa";
import ListGuru from "./Pages/ListGuru";
import ListPelajaran from "./Pages/ListPelajaran";
import ListKelas from "./Pages/ListKelas";
import Homepage from "./Pages/Homepages/homepage";
import LoginPage from "./Pages/LoginPage";

const AppContent = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const location = useLocation(); // Mendapatkan informasi lokasi saat ini
  const isHomepage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";


  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className="flex relative dark:bg-main-dark-bg">
        {/* Tombol Settings dengan Tooltip */}
        {!isHomepage && !isLoginPage && (
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
              style={{ background: currentColor, borderRadius: "50%" }}
              onClick={() => setThemeSettings(true)}
              data-tooltip-id="settings-tooltip"   // Tooltip ID
              data-tooltip-content="Settings"      // Tooltip content
            >
              <FiSettings />
            </button>
            {/* Tooltip instance */}
            <Tooltip id="settings-tooltip" place="top" effect="solid" />
          </div>
        )}

        {/* Sidebar */}
        {!isHomepage && !isLoginPage && activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : !isHomepage && !isLoginPage ? (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        ) : null}

        {/* Main Content */}
        <div
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu && !isHomepage && !isLoginPage ? "md:ml-72" : "flex-2"
          }`}
        >
          {!isHomepage && !isLoginPage && (
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>
          )}

          <div>
            {themeSettings && <ThemeSettings />}

            <Routes>
              {/* Dashboard Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/siswa" element={<ListSiswa />} />
              <Route path="/guru" element={<ListGuru />} />
              <Route path="/pelajaran" element={<ListPelajaran />} />
              <Route path="/kelas" element={<ListKelas />} />
            </Routes>
          </div>

          {!isHomepage && !isLoginPage && <Footer />}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
