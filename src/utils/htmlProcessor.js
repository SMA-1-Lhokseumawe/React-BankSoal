/**
 * Kumpulan fungsi untuk memproses konten HTML
 */

/**
 * Mengonversi HTML ke teks biasa dengan menghapus semua tag HTML
 * 
 * @param {string} html - String HTML
 * @returns {string} - Teks biasa tanpa tag HTML
 */
export const htmlToPlainText = (html) => {
    if (!html) return '';
    
    // Buat elemen temporal untuk mengekstrak teks
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Ambil teks dan hapus whitespace berlebih
    let text = div.textContent || div.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  };
  
  /**
   * Ekstrak semua gambar dari HTML dan kembalikan array base64 URL
   * 
   * @param {string} html - String HTML
   * @returns {Array<string>} - Array URL gambar
   */
  export const extractImagesFromHtml = (html) => {
    if (!html) return [];
    
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const images = [];
    let match;
    
    while ((match = imgRegex.exec(html)) !== null) {
      images.push(match[1]);
    }
    
    return images;
  };
  
  /**
   * Sanitasi HTML untuk mencegah XSS (Cross-Site Scripting)
   * Catatan: Ini adalah sanitasi dasar, untuk keamanan penuh gunakan library seperti DOMPurify
   * 
   * @param {string} html - String HTML
   * @returns {string} - HTML yang telah disanitasi
   */
  export const sanitizeHtml = (html) => {
    if (!html) return '';
    
    // Buat elemen temporal dan parse HTML
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Hapus script tags
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Hapus atribut berbahaya di semua elemen
    const allElements = doc.querySelectorAll('*');
    const dangerousAttrs = ['onerror', 'onclick', 'onload', 'onmouseover', 'javascript:'];
    
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (dangerousAttrs.some(d => attr.name.toLowerCase().includes(d) || 
           (attr.value && attr.value.toLowerCase().includes(d)))) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return doc.body.innerHTML;
  };
  
  /**
   * Terapkan gaya spesifik ke HTML untuk memastikan tampilan yang konsisten
   * 
   * @param {string} html - String HTML
   * @returns {string} - HTML dengan gaya yang ditingkatkan
   */
  export const enhanceHtmlStyles = (html) => {
    if (!html) return '';
    
    // Parse HTML
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Tingkatkan gambar dengan class tambahan
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
      img.classList.add('enhanced-image');
      
      // Pastikan gambar responsif
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      
      // Tambahkan alt text jika tidak ada
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', 'Gambar konten');
      }
    });
    
    // Tingkatkan gaya list
    const lists = doc.querySelectorAll('ul, ol');
    lists.forEach(list => {
      list.classList.add('enhanced-list');
      
      // Tambahkan padding dan margin yang konsisten
      list.style.paddingLeft = '1.5em';
      list.style.marginBottom = '1em';
      
      // Pastikan list menampilkan marker dengan benar
      if (list.tagName === 'UL') {
        list.style.listStyleType = 'disc';
      } else {
        list.style.listStyleType = 'decimal';
      }
    });
    
    // Tingkatkan gaya paragraf
    const paragraphs = doc.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.classList.add('enhanced-paragraph');
      p.style.marginBottom = '1em';
      p.style.lineHeight = '1.6';
    });
    
    // Tingkatkan heading
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      heading.classList.add('enhanced-heading');
      heading.style.marginTop = '1em';
      heading.style.marginBottom = '0.5em';
      heading.style.fontWeight = 'bold';
    });
    
    return doc.body.innerHTML;
  };
  
  /**
   * Menerapkan perbaikan untuk konten HTML dari Quill Editor, 
   * memastikan tampilan yang konsisten dan benar pada preview
   * 
   * @param {string} html - String HTML dari Quill Editor
   * @returns {string} - HTML yang telah disempurnakan untuk preview
   */
  export const prepareHtmlForPreview = (html) => {
    if (!html) return '';
    
    // Sanitasi HTML dahulu
    let processedHtml = sanitizeHtml(html);
    
    // Tambahkan gaya untuk meningkatkan tampilan
    processedHtml = enhanceHtmlStyles(processedHtml);
    
    // Perbaiki masalah spesifik Quill jika ada
    // Misalnya, beberapa versi Quill mungkin memiliki masalah dengan list
    processedHtml = fixQuillListIssues(processedHtml);
    
    return processedHtml;
  };
  
  /**
   * Memperbaiki masalah spesifik pada list yang dibuat dengan Quill
   * Beberapa versi Quill mungkin memiliki masalah dengan rendering list
   * 
   * @param {string} html - String HTML
   * @returns {string} - HTML dengan list yang diperbaiki
   */
  export const fixQuillListIssues = (html) => {
    if (!html) return '';
    
    // Parse HTML
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Temukan semua list items dan pastikan mereka ditampilkan dengan benar
    const listItems = doc.querySelectorAll('li');
    listItems.forEach(li => {
      li.style.display = 'list-item';
      li.style.marginBottom = '0.5em';
    });
    
    return doc.body.innerHTML;
  };
  
  /**
   * Menghitung ukuran HTML dalam kilobyte
   * 
   * @param {string} html - String HTML
   * @returns {number} - Ukuran dalam KB
   */
  export const calculateHtmlSize = (html) => {
    if (!html) return 0;
    return (html.length / 1024).toFixed(2);
  };
  
  /**
   * Mempersiapkan HTML untuk penyimpanan di database
   * Membersihkan dan mengoptimalkan HTML
   * 
   * @param {string} html - String HTML dari editor
   * @returns {string} - HTML yang dioptimalkan untuk penyimpanan
   */
  export const prepareHtmlForStorage = (html) => {
    if (!html) return '';
    
    // Sanitasi HTML untuk keamanan
    let cleanHtml = sanitizeHtml(html);
    
    // Hapus whitespace berlebih
    cleanHtml = cleanHtml.replace(/\s{2,}/g, ' ');
    
    return cleanHtml;
  };