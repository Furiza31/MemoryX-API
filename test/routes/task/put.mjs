import axios from 'axios';
import { it, describe } from 'mocha';
import { assert, expect } from 'chai';
import register from '../../actions/register.mjs'
import deleteUser from '../../actions/deleteUser.mjs'
import createCheckList from '../../actions/createCheckList.mjs'
import createTask from '../../actions/createTask.mjs';
import config from '../../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});
const data = {
    name: "Test checklist item",
    description: "Test checklist item description",
    date: "2020-01-01",
    done: true
}

describe('PUT /task/:checkListId/:taskId', () => {

    it('should return 401 if not authenticated', async () => {
        await api.put('/task/9999/9999', data).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(401);
            expect(err.response.data.error).to.equal('No token provided');
            expect(err.response.data.invalidToken).to.equal(true);
        });
    });

    it('should return 401 if the token is invalid', async () => {
        await api.put('/task/9999/9999', data, {
            headers: {
                authorization: config.INVALID_TOKEN
            }
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(401);
            expect(err.response.data.error).to.equal('Invalid token');
            expect(err.response.data.invalidToken).to.equal(true);
        });
    });

    it('should return 404 if the check list task does not exist', async () => {
        const token = await register();
        const checkListId = await createCheckList(token);
        await api.put(`/task/${checkListId}/9999`, data, {
            headers: {
                authorization: token
            }
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(404);
            expect(err.response.data.error).to.equal(`Check list task 9999 not found`);
        });
        await deleteUser(token);
    });

    it('should return 200 if the check list item has been modified', async () => {
        const token = await register();
        const checkListId = await createCheckList(token);
        const taskId = await createTask(token, checkListId);
        await api.put(`/task/${checkListId}/${taskId}`, data, {
            headers: {
                authorization: token
            }
        }).then(async res => {
            expect(res.status).to.equal(200);
            expect(res.data.message).to.equal(`Check list task ${taskId} updated successfully`);
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
        await deleteUser(token);
    });
});