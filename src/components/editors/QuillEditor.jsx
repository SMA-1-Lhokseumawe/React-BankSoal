import React, { useRef, useEffect, useCallback, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import debounce from "../../utils/debounce";

// Mendaftarkan ikon kustom untuk video dan audio di Quill
// Gunakan SVG path berbeda untuk membedakan ikon

// Ikon untuk audio (mic icon)
const audioIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
  <line x1="12" y1="19" x2="12" y2="22"/>
</svg>`;

// Daftarkan ikon-ikon kustom dan format audio
const Quill = ReactQuill.Quill;
Quill.imports["ui/icons"]["audio"] = audioIcon;

// Daftarkan format audio sebagai format baru untuk Quill
const Audio = Quill.import('formats/video'); // Extend dari format video yang sudah ada
Audio.tagName = 'IFRAME'; // Menggunakan iframe seperti video
Audio.className = 'ql-audio'; // Class khusus untuk audio
Quill.register(Audio, true);

// Modal Komponen untuk Input URL Audio
const AudioUrlModal = ({ isOpen, onClose, onSubmit, isDarkMode }) => {
  const [audioUrl, setAudioUrl] = useState("");

  // PERBAIKAN: Tambahkan log untuk debugging
  const handleSubmit = (e) => {
    console.log("Form submit handler triggered");
    // Pastikan preventDefault dipanggil untuk mencegah refresh halaman
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (audioUrl) {
      console.log("Submitting audio URL:", audioUrl);
      onSubmit(audioUrl);
      setAudioUrl("");
    }
    
    onClose();
    
    // Return false untuk extra safety mencegah refresh
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl max-w-md w-full p-6`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tambahkan Audio</h3>
          <button 
            type="button" 
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`} 
            onClick={onClose}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* PERBAIKAN: Tambahkan onSubmit ke form dan noValidate untuk menghindari validasi browser */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="audioUrl" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              URL Audio
            </label>
            <input
              type="text"
              id="audioUrl"
              className={`w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="https://example.com/audio.mp3 atau SoundCloud URL"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              required
            />
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Masukkan URL MP3 langsung atau link SoundCloud
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-gray-500 focus:ring-offset-gray-800' : 'focus:ring-gray-500'}`}
              onClick={onClose}
            >
              Batal
            </button>
            
            {/* PERBAIKAN: Ubah button menjadi type="button" dan tambahkan onClick handler */}
            <button
              type="button" 
              className={`px-4 py-2 text-sm font-medium text-white ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDarkMode ? 'focus:ring-offset-gray-800' : ''}`}
              onClick={handleSubmit}
            >
              Tambahkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Komponen Baru untuk Input URL Video YouTube
const VideoUrlModal = ({ isOpen, onClose, onSubmit, isDarkMode }) => {
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = (e) => {
    console.log("Video form submit handler triggered");
    // Pastikan preventDefault dipanggil untuk mencegah refresh halaman
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (videoUrl) {
      console.log("Submitting video URL:", videoUrl);
      onSubmit(videoUrl);
      setVideoUrl("");
    }
    
    onClose();
    
    // Return false untuk extra safety mencegah refresh
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl max-w-md w-full p-6`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tambahkan Video YouTube</h3>
          <button 
            type="button" 
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`} 
            onClick={onClose}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="videoUrl" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              URL Video YouTube
            </label>
            <input
              type="text"
              id="videoUrl"
              className={`w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID atau https://youtu.be/VIDEO_ID"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Masukkan URL video YouTube (format: youtube.com/watch atau youtu.be)
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-gray-500 focus:ring-offset-gray-800' : 'focus:ring-gray-500'}`}
              onClick={onClose}
            >
              Batal
            </button>
            
            <button
              type="button" 
              className={`px-4 py-2 text-sm font-medium text-white ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDarkMode ? 'focus:ring-offset-gray-800' : ''}`}
              onClick={handleSubmit}
            >
              Tambahkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuillEditor = ({
  value,
  onChange,
  placeholder = "Masukkan konten...",
  theme = "snow",
  className = "",
  style = {},
  themeColor = "#0369a1",
  isDarkMode = false, // Tambah prop untuk dark mode
}) => {
  const quillRef = useRef(null);
  // State untuk modal
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false); // State baru untuk video modal
  const [selectionRange, setSelectionRange] = useState(null);

  // Fungsi untuk mengatur ukuran semua gambar yang ada di editor
  const enforceMediaStyles = useCallback(() => {
    if (!quillRef.current) return;
    
    const quill = quillRef.current.getEditor();
    
    // Atur gambar
    const images = quill.root.querySelectorAll("img");
    images.forEach((img) => {
      // Hapus atribut dimensi asli
      img.removeAttribute("width");
      img.removeAttribute("height");

      // Atur style tanpa !important untuk mengurangi konflik CSS
      img.style.maxWidth = "400px";
      img.style.width = "auto";
      img.style.height = "auto";
      img.style.display = "block";
      img.style.margin = "0.5rem auto";
      img.style.objectFit = "contain";
    });

    // Atur iframe (untuk video dan audio embed)
    const iframes = quill.root.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.style.maxWidth = "400px";
      iframe.style.width = "100%";
      iframe.style.display = "block";
      iframe.style.margin = "0.5rem auto";
    });

    // Atur audio elements
    const audios = quill.root.querySelectorAll("audio");
    audios.forEach((audio) => {
      audio.style.maxWidth = "400px";
      audio.style.width = "100%";
      audio.style.display = "block";
      audio.style.margin = "0.5rem auto";
    });
  }, []);

  // PERBAIKAN: Buat versi debounce dari enforceMediaStyles
  const debouncedEnforceMediaStyles = useCallback(
    debounce(enforceMediaStyles, 300), // Tunggu 300ms setelah perubahan terakhir
    [enforceMediaStyles]
  );

  // Handler untuk mengatur ukuran gambar saat disisipkan
  const handleImageInsert = useCallback(() => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          // Buat elemen img terlebih dahulu untuk mengatur dimensi
          const img = new Image();
          img.onload = () => {
            // Tentukan ukuran maksimal
            const MAX_WIDTH = 400; // Pixel

            // Hitung rasio untuk mempertahankan proporsi
            let width = img.width;
            let height = img.height;

            // Jika lebar lebih besar dari MAX_WIDTH, resize
            if (width > MAX_WIDTH) {
              const ratio = MAX_WIDTH / width;
              width = MAX_WIDTH;
              height = height * ratio;
            }

            // Insert gambar ke editor
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", reader.result);

            // Pindahkan selection setelah gambar
            quill.setSelection(range.index + 1);

            // Atur ukuran gambar yang baru disisipkan - pindahkan ke debounced function
            setTimeout(() => {
              debouncedEnforceMediaStyles();
            }, 100);
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    };
  }, [debouncedEnforceMediaStyles]);

  // Handler untuk YouTube video (versi baru dengan modal)
  const handleVideoInsert = useCallback(() => {
    console.log("Video button clicked");
    if (!quillRef.current) return;
    
    const quill = quillRef.current.getEditor();
    
    // Simpan posisi kursor saat ini untuk digunakan nanti saat menambahkan video
    const range = quill.getSelection(true);
    setSelectionRange(range);
    
    // Buka modal video
    setIsVideoModalOpen(true);
    console.log("Video modal should be open now, isVideoModalOpen set to true");
  }, []);

  // Handler untuk menyisipkan video saat URL dikirimkan dari modal
  const handleVideoUrlSubmit = useCallback((url) => {
    console.log("handleVideoUrlSubmit called with URL:", url);
    
    if (!url) {
      console.log("No URL provided, exiting early");
      return;
    }
    
    if (!quillRef.current) {
      console.log("quillRef.current is null, exiting early");
      return;
    }
    
    const quill = quillRef.current.getEditor();
    console.log("Got Quill editor instance");
    
    // Gunakan selectionRange jika ada, atau posisi kursor saat ini
    const range = selectionRange || quill.getSelection(true) || { index: 0 };
    console.log("Selection range:", range);
    
    // Ekstrak YouTube video ID
    let videoId = "";

    // Format URL YouTube: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes("youtube.com/watch")) {
      try {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get("v");
      } catch (e) {
        console.error("Error parsing YouTube URL:", e);
      }
    }
    // Format URL YouTube: https://youtu.be/VIDEO_ID
    else if (url.includes("youtu.be")) {
      try {
        videoId = url.split("/").pop().split("?")[0];
      } catch (e) {
        console.error("Error parsing YouTube short URL:", e);
      }
    }

    if (videoId) {
      // Format URL embed YouTube
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      console.log("Embedding YouTube video:", embedUrl);

      // Kembalikan seleksi ke posisi yang disimpan sebelumnya
      quill.setSelection(range);

      // Sisipkan video ke editor
      quill.insertEmbed(range.index, "video", embedUrl);
      
      // Pindahkan cursor setelah menyisipkan video
      quill.setSelection(range.index + 1);
      
      // Update styles after adding video
      setTimeout(() => {
        console.log("Applying media styles for video");
        debouncedEnforceMediaStyles();
      }, 100);

      console.log("Video insertion complete");
    } else {
      console.error("Invalid YouTube URL. Please ensure the URL format is correct.");
      alert("URL YouTube tidak valid. Pastikan format URL benar.");
    }
  }, [selectionRange, debouncedEnforceMediaStyles]);

  // SOLUSI 1: Menggunakan tombol audio custom dalam toolbar Quill tetapi dengan implementasi yang lebih baik
  const handleAudioInsert = useCallback(() => {
    console.log("Audio button clicked"); // Debugging
    if (!quillRef.current) return;
    
    const quill = quillRef.current.getEditor();
    
    // Simpan posisi kursor saat ini untuk digunakan nanti saat menambahkan audio
    const range = quill.getSelection(true);
    setSelectionRange(range);
    
    // Buka modal - PERBAIKAN: pastikan state diupdate
    setIsAudioModalOpen(true);
    console.log("Modal should be open now, isAudioModalOpen set to true");
  }, []);

  // SOLUSI 2: Fungsi untuk membuka modal dari tombol eksternal
  const openAudioModal = useCallback(() => {
    console.log("External audio button clicked");
    if (!quillRef.current) return;
    
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true) || { index: 0 }; // Default to beginning if no selection
    
    setSelectionRange(range);
    setIsAudioModalOpen(true);
    console.log("Modal should be open now from external button");
  }, []);

  // Handler untuk menyisipkan audio saat URL dikirimkan dari modal
  const handleAudioUrlSubmit = useCallback((url) => {
    console.log("handleAudioUrlSubmit called with URL:", url);
    
    if (!url) {
      console.log("No URL provided, exiting early");
      return;
    }
    
    if (!quillRef.current) {
      console.log("quillRef.current is null, exiting early");
      return;
    }
    
    const quill = quillRef.current.getEditor();
    console.log("Got Quill editor instance");
    
    // Gunakan selectionRange jika ada, atau posisi kursor saat ini
    const range = selectionRange || quill.getSelection(true) || { index: 0 };
    console.log("Selection range:", range);
    
    // Kembalikan seleksi ke posisi yang disimpan sebelumnya
    quill.setSelection(range);
    
    // Cek apakah URL adalah SoundCloud
    if (url.includes("soundcloud.com")) {
      console.log("Creating SoundCloud iframe");
      // Buat iframe untuk SoundCloud
      const audioHTML = `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" 
        src="https://w.soundcloud.com/player/?url=${encodeURIComponent(
          url
        )}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
        class="ql-audio" style="max-width: 400px; display: block; margin: 0.5rem auto;"></iframe>`;

      // Insert HTML ke editor
      quill.clipboard.dangerouslyPasteHTML(range.index, audioHTML);
    } else {
      console.log("Creating standard audio element");
      // Untuk URL audio lainnya, buat elemen audio
      const audioHTML = `<audio controls class="ql-audio" style="max-width: 400px; width: 100%; display: block; margin: 0.5rem auto;">
        <source src="${url}" type="audio/mpeg">
        Browser Anda tidak mendukung tag audio.
      </audio>`;

      // Insert HTML ke editor
      quill.clipboard.dangerouslyPasteHTML(range.index, audioHTML);
    }
    
    console.log("HTML inserted into editor");
    
    // Pindahkan cursor setelah menyisipkan audio
    quill.setSelection(range.index + 1);
    
    // Update styles after adding audio
    setTimeout(() => {
      console.log("Applying media styles");
      debouncedEnforceMediaStyles();
    }, 100);
    
    console.log("Audio insertion complete");
  }, [selectionRange, debouncedEnforceMediaStyles]);

  // Handler untuk formula (rumus matematika)
  const handleFormulaInsert = useCallback(() => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    // Buat formula sederhana tanpa KaTeX
    const formula = prompt("Masukkan rumus matematika:", "e=mc^2");

    if (formula) {
      // Buat markup HTML untuk rumus dengan format khusus
      const formulaHTML = `<span class="math-formula" style="font-family: serif; font-style: italic; color: #333; background-color: #f8f9fa; padding: 2px 4px; border-radius: 3px; margin: 0 3px; display: inline-block;">${formula}</span>`;

      // Insert HTML ke editor
      const range = quill.getSelection(true);
      quill.clipboard.dangerouslyPasteHTML(range.index, formulaHTML);
      quill.setSelection(range.index + 1);
    }
  }, []);

  // Efek untuk setup editor
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      // Konfigurasi toolbar
      const toolbar = quill.getModule("toolbar");

      // Set handler untuk tombol media dan formula
      toolbar.addHandler("image", handleImageInsert);
      toolbar.addHandler("video", handleVideoInsert); // Kini menggunakan modal
      toolbar.addHandler("audio", handleAudioInsert);
      toolbar.addHandler("formula", handleFormulaInsert);

      // PERBAIKAN: Tambahkan audio button secara manual ke toolbar jika dibutuhkan
      try {
        console.log("Trying to add audio button manually");
        // Coba temukan tombol audio dalam toolbar
        const toolbarElement = quill.container.querySelector('.ql-toolbar');
        const audioButton = toolbarElement.querySelector('.ql-audio');
        
        if (audioButton) {
          console.log("Audio button found in toolbar");
          // Pastikan event handler terpasang dengan benar
          audioButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Audio button clicked from direct event listener");
            handleAudioInsert();
          });
        } else {
          console.log("Audio button not found in toolbar");
        }

        // Tambahkan juga untuk video button
        const videoButton = toolbarElement.querySelector('.ql-video');
        if (videoButton) {
          console.log("Video button found in toolbar");
          videoButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Video button clicked from direct event listener");
            handleVideoInsert();
          });
        } else {
          console.log("Video button not found in toolbar");
        }
      } catch (error) {
        console.error("Error adding manual buttons:", error);
      }

      // Jalankan enforceMediaStyles sekali saat awal load
      enforceMediaStyles();

      // Gunakan debounced function untuk event text-change
      quill.on("text-change", debouncedEnforceMediaStyles);

      // Handle paste event juga dengan debounced function
      const handlePaste = () => {
        setTimeout(debouncedEnforceMediaStyles, 100);
      };
      quill.root.addEventListener("paste", handlePaste);

      // Cleanup
      return () => {
        quill.off("text-change", debouncedEnforceMediaStyles);
        quill.root.removeEventListener("paste", handlePaste);
        
        try {
          const toolbarElement = quill.container.querySelector('.ql-toolbar');
          const audioButton = toolbarElement.querySelector('.ql-audio');
          if (audioButton) {
            audioButton.removeEventListener('click', handleAudioInsert);
          }
          
          const videoButton = toolbarElement.querySelector('.ql-video');
          if (videoButton) {
            videoButton.removeEventListener('click', handleVideoInsert);
          }
        } catch (error) {
          console.error("Error cleaning up manual buttons:", error);
        }
      };
    }
  }, [handleImageInsert, handleVideoInsert, handleAudioInsert, handleFormulaInsert, enforceMediaStyles, debouncedEnforceMediaStyles]);

  // Konfigurasi modul editor
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image", "video", "audio", "formula"],
        ["clean"],
      ],
      // PERBAIKAN: Mencoba daftarkan handler secara eksplisit
      handlers: {
        'audio': handleAudioInsert,
        'image': handleImageInsert,
        'video': handleVideoInsert,
        'formula': handleFormulaInsert
      }
    },
    clipboard: {
      matchVisual: false,
    },
  };

  // Tambahkan 'audio' ke dalam formats array
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
    "video",
    "audio",
    "formula",
  ];

  // PERBAIKAN: Log state untuk debugging
  console.log("Current modal states:", { audio: isAudioModalOpen, video: isVideoModalOpen });

  return (
    <div className={`quill-editor-container ${isDarkMode ? 'dark' : ''} ${className}`}>
      <style jsx global>{`
        /* PERBAIKAN: Simplifikasi CSS untuk menghindari pemrosesan browser berlebihan */
        
        /* Perbaikan untuk gambar */
        .ql-editor img {
          max-width: 400px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          margin: 0.5rem auto;
        }

        /* Perbaikan untuk video */
        .ql-editor iframe.ql-video {
          max-width: 400px;
          width: 100%;
          height: 225px; /* Rasio aspek 16:9 untuk video */
          display: block;
          margin: 0.5rem auto;
        }

        /* Perbaikan untuk audio */
        .ql-editor audio,
        .ql-editor iframe.ql-audio {
          max-width: 400px;
          width: 100%;
          display: block;
          margin: 0.5rem auto;
        }

        /* Perbaikan untuk iframes lainnya */
        .ql-editor iframe:not(.ql-video):not(.ql-audio) {
          max-width: 400px;
          width: 100%;
          display: block;
          margin: 0.5rem auto;
        }

        /* Styling untuk formula matematika */
        .ql-editor .math-formula {
          font-family: serif;
          font-style: italic;
          color: #333;
          background-color: #f8f9fa;
          padding: 2px 4px;
          border-radius: 3px;
          margin: 0 3px;
          display: inline-block;
        }

        /* Dark mode untuk formula matematika */
        .dark .ql-editor .math-formula {
          color: #e0e0e0;
          background-color: #333;
        }

        /* PERBAIKAN: Pastikan container overflow tidak mengganggu pengetikan */
        .quill-editor-container,
        .quill-container {
          overflow: visible;
        }

        /* PERBAIKAN: Editor bisa di-scroll tapi tidak seketat sebelumnya */
        .ql-editor {
          overflow-y: auto;
          min-height: 200px;
          max-height: none; /* Hapus batasan max height yang ketat */
          height: auto; /* Biarkan tinggi menyesuaikan konten */
        }

        /* Dark mode styles untuk editor */
        .dark .ql-editor {
          background-color: #1e293b; /* slate-800 */
          color: #e2e8f0; /* slate-200 */
        }
        
        /* Dark mode untuk links di editor */
        .dark .ql-editor a {
          color: #60a5fa; /* blue-400 */
        }

        /* PERBAIKAN: Pastikan toolbar tetap terlihat tapi tidak menghalangi */
        .ql-toolbar {
          display: flex;
          flex-wrap: wrap;
          background-color: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          z-index: 10;
          position: relative;
        }
        
        /* Dark mode untuk toolbar */
        .dark .ql-toolbar {
          background-color: #334155; /* slate-700 */
          border-color: #475569; /* slate-600 */
        }
        
        /* Dark mode untuk toolbar buttons */
        .dark .ql-toolbar button {
          color: #e2e8f0; /* slate-200 */
        }
        
        .dark .ql-toolbar button.ql-active,
        .dark .ql-toolbar button:hover {
          color: #60a5fa; /* blue-400 */
        }
        
        /* Dark mode for SVG icons in toolbar */
        .dark .ql-toolbar button svg {
          stroke: #e2e8f0; /* slate-200 */
        }
        
        .dark .ql-toolbar button.ql-active svg,
        .dark .ql-toolbar button:hover svg {
          stroke: #60a5fa; /* blue-400 */
          fill: #60a5fa; /* blue-400 */
        }

        /* Styling khusus untuk tombol audio */
        .ql-audio {
          display: inline-block;
          cursor: pointer;
        }

        /* Dalam dark mode */
        .dark .ql-audio svg path,
        .dark .ql-audio svg circle {
          stroke: white;
        }
        
        /* PERBAIKAN: Make sure audio button is clickable in toolbar */
        .ql-toolbar button.ql-audio {
          width: 28px;
          height: 24px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }
        
        /* PERBAIKAN: Pastikan modal memiliki z-index yang lebih tinggi */
        .fixed.inset-0.bg-black.bg-opacity-50.z-50 {
          z-index: 9999 !important;
        }
        
        /* PERBAIKAN: Styling untuk tombol eksternal */
        .external-audio-button {
          margin-bottom: 10px;
          padding: 6px 12px;
          background-color: #0369a1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }
        
        /* Dark mode untuk tombol eksternal audio */
        .dark .external-audio-button {
          background-color: #1d4ed8; /* blue-700 */
        }
        
        .external-audio-button:hover {
          background-color: #0284c7;
        }
        
        /* Dark mode untuk hover pada tombol eksternal audio */
        .dark .external-audio-button:hover {
          background-color: #1e40af; /* blue-800 */
        }
        
        .external-audio-button svg {
          width: 16px;
          height: 16px;
        }
        
        /* Dark mode styles for borders and container */
        .dark .ql-container {
          border-color: #475569; /* slate-600 */
        }
        
        .dark .ql-editor {
          border-color: #475569; /* slate-600 */
        }
        
        /* Dark mode for dropdowns in toolbar */
        .dark .ql-toolbar .ql-picker {
          color: #e2e8f0; /* slate-200 */
        }
        
        .dark .ql-toolbar .ql-picker-options {
          background-color: #334155; /* slate-700 */
          border-color: #475569; /* slate-600 */
        }
        
        .dark .ql-toolbar .ql-picker-item {
          color: #e2e8f0; /* slate-200 */
        }
        
        .dark .ql-toolbar .ql-picker-item:hover,
        .dark .ql-toolbar .ql-picker-item.ql-selected {
          color: #60a5fa; /* blue-400 */
        }
        
        /* Dark mode for color pickers */
        .dark .ql-toolbar .ql-color-picker .ql-picker-label,
        .dark .ql-toolbar .ql-background .ql-picker-label {
          background-color: #334155; /* slate-700 */
        }
      `}</style>
      
      {/* React Quill Editor */}
      <ReactQuill
        ref={quillRef}
        theme={theme}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: style.height || "auto", // PERBAIKAN: Gunakan auto height
          ...style,
        }}
      />
      
      {/* Modal untuk input URL audio - dengan z-index yang tinggi */}
      <AudioUrlModal 
        isOpen={isAudioModalOpen} 
        onClose={() => setIsAudioModalOpen(false)} 
        onSubmit={handleAudioUrlSubmit}
        isDarkMode={isDarkMode}
      />
      
      {/* Modal untuk input URL video YouTube - dengan z-index yang tinggi */}
      <VideoUrlModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        onSubmit={handleVideoUrlSubmit}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default QuillEditor;