// API Configuration and Base Setup
import axios from "axios";
import { toast } from "react-toastify";
import i18n from "../i18n";

// Create axios instance with base configuration
const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  timeout: 20000000,
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --- Refresh Token Handling State ---
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Accept-Language header based on current i18n language
    config.headers["Accept-Language"] = i18n.language || "en";

    // Attach clinic context only when explicitly selected.
    try {
      const selected = localStorage.getItem("selectedClinicId");

      // If user picked "الكل" via ClinicSelector, we clear selectedClinicId => no header.
      if (selected && selected !== "null" && selected !== "undefined" && selected !== "ALL") {
        config.headers["X-Clinic-Id"] = selected;
      } else {
        // Ensure header is not present when no clinic explicitly selected
        delete config.headers["X-Clinic-Id"];
      }
    } catch (error) {
      console.error("API Interceptor - Error getting selectedClinicId:", error);
    }

    // Attach organization context from login
    try {
      const organizationId = localStorage.getItem("organizationId");
      if (organizationId && organizationId !== "null" && organizationId !== "undefined") {
        config.headers["X-Organization-Id"] = organizationId;
      } else {
        delete config.headers["X-Organization-Id"];
      }
    } catch (error) {
      console.error("API Interceptor - Error getting organizationId:", error);
    }

    // Attach storage context only when explicitly selected.
    try {
      const selectedStorage = localStorage.getItem("selectedStorageId");

      // If user picked "الكل" via StorageSelector, we clear selectedStorageId => no header.
      if (selectedStorage && selectedStorage !== "null" && selectedStorage !== "undefined") {
        config.headers["X-Storage-Id"] = selectedStorage;
      } else {
        // Ensure header is not present when no storage explicitly selected
        delete config.headers["X-Storage-Id"];
      }
    } catch (error) {
      console.error("API Interceptor - Error getting selectedStorageId:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Prevent duplicate error toasts in a short window
let __lastErrorToastTime = 0;
let __lastErrorToastMsg = "";
const __showErrorToastOnce = (msg) => {
  const now = Date.now();
  if (now - __lastErrorToastTime > 1500 || __lastErrorToastMsg !== msg) {
    toast.error(msg);
    __lastErrorToastTime = now;
    __lastErrorToastMsg = msg;
  }
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, config: originalRequest } = error;
    let errorMessage = "حدث خطأ غير متوقع";

    if (response) {
      // If unauthorized, try to refresh once
      if (
        response.status === 401 &&
        !originalRequest?._retry &&
        !originalRequest?.url?.includes("/auth/login") &&
        !originalRequest?.url?.includes("/auth/refresh")
      ) {
        originalRequest._retry = true;

        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            // Set new token on the original request and retry
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${newToken}`,
            };
            resolve(api(originalRequest));
          });

          if (!isRefreshing) {
            isRefreshing = true;
            api
              .post("/auth/refresh")
              .then((resp) => {
                const data = resp?.data;
                const accessToken =
                  data?.data?.accessToken ||
                  data?.Data?.AccessToken ||
                  data?.accessToken ||
                  data?.AccessToken;

                if (accessToken) {
                  localStorage.setItem("authToken", accessToken);
                  onRefreshed(accessToken);
                } else {
                  // Failed to parse new token
                  onRefreshed(null);
                }
              })
              .catch(() => {
                onRefreshed(null);
              })
              .finally(() => {
                isRefreshing = false;
              });
          }
        });
      }

      // Prefer the more specific error message from the backend if available
      const backendErrors = response.data?.errors || response.data?.Errors;
      if (backendErrors && backendErrors.length > 0) {
        errorMessage = backendErrors[0];
        __showErrorToastOnce(errorMessage);
      } else {
        // Handle specific status codes if no detailed error is provided
        switch (response.status) {
          // case 400:
          //   errorMessage = response.data?.message || 'بيانات غير صالحة';
          //   break;
          case 401:
            errorMessage = "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى";
            // If we reached here, refresh failed. Clear and redirect.
            localStorage.removeItem("authToken");
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
            break;
          case 403:
            errorMessage = "غير مصرح. ليس لديك الصلاحيات الكافية";
            break;
        }
        if (!error.config?.url?.includes("/auth/login")) {
          __showErrorToastOnce(errorMessage);
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "لا يوجد اتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت";
      if (!error.config?.url?.includes("/auth/login")) {
        __showErrorToastOnce(errorMessage);
      }
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || "حدث خطأ أثناء إعداد الطلب";
      if (!error.config?.url?.includes("/auth/login")) {
        __showErrorToastOnce(errorMessage);
      }
    }

    // Return a rejected promise with the error
    return Promise.reject({
      message: errorMessage,
      status: response?.status,
      data: response?.data,
      originalError: error,
    });
  }
);

// Create a separate axios instance for binary/image requests (no JSON Accept header)
export const apiMedia = axios.create({
  baseURL: apiUrl,
  timeout: 20000000,
  withCredentials: true,
  responseType: 'blob', // For binary data like images
});

// Add auth token to media requests
apiMedia.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Accept-Language header based on current i18n language
    config.headers["Accept-Language"] = i18n.language || "en";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
