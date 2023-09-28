import axios from 'axios';
import config from '../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});
const data = {
    title: "Test Todo",
    content: "Test todo content"
}

const createTodo = async (token) => {
    return new Promise(async (resolve, reject) => {
        await api.post('/todo', data, {
            headers: {
                authorization: token
            }
        }).then(res => {
            resolve(res.data.todo.id);
        }).catch(err => {
            reject(err);
        });
    });
}

export default createTodo;