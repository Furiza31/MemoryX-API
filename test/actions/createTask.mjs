import axios from 'axios';
import config from '../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});
const data = {
    name: "Test checklist item",
    description: "Test checklist item description",
    date: "2020-01-01",
}

const createTask = async (token, checkListId) => {
    return new Promise(async (resolve, reject) => {
        await api.post(`/task/${checkListId}`, data, {
            headers: {
                authorization: token
            }
        }).then(res => {
            resolve(res.data.task.id);
        }).catch(err => {
            reject(err);
        });
    });
}

export default createTask;