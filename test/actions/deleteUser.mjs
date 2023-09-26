import axios from 'axios';
import config from '../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});

const deleteUser = async (token) => {
    await api.delete('/user', {
        headers: {
            authorization: token
        }
    })
}

export default deleteUser;