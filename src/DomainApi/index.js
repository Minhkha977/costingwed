import axios from 'axios';
// pro: https://gdsouth.japfa.com.vn:62450/
// dev: http://apps02.japfa.com.vn:52447/
// local: http://localhost:56027/

export default axios.create({
    baseURL: `https://gdsouth.japfa.com.vn:62450/`,
    // baseURL: `http://apps02.japfa.com.vn:52447/`,
});
