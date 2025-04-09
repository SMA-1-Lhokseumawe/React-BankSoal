/**
 * Fungsi-fungsi pembantu untuk memformat data
 */

/**
 * Format ukuran file ke dalam format KB, MB, dsb
 * 
 * @param {number} bytes - Ukuran dalam bytes
 * @param {number} decimals - Jumlah angka desimal
 * @returns {string} - String yang diformat
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  };
  
  /**
   * Format persentase dengan simbol % dan jumlah angka desimal tertentu
   * 
   * @param {number} value - Nilai persentase (0-100)
   * @param {number} decimals - Jumlah angka desimal
   * @returns {string} - String persentase yang diformat
   */
  export const formatPercentage = (value, decimals = 2) => {
    if (typeof value !== 'number') return '0%';
    
    return value.toFixed(decimals) + '%';
  };
  
  /**
   * Format tanggal ke format lokal Indonesia
   * 
   * @param {Date|string} date - Objek Date atau string
   * @param {Object} options - Opsi format
   * @returns {string} - String tanggal yang diformat
   */
  export const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('id-ID', defaultOptions);
  };
  
  /**
   * Format teks dengan mencapitalize kata pertama
   * 
   * @param {string} text - Teks yang akan diformat
   * @returns {string} - Teks dengan kapital di awal
   */
  export const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  
  /**
   * Memformat status kompresi untuk ditampilkan
   * 
   * @param {Object} stats - Statistik kompresi
   * @param {number} stats.originalSize - Ukuran asli dalam KB
   * @param {number} stats.compressedSize - Ukuran terkompresi dalam KB
   * @param {number} stats.ratio - Rasio kompresi dalam persen
   * @returns {Object} - Statistik yang diformat
   */
  export const formatCompressionStats = (stats) => {
    if (!stats) return {};
    
    return {
      originalSize: formatFileSize(stats.originalSize * 1024),
      compressedSize: formatFileSize(stats.compressedSize * 1024),
      ratio: formatPercentage(stats.ratio),
      status: stats.compressedSize < 1024 ? 'Siap dikirim' : 'Terlalu besar',
      isSuccess: stats.compressedSize < 1024
    };
  };