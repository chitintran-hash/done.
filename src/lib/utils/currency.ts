/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam Đồng (VND).
 * Ví dụ: 100000 -> "100.000 ₫"
 */
export const formatVND = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '0 ₫';
  const num = typeof value === 'string' ? parseVND(value) : value;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

/**
 * Phân tích chuỗi số có dấu phẩy/chấm thành số nguyên.
 * Loại bỏ tất cả các ký tự không phải là số.
 * Ví dụ: "100,000" -> 100000
 */
export const parseVND = (value: string): number => {
  if (!value) return 0;
  // Loại bỏ tất cả ký tự không phải số
  const cleanValue = value.replace(/\D/g, '');
  const num = parseInt(cleanValue, 10);
  return isNaN(num) ? 0 : num;
};

/**
 * Định dạng chuỗi số khi người dùng đang nhập liệu (tự động thêm dấu phẩy).
 * Ví dụ: "100000" -> "100,000"
 */
export const formatInputVND = (value: string): string => {
  if (!value) return '';
  const cleanValue = value.replace(/\D/g, '');
  if (!cleanValue) return '';
  return new Intl.NumberFormat('en-US').format(parseInt(cleanValue, 10)); // Dùng en-US để hiển thị dấu phẩy 100,000
};
