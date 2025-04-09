/**
 * Fungsi debounce - Membatasi seberapa sering fungsi callback dapat dipanggil
 * Berguna untuk operasi yang memerlukan banyak resource seperti kompresi gambar
 * 
 * @param {Function} func - Fungsi yang akan dijalankan setelah delay
 * @param {number} wait - Waktu tunggu dalam milidetik
 * @param {boolean} immediate - Jalankan fungsi segera pada panggilan pertama
 * @returns {Function} - Fungsi yang telah dibatasi pemanggilan
 */
const debounce = (func, wait = 300, immediate = false) => {
    let timeout;
    
    return function executedFunction(...args) {
      const context = this;
      
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      
      const callNow = immediate && !timeout;
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  };
  
  export default debounce;