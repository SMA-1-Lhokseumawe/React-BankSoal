import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { Tooltip } from "react-tooltip"; // Import Tooltip dari react-tooltip

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import { Dashboard } from "./Pages";

import { useStateContext } from "./contexts/ContextProvider";

import "./App.css";
import ProfileSaya from "./Pages/ProfileSaya";
import ListSiswa from "./Pages/ListSiswa";
import ListGuru from "./Pages/ListGuru";
import ListPelajaran from "./Pages/ListPelajaran";
import ListKelas from "./Pages/ListKelas";
import ListUsers from "./Pages/ListUsers";
import AddUsers from "./Pages/AddUsers";
import AddKelas from "./Pages/AddKelas";
import AddPelajaran from "./Pages/AddPelajaran";
import AddProfileSiswa from "./Pages/AddProfileSiswa";
import AddProfileGuru from "./Pages/AddProfileGuru";
import EditDataSiswa from "./Pages/EditDataSiswa";
import EditDataGuru from "./Pages/EditDataGuru";
import EditKelas from "./Pages/EditKelas";
import EditPelajaran from "./Pages/EditPelajaran";
import EditUsers from "./Pages/EditUsers";
import GantiPassword from "./Pages/GantiPassword";
import ListModulBelajar from "./Pages/ModulBelajar/ListModulBelajar";
import Homepage from "./Pages/Homepages/homepage";
import LoginPage from "./Pages/LoginPage";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./Pages/ForgetPassword/ResetPassword";
import FormDiscussion from "./Pages/Discussion/FormDiscussion";
import Discussion from "./Pages/Discussion";
import AddModulBelajar from "./Pages/ModulBelajar/AddModulBelajar";
import AddSubModulBelajar from "./Pages/ModulBelajar/AddSubModulBelajar";
import ListSubModulBelajar from "./Pages/ModulBelajar/ListSubModulBelajar";
import EditModulBelajar from "./Pages/ModulBelajar/EditModulBelajar";
import EditSubModulBelajar from "./Pages/ModulBelajar/EditSubModulBelajar";
import ViewContent from "./Pages/ModulBelajar/ViewContent";
import FillKuesioner from "./Pages/Kuesioner/FillKuesioner";
import HasilTes from "./Pages/Kuesioner/HasilTes";
import AddDiscussion from "./Pages/AddDiscussion";
import EditDiscussion from "./Pages/EditDiscussion";
import ListDataSoal from "./Pages/Soal/ListDataSoal";
import AddSoal from "./Pages/Soal/AddSoal";
import EditSoal from "./Pages/Soal/EditSoal";
import ListQuiz from "./Pages/Soal/ListQuiz";
import StartQuiz from "./Pages/Soal/StartQuiz";
import HasilAkhir from "./Pages/Soal/HasilAkhir";
import NilaiSaya from "./Pages/Soal/NilaiSaya";
import DetailNilaiSaya from "./Pages/Soal/DetailNilaiSaya";
import StartQuizLagi from "./Pages/Soal/StartQuizLagi";
import ListDataNilai from "./Pages/Soal/ListDataNilai";
import NotificationsPage from "./Pages/NotificationsPage";
import ViewDiscussion from "./Pages/ViewDiscussion";

const AppContent = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  const location = useLocation(); // Mendapatkan informasi lokasi saat ini
  const isHomepage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isForgetPassword = location.pathname === "/forget-password";
  const isResetPassword = location.pathname.startsWith("/reset-password/");
  const isFormDiscussion = location.pathname === "/form-discussion";

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className="flex relative dark:bg-main-dark-bg">
        {/* Tombol Settings dengan Tooltip */}
        {!isHomepage && !isLoginPage && !isForgetPassword && !isResetPassword && !isFormDiscussion && (
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
        {!isHomepage && !isLoginPage && !isForgetPassword && !isResetPassword && !isFormDiscussion && activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : !isHomepage && !isLoginPage && !isForgetPassword && !isResetPassword && !isFormDiscussion ? (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        ) : null}

        {/* Main Content */}
        <div
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu && !isHomepage && !isLoginPage && !isForgetPassword && !isResetPassword && !isFormDiscussion ? "md:ml-72" : "flex-2"
          }`}
        >
          {!isHomepage && !isLoginPage && !isForgetPassword && !isResetPassword && !isFormDiscussion && (
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
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/form-discussion" element={<FormDiscussion />} />
              <Route path="/diskusi" element={<Discussion />} />
              <Route path="/add-diskusi" element={<AddDiscussion />} />
              <Route path="/diskusi/view/:id" element={<ViewDiscussion />} />
              <Route path="/diskusi/edit/:id" element={<EditDiscussion />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tes-gaya-belajar" element={<FillKuesioner />} />
              <Route path="/hasil-tes" element={<HasilTes />} />
              <Route path="/profile-saya" element={<ProfileSaya />} />
              <Route path="/siswa" element={<ListSiswa />} />
              <Route path="/guru" element={<ListGuru />} />
              <Route path="/pelajaran" element={<ListPelajaran />} />
              <Route path="/data-soal" element={<ListDataSoal />} />
              <Route path="/data-soal/tambah" element={<AddSoal />} />
              <Route path="/data-soal/:id" element={<EditSoal />} />
              <Route path="/quiz" element={<ListQuiz />} />
              <Route path="/start-quiz" element={<StartQuiz />} />
              <Route path="/start-quiz-again/:id" element={<StartQuizLagi />} />
              <Route path="/hasil-quiz/:id" element={<HasilAkhir />} />
              <Route path="/nilai" element={<ListDataNilai />} />
              <Route path="/nilai-saya" element={<NilaiSaya />} />
              <Route path="/nilai-saya/:id" element={<DetailNilaiSaya />} />
              <Route path="/users" element={<ListUsers />} />
              <Route path="/users/tambah-users" element={<AddUsers />} />
              <Route path="/kelas" element={<ListKelas />} />
              <Route path="/kelas/tambah-kelas" element={<AddKelas />} />
              <Route path="/pelajaran/tambah-pelajaran" element={<AddPelajaran />} />
              <Route path="/add-profile-siswa" element={<AddProfileSiswa />} />
              <Route path="/add-profile-guru" element={<AddProfileGuru />} />
              <Route path="/siswa/:id" element={<EditDataSiswa />} />
              <Route path="/guru/:id" element={<EditDataGuru />} />
              <Route path="/kelas/:id" element={<EditKelas />} />
              <Route path="/pelajaran/:id" element={<EditPelajaran />} />
              <Route path="/users/:id" element={<EditUsers />} />
              <Route path="/ganti-password" element={<GantiPassword />} />
              <Route path="/modul-belajar" element={<ListModulBelajar />} />
              <Route path="/modul-belajar/edit/:id" element={<EditModulBelajar />} />
              <Route path="/list-sub-modul-belajar/:id" element={<ListSubModulBelajar />} />
              <Route path="/sub-modul-belajar/edit/:id" element={<EditSubModulBelajar />} />
              <Route path="/sub-modul-belajar/view/:id" element={<ViewContent />} />
              <Route path="/modul-belajar/tambah-modul-belajar" element={<AddModulBelajar />} />
              <Route path="/sub-modul-belajar/tambah-sub-modul-belajar" element={<AddSubModulBelajar />} />
            </Routes>
          </div>

          {!isHomepage && !isLoginPage && !isForgetPassword && !isResetPassword && !isFormDiscussion && <Footer />}
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
