import axios from 'axios';
import config from '../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});
const data = {
    name: "Test CheckList",
}

const createCheckList = async (token) => {
    return new Promise(async (resolve, reject) => {
        await api.post('/checklists', data, {
            headers: {
                authorization: token
            }
        }).then(res => {
            resolve(res.data.checkList.id);
        }).catch(err => {
            reject(err);
        });
    });
}

export default createCheckList;