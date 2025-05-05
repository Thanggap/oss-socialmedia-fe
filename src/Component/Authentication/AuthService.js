import axios from "axios";

export const API_URL = "https://oss-socialmedia-hjfpcheyfpb4eva5.canadacentral-01.azurewebsites.net";

// Tạo instance Axios có cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm để lấy token từ localStorage
const getToken = () => localStorage.getItem("token");
const getUserId = () => localStorage.getItem("userId");

// Thêm interceptor để đính kèm token vào mỗi request
api.interceptors.request.use((config) => {
  const token = getToken();
  const userId = getUserId();
  if (token && userId) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });

      // Kiểm tra nếu có token và user.id
      if (response.data.access_token && response.data.user?.id) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("userId", response.data.user.id);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || "Login failed";
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Registration failed";
    }
  },

  logout: async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login"; // Chuyển hướng sau khi logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  },

  verifyEmail: async (email) => {
    try {
      const response = await api.post("/verify-email", {
        recipientEmails: [email],
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to send verification email";
    }
  },
};

export default authService;
