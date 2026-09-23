export const translations = {
  vi: {
    // Header
    "Shop": "Cửa hàng",
    "Design Your Cup ✨": "Thiết Kế Ly ✨",
    "Templates": "Mẫu Ly",
    "Community": "Cộng Đồng",
    "Gifts": "Quà Tặng",
    "About": "Giới Thiệu",
    "Search products, templates...": "Tìm sản phẩm, mẫu...",
    "Cart": "Giỏ hàng",
    "Profile": "Tài khoản",
    
    // Auth & Generic
    "Logout": "Đăng xuất",
    "Login": "Đăng nhập",
    "Register": "Đăng ký",
    
    // Custom Cup
    "Select Model": "Chọn Mẫu Ly",
    "Colors": "Màu sắc",
    "Text": "Chữ",
    "Sticker": "Nhãn dán",
    "Image": "Ảnh",
    "Cup Color": "Màu thân ly",
    "Lid Color": "Màu nắp",
    "Font Style": "Phông chữ",
    "Text Color": "Màu chữ",
    "Enter text...": "Nhập nội dung...",
    "Adjust Position": "Điều chỉnh Vị trí",
    "Rotate": "Xoay ngang",
    "Height": "Độ cao",
    "Size": "Kích thước",
    "Upload Image": "Tải ảnh lên",
    "Remove": "Xoá",
    "Drag to rotate 360°": "Kéo chuột để xoay 360°",
    "My Design ✨": "Thiết kế của tôi ✨",
    "ADD TO CART": "THÊM VÀO GIỎ",
    "ADDED": "ĐÃ THÊM",
    "Basic": "Cơ bản",
    "Soft": "Mềm mại",
    "Classic": "Cổ điển",
    "Creative": "Phá cách",
    
    // Homepage
    "Find your cup. Make it yours.": "Find your cup. Make it yours.",
    "Everyday cups with your own story.": "Những chiếc ly nhỏ xinh cho mọi khoảnh khắc hằng ngày của bạn.",
    "Start Designing": "Thiết kế ngay",
    "Explore Shop": "Khám phá cửa hàng",
    "Best Sellers": "Bán Chạy Nhất",
    "Featured Templates": "Mẫu Nổi Bật",
    "Out of stock": "Hết hàng",
    "Add to cart": "Thêm vào giỏ",
    "Glass Cup": "Ly thuỷ tinh",
    "Thermos": "Ly giữ nhiệt",
    "Plastic Cup": "Ly nhựa",
    "Customer Care": "Chăm sóc khách hàng",
    "Shipping Policy": "Chính sách giao hàng",
    "Return Policy": "Chính sách đổi trả",
    "FAQ": "Câu hỏi thường gặp",
    "Contact": "Liên hệ",
    "Connect": "Kết nối",
    "Design": "Thiết kế",
    "Total": "Tổng cộng",
    "Subtotal": "Tạm tính",
    "Checkout": "Thanh toán",
    "Empty Cart": "Giỏ hàng trống",
    "Continue Shopping": "Tiếp tục mua sắm"
  },
  en: {
    // Header
    "Shop": "Shop",
    "Design Your Cup ✨": "Design Your Cup ✨",
    "Templates": "Templates",
    "Community": "Community",
    "Gifts": "Gifts",
    "About": "About",
    "Search products, templates...": "Search products, templates...",
    "Cart": "Cart",
    "Profile": "Profile",
    
    // Auth & Generic
    "Logout": "Logout",
    "Login": "Login",
    "Register": "Register",

    // Custom Cup
    "Select Model": "Select Model",
    "Colors": "Colors",
    "Text": "Text",
    "Sticker": "Sticker",
    "Image": "Image",
    "Cup Color": "Cup Color",
    "Lid Color": "Lid Color",
    "Font Style": "Font Style",
    "Text Color": "Text Color",
    "Enter text...": "Enter text...",
    "Adjust Position": "Adjust Position",
    "Rotate": "Rotate",
    "Height": "Height",
    "Size": "Size",
    "Upload Image": "Upload Image",
    "Remove": "Remove",
    "Drag to rotate 360°": "Drag to rotate 360°",
    "My Design ✨": "My Design ✨",
    "ADD TO CART": "ADD TO CART",
    "ADDED": "ADDED",
    "Basic": "Basic",
    "Soft": "Soft",
    "Classic": "Classic",
    "Creative": "Creative",
    
    // Homepage
    "Find your cup. Make it yours.": "Find your cup. Make it yours.",
    "Everyday cups with your own story.": "Everyday cups with your own story.",
    "Start Designing": "Start Designing",
    "Explore Shop": "Explore Shop",
    "Best Sellers": "Best Sellers",
    "Featured Templates": "Featured Templates",
    "Out of stock": "Out of stock",
    "Add to cart": "Add to cart",
    "Glass Cup": "Glass Cup",
    "Thermos": "Thermos",
    "Plastic Cup": "Plastic Cup",
    "Customer Care": "Customer Care",
    "Shipping Policy": "Shipping Policy",
    "Return Policy": "Return Policy",
    "FAQ": "FAQ",
    "Contact": "Contact",
    "Connect": "Connect",
    "Design": "Design",
    "Total": "Total",
    "Subtotal": "Subtotal",
    "Checkout": "Checkout",
    "Empty Cart": "Empty Cart",
    "Continue Shopping": "Continue Shopping"
  }
};

export type TranslationKey = keyof typeof translations.en;

export function useTranslation() {
  // We'll import useLanguageStore where this is used
  return (key: TranslationKey, lang: 'vi' | 'en') => {
    return translations[lang][key] || key;
  };
}
