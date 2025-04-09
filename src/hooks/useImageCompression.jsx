import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

/**
 * Custom hook untuk menangani kompresi gambar dalam konten HTML
 * 
 * @param {Object} options - Opsi kompresi
 * @param {number} options.maxSizeMB - Ukuran maksimum file dalam MB
 * @param {number} options.maxWidthOrHeight - Lebar atau tinggi maksimum dalam piksel
 * @param {boolean} options.useWebWorker - Gunakan web worker untuk kompresi
 * @returns {Object} - Fungsi dan state untuk kompresi
 */
const useImageCompression = (options = {}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState({
    originalSize: 0,
    compressedSize: 0,
    ratio: 0,
    isReady: true
  });

  // Opsi default
  const compressionOptions = {
    maxSizeMB: options.maxSizeMB || 1,
    maxWidthOrHeight: options.maxWidthOrHeight || 1024,
    useWebWorker: options.useWebWorker !== undefined ? options.useWebWorker : true
  };

  /**
   * Kompresi gambar tunggal dari base64 string
   * 
   * @param {string} base64Str - String base64 gambar
   * @returns {Promise<string>} - String base64 gambar terkompresi
   */
  const compressImage = useCallback(async (base64Str) => {
    try {
      // Konversi base64 ke blob
      const fetchResponse = await fetch(base64Str);
      const blob = await fetchResponse.blob();
      
      // Lakukan kompresi
      const compressedFile = await imageCompression(blob, compressionOptions);
      
      // Konversi kembali ke base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
        reader.onerror = error => {
          console.error("Error reading compressed file:", error);
          reject(error);
        };
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      return base64Str; // Kembalikan original jika gagal
    }
  }, [compressionOptions]);

  /**
   * Kompresi gambar-gambar dalam konten HTML
   * Menemukan dan mengompresi semua gambar base64
   * 
   * @param {string} htmlContent - Konten HTML dengan gambar
   * @returns {Promise<string>} - Konten HTML dengan gambar terkompresi
   */
  const compressContentImages = useCallback(async (htmlContent) => {
    if (!htmlContent) return '';
    
    // Status awal kompresi
    setIsCompressing(true);
    const originalSize = htmlContent.length / 1024; // ukuran dalam KB
    setCompressionStats(prev => ({ ...prev, originalSize, isReady: false }));
    
    try {
      // Cek jika tidak ada gambar
      if (!htmlContent.includes('<img')) {
        setIsCompressing(false);
        setCompressionStats(prev => ({ 
          ...prev, 
          compressedSize: originalSize,
          ratio: 0,
          isReady: true 
        }));
        return htmlContent;
      }
      
      // Buat DOM parser untuk memanipulasi HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const images = doc.querySelectorAll('img');
      
      if (images.length === 0) {
        setIsCompressing(false);
        setCompressionStats(prev => ({ 
          ...prev, 
          compressedSize: originalSize,
          ratio: 0,
          isReady: true
        }));
        return htmlContent;
      }
      
      // Proses setiap gambar
      const compressionPromises = Array.from(images).map(async (img) => {
        const src = img.getAttribute('src');
        // Hanya kompresi base64 (gambar yang di-upload)
        if (src && src.startsWith('data:image')) {
          const compressedSrc = await compressImage(src);
          img.setAttribute('src', compressedSrc);
        }
      });
      
      // Tunggu semua proses kompresi selesai
      await Promise.all(compressionPromises);
      
      // Ambil hasil HTML terkompresi
      const compressedHtml = doc.body.innerHTML;
      const compressedSize = compressedHtml.length / 1024; // ukuran dalam KB
      const ratio = originalSize > 0 ? 100 - (compressedSize / originalSize) * 100 : 0;
      
      // Update status kompresi
      setCompressionStats({
        originalSize,
        compressedSize,
        ratio,
        isReady: true
      });
      
      setIsCompressing(false);
      return compressedHtml;
    } catch (error) {
      console.error("Error processing HTML content:", error);
      setIsCompressing(false);
      setCompressionStats(prev => ({ ...prev, isReady: true }));
      return htmlContent; // Kembalikan original jika gagal
    }
  }, [compressImage]);

  return {
    compressImage,
    compressContentImages,
    compressionStats,
    isCompressing
  };
};

export default useImageCompression;