// axios -- communicate with backend (JS library to make HTTP requests and recieve responses)
import axios from "axios";
import { BASE_URL } from "./apiPaths";

// custom axios instance
// configuring it
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // in ms
    timeout: 80000,
    headers: {
        // to tell server that I am sending JSON data
        "Content-Type": "application/json",
        // i accept (or expect) JSON data
        Accept: "application/json",
    },
});

// now collect data from user using forms and send the fields (the user entered values) through axios

// request interceptor
// interceptor runs before every HTTP request -- used to modify requests before sending them or to handle errors
axiosInstance.interceptors.request.use(
    (config) => {
        // from browser's local storage
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    // handling errors before request is sent (example invalid config)
    (error) => {
        // promise for axios request
        // passes error to catch() (used when making request from axios)
        return Promise.reject(error);
    }
);
// used to put accessToken before every request (because we made the requests in such a way that they requier access token)

// response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // server did response, but respnse was not successful
        if(error.response) {
            // just for user-friendly message
            if(error.response.status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if(error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;