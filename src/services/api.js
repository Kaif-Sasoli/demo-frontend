import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => {
        callback(newAccessToken);
    });

    refreshSubscribers = [];
};


// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
    (config) => {

        const accessToken =
            localStorage.getItem("accessToken");

        if (accessToken) {

            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(

    // Successful response
    (response) => {
        return response;
    },

    // Error response
    async (error) => {

        const originalRequest = error.config;


        // Only handle 401
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh")
        ) {

            originalRequest._retry = true;


            // ========================================
            // Another request is already refreshing
            // ========================================

            if (isRefreshing) {

                return new Promise((resolve) => {

                    subscribeTokenRefresh(
                        (newAccessToken) => {

                            originalRequest.headers.Authorization =
                                `Bearer ${newAccessToken}`;

                            resolve(
                                api(originalRequest)
                            );
                        }
                    );

                });
            }


            // ========================================
            // Start refresh
            // ========================================

            isRefreshing = true;

            try {

                const response =
                    await api.post("/auth/refresh");


                const newAccessToken =
                    response.data.accessToken;


                // Store new access token
                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );


                isRefreshing = false;


                // Resolve requests waiting for refresh
                onRefreshed(newAccessToken);


                // ========================================
                // Retry original request
                // ========================================

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);


            } catch (refreshError) {

                isRefreshing = false;

                refreshSubscribers = [];


                // Refresh token also expired/invalid
                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "user"
                );


                window.location.href =
                    "/login";


                return Promise.reject(
                    refreshError
                );
            }
        }


        return Promise.reject(error);
    }
);

export default api;