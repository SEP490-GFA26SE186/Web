// import api from "./api";

// TODO: bỏ mock khi BE hoàn thiện API
const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Đăng ký nhanh từ Landing page: gửi link kích hoạt tới email phụ huynh */
export const requestSignup = async (email) => {
  if (USE_MOCK) {
    await delay(700);
    if (!EMAIL_REGEX.test(email)) throw new Error("Email chưa đúng định dạng");
    if (email.toLowerCase().endsWith("@test.com")) throw new Error("Email này đã được đăng ký, ba mẹ đăng nhập nhé");
    return { email, sent: true };
  }
  // const { data } = await api.post("/auth/signup-request", { email });
  // return data;
};

const PHONE_REGEX = /^(0|\+84)\d{9}$/;
export const isValidIdentity = (value) => EMAIL_REGEX.test(value) || PHONE_REGEX.test(value.replace(/\s/g, ""));

/**
 * identity: email hoặc số điện thoại. Trả về { user, token }.
 * user.role: "parent" | "moderator" | "admin"
 */
export const login = async (identity, password) => {
  if (USE_MOCK) {
    const { MOCK_ACCOUNTS } = await import("../mocks/auth");
    await delay(900);
    const id = identity.trim().toLowerCase().replace(/\s/g, "").replace(/^\+84/, "0");
    const account = MOCK_ACCOUNTS.find((a) => a.email === id || a.phone === id);
    if (!account || account.password !== password) {
      throw new Error("Email/Số điện thoại hoặc mật khẩu chưa đúng");
    }
    return { user: account.user, token: `mock-token-${account.user.id}-${Date.now()}` };
  }
  // const { data } = await api.post("/auth/login", { identity, password });
  // return data;
};

/** Đăng nhập bằng Google / Apple. Mock: đăng nhập luôn bằng tài khoản phụ huynh demo */
export const loginWithProvider = async (provider) => {
  if (USE_MOCK) {
    const { MOCK_ACCOUNTS } = await import("../mocks/auth");
    await delay(1000);
    const { user } = MOCK_ACCOUNTS[0];
    return { user, token: `mock-${provider}-token-${Date.now()}` };
  }
  // Thật: chuyển hướng sang OAuth của BE, ví dụ window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`
};

export const requestPasswordReset = async (identity) => {
  if (USE_MOCK) {
    await delay(700);
    if (!isValidIdentity(identity.trim())) throw new Error("Email hoặc số điện thoại chưa đúng định dạng");
    return { sent: true };
  }
  // const { data } = await api.post("/auth/forgot-password", { identity });
  // return data;
};
