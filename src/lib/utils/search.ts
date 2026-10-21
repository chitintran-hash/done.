/**
 * Chuẩn hóa chuỗi tiếng Việt: chuyển thành chữ thường, bỏ dấu thanh, đ/Đ -> d
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

/**
 * Kiểm tra xem chuỗi nguồn (target) có chứa tất cả các từ khóa trong câu truy vấn (query) hay không.
 * Hỗ trợ tìm kiếm tiếng Việt không dấu, không phân biệt hoa thường, đa từ khóa không phân biệt vị trí.
 * Ví dụ: query "ly cao" khớp với "Ly Thuỳ Tinh Cao"
 */
export function matchesSearchQuery(target: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!target) return false;

  const normTarget = removeVietnameseTones(target);
  const queryTokens = removeVietnameseTones(query)
    .split(/\s+/)
    .filter(Boolean);

  if (queryTokens.length === 0) return true;

  return queryTokens.every((token) => normTarget.includes(token));
}
