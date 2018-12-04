import comm from "../js/common"
import axios from "../js/axios"

let defaultParam = {
	timeStamp : new Date().getTime()
}

// Add a request interceptor
axios.interceptors.request.use(function (config) {
	return config;
}, function (error) {
	return Promise.reject(error);
});
// Add a response interceptor
axios.interceptors.response.use(function (response) {
	return response;
}, function (error) {
	return Promise.reject(error);
});


export default {
	axios:axios
}

