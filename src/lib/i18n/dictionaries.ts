export type Language = 'vi' | 'en';

export const dictionaries = {
  vi: {
    'nav.home': 'Trang chủ',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.logout': 'Đăng xuất',
    'nav.admin': 'Admin',
    'nav.seller': 'Kênh nhà bán',
    'nav.cart': 'Giỏ hàng',
    
    'home.hero.title': 'Bạn muốn hoàn thành điều gì?',
    'home.hero.subtitle': 'Đừng mua nội thất rời rạc. Hãy mua một giải pháp làm việc.',
    'home.hero.start': 'Bắt đầu tạo Solution',
    'home.hero.login': 'Đăng nhập để lưu',
    
    'builder.step.goal': 'Bạn muốn hoàn thành điều gì?',
    'builder.step.budget': 'Ngân sách tối đa của bạn?',
    'builder.step.space': 'Kích thước không gian (chiều rộng)?',
    'builder.step.style': 'Phong cách bạn hướng tới?',
    'builder.step.owned': 'Bạn đã có sẵn những thiết bị nào?',
    'builder.step.deadline': 'Thời hạn bạn cần nhận hàng?',
    'builder.btn.continue': 'Tiếp tục',
    'builder.btn.finish': 'Xây Dựng Solution',

    'solutions.title': 'Giải pháp dành riêng cho bạn',
    'solutions.subtitle': 'DONE. đã chọn lọc và tính toán độ tương thích phần cứng để đưa ra 3 phương án tối ưu nhất.',
    'solutions.type.budget': 'Giải Pháp Tiết Kiệm',
    'solutions.type.best-fit': 'Phù Hợp Nhất',
    'solutions.type.premium': 'Giải Pháp Nâng Cấp',
    'solutions.btn.view': 'Xem chi tiết',
  },
  en: {
    'nav.home': 'Home',
    'nav.login': 'Login',
    'nav.register': 'Sign Up',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    'nav.seller': 'Seller Center',
    'nav.cart': 'Cart',
    
    'home.hero.title': 'What do you want to get DONE?',
    'home.hero.subtitle': 'Don\'t buy isolated furniture. Buy a complete working solution.',
    'home.hero.start': 'Start Building Solution',
    'home.hero.login': 'Login to save',
    
    'builder.step.goal': 'What do you want to achieve?',
    'builder.step.budget': 'What is your maximum budget?',
    'builder.step.space': 'Available space width?',
    'builder.step.style': 'Preferred style?',
    'builder.step.owned': 'What equipment do you already own?',
    'builder.step.deadline': 'When do you need it by?',
    'builder.btn.continue': 'Continue',
    'builder.btn.finish': 'Build Solution',

    'solutions.title': 'Solutions tailored for you',
    'solutions.subtitle': 'DONE. has filtered and calculated hardware compatibility to bring you the 3 most optimal options.',
    'solutions.type.budget': 'Budget Solution',
    'solutions.type.best-fit': 'Best Fit',
    'solutions.type.premium': 'Premium Upgrade',
    'solutions.btn.view': 'View Details',
  }
};

export type DictionaryKey = keyof typeof dictionaries.vi;
