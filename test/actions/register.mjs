import axios from 'axios';
import config from '../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});

const register = async () => {
    return new Promise(async (resolve, reject) => {
        await api.post('/auth/register', {
            username: config.USERNAME,
            email: config.EMAIL,
            password: config.PASSWORD
        }).then(res => {
            resolve(res.data.token);
        }).catch(err => {
            reject(err);
        });
    });
}

export default register;