// BE lưu chữ truyện dạng token {NV1}, {NV2}… (tên thật không gửi cho AI). Khi hiển thị / sửa, đổi token
// thành tên theo danh sách nhân vật của truyện; khi lưu, gửi lại chữ có tên — BE tự đổi tên thành token
// (tokenizeOrReject) và báo lỗi nếu còn sót tên.

/** characters: [{ token: "{NV1}", name }] → chữ có tên. Token không có tên (alias trống) giữ nguyên. */
export function fillNames(text, characters = []) {
  if (text == null) return "";
  const byToken = new Map(characters.filter((c) => c.name).map((c) => [c.token, c.name]));
  return text.replace(/\{NV\d+\}/g, (token) => byToken.get(token) ?? token);
}

/** Tên nhân vật ứng với token, dùng cho nhãn "hỏi về …". */
export const nameOfToken = (token, characters = []) =>
  characters.find((c) => c.token === token)?.name ?? token;
