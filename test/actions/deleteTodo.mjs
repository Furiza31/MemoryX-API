import axios from 'axios';
import config from '../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});

const deleteTodo = async (token, id) => {
    await api.delete('/todo/' + id ,{
        headers: {
            authorization: token
        }
    })
}

export default deleteTodo;