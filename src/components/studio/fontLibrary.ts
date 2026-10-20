export interface FontItem {
  id: string;
  name: string;
  family: string;
  category: 'modern' | 'minimal' | 'elegant' | 'bold' | 'script';
  previewText: string;
  sampleDescription: string;
}

export const FONT_LIBRARY: FontItem[] = [
  {
    id: 'be-vietnam-pro',
    name: 'Be Vietnam Pro',
    family: "'Be Vietnam Pro', sans-serif",
    category: 'modern',
    previewText: 'YOUR LOGO',
    sampleDescription: 'Chuẩn tiếng Việt hiện đại, tối ưu dấu'
  },
  {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', sans-serif",
    category: 'minimal',
    previewText: 'Cupfy Minimalist 1990',
    sampleDescription: 'Tối giản, công nghệ, thanh lịch'
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: "'Montserrat', sans-serif",
    category: 'modern',
    previewText: 'HƯƠNG VỊ ĐẬM ĐÀ',
    sampleDescription: 'Hình học hiện đại, sang trọng'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: "'Poppins', sans-serif",
    category: 'modern',
    previewText: 'Trà Sữa Nhà Làm 🧋',
    sampleDescription: 'Bo tròn trẻ trung, thời thượng'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: "'Roboto', sans-serif",
    category: 'minimal',
    previewText: 'Fresh Coffee Daily',
    sampleDescription: 'Trung tính, rõ nét, dễ đọc'
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    family: "'Open Sans', sans-serif",
    category: 'minimal',
    previewText: 'Cuộc Sống Đẹp Tươi',
    sampleDescription: 'Thân thiện, mộc mạc, gần gũi'
  },
  {
    id: 'nunito',
    name: 'Nunito',
    family: "'Nunito', sans-serif",
    category: 'script',
    previewText: 'Ngọt ngào mỗi ngày 🌿',
    sampleDescription: 'Bo góc bo tròn ấm áp, dễ thương'
  },
  {
    id: 'quicksand',
    name: 'Quicksand',
    family: "'Quicksand', sans-serif",
    category: 'script',
    previewText: 'Chill Cùng Bạn Bè',
    sampleDescription: 'Nét mảnh bo cong tinh tế'
  },
  {
    id: 'lato',
    name: 'Lato',
    family: "'Lato', sans-serif",
    category: 'minimal',
    previewText: 'Signature Blend 2026',
    sampleDescription: 'Cân bằng, cổ điển và hiện đại'
  },
  {
    id: 'raleway',
    name: 'Raleway',
    family: "'Raleway', sans-serif",
    category: 'modern',
    previewText: 'ESPIRIT DE PARIS',
    sampleDescription: 'Thanh lịch, thời trang cao cấp'
  },
  {
    id: 'oswald',
    name: 'Oswald',
    family: "'Oswald', sans-serif",
    category: 'bold',
    previewText: 'STRONG COFFEE ROAST',
    sampleDescription: 'Nét cao, hẹp, đậm chất poster'
  },
  {
    id: 'anton',
    name: 'Anton',
    family: "'Anton', sans-serif",
    category: 'bold',
    previewText: 'CUPFY BOLD 100%',
    sampleDescription: 'Cực đậm, nổi bật tuyệt đối'
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    family: "'Playfair Display', serif",
    category: 'elegant',
    previewText: 'Ký Ức Hoàng Hôn',
    sampleDescription: 'Serif cổ điển sang trọng bậc nhất'
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    family: "'Merriweather', serif",
    category: 'elegant',
    previewText: 'Góc Phố Trà Chiều',
    sampleDescription: 'Serif ấm cúng, êm dịu, tinh tế'
  },
  {
    id: 'lora',
    name: 'Lora',
    family: "'Lora', serif",
    category: 'elegant',
    previewText: 'Một Ngày Bình Yên',
    sampleDescription: 'Serif văn học nghệ thuật lãng mạn'
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    family: "'DM Sans', sans-serif",
    category: 'minimal',
    previewText: 'Design Matters Always',
    sampleDescription: 'Tối giản phong cách Bắc Âu'
  },
  {
    id: 'manrope',
    name: 'Manrope',
    family: "'Manrope', sans-serif",
    category: 'modern',
    previewText: 'Studio Craftsmanship',
    sampleDescription: 'Hình học đương đại sắc sảo'
  },
  {
    id: 'plus-jakarta-sans',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', sans-serif",
    category: 'modern',
    previewText: 'Vươn Tới Đỉnh Cao 🚀',
    sampleDescription: 'Hiện đại, chuyên nghiệp, uyển chuyển'
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    family: "'Work Sans', sans-serif",
    category: 'modern',
    previewText: 'Cà Phê Muối Sài Gòn',
    sampleDescription: 'Kiến trúc hình học sắc cạnh'
  },
  {
    id: 'noto-sans',
    name: 'Noto Sans',
    family: "'Noto Sans', sans-serif",
    category: 'minimal',
    previewText: 'Nguyên Bản Tinh Khiết',
    sampleDescription: 'Chuẩn hiển thị quốc tế chuẩn xác'
  },
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    family: "'Dancing Script', cursive",
    category: 'script',
    previewText: 'Thương Gửi Một Người 💕',
    sampleDescription: 'Chữ viết tay uyển chuyển mềm mại'
  },
  {
    id: 'pacifico',
    name: 'Pacifico',
    family: "'Pacifico', cursive",
    category: 'script',
    previewText: 'Aloha Coffee Vibes 🌊',
    sampleDescription: 'Bút lông retro phóng khoáng'
  }
];

export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Anton&family=Be+Vietnam+Pro:wght@400;600;700&family=Dancing+Script:wght@600;700&family=DM+Sans:wght@400;700&family=Inter:wght@400;600;700&family=Lato:wght@400;700&family=Lora:ital,wght@0,400;0,700&family=Manrope:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;600;700&family=Noto+Sans:wght@400;700&family=Nunito:wght@400;700&family=Open+Sans:wght@400;700&family=Oswald:wght@500;700&family=Pacifico&family=Playfair+Display:ital,wght@0,600;0,700&family=Plus+Jakarta+Sans:wght@400;700&family=Poppins:wght@400;600;700&family=Quicksand:wght@500;700&family=Raleway:wght@400;700&family=Roboto:wght@400;700&family=Work+Sans:wght@400;700&subset=vietnamese&display=swap';

export const FONT_CATEGORIES = [
  { key: 'all', label: 'Tất Cả (22)' },
  { key: 'modern', label: 'Hiện Đại' },
  { key: 'minimal', label: 'Tối Giản' },
  { key: 'elegant', label: 'Thanh Lịch (Serif)' },
  { key: 'bold', label: 'Đậm Nét' },
  { key: 'script', label: 'Viết Tay / Cute' }
] as const;
