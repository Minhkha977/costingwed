import axios from 'axios';

export default axios.create({
    baseURL: `http://apps02.japfa.com.vn:52447/`,
    // baseURL: `http://localhost:56027/`,
});
