import axios from 'axios';
import { it, describe } from 'mocha';
import { assert, expect } from 'chai';
import register from '../../actions/register.mjs'
import deleteUser from '../../actions/deleteUser.mjs'
import createCheckList from '../../actions/createCheckList.mjs'
import config from '../../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});
const data = {
    name: "Test checklist item",
    description: "Test checklist item description",
    date: "2020-01-01",
}

describe('POST /task/:checkListId', () => {

    it('should return 401 if not authenticated', async () => {
        await api.post('/task/9999', data).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(401);
            expect(err.response.data.error).to.equal('No token provided');
            expect(err.response.data.invalidToken).to.equal(true);
        });
    });

    it('should return 401 if the token is invalid', async () => {
        await api.post('/task/9999', data, {
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

    it('should return 400 if the name is missing', async () => {
        const token = await register();
        await api.post('/task/9999', {
            description: "Test checklist item description",
            date: "2020-01-01",
        } ,{
            headers: {
                authorization: token
            }
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.error).to.not.be.undefined;
        });
        await deleteUser(token);
    });

    it('should return 400 if the date is missing', async () => {
        const token = await register();
        await api.post('/task/9999', {
            name: "Test checklist item",
            description: "Test checklist item description",
        } ,{
            headers: {
                authorization: token
            }
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.error).to.not.be.undefined;
        });
        await deleteUser(token);
    });

    it('should return 404 if the checklist is not found', async () => {
        const token = await register();
        await api.post('/task/9999', data, {
            headers: {
                authorization: token
            }
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(404);
            expect(err.response.data.error).to.equal('Check list 9999 not found');
        });
        await deleteUser(token);
    });

    it('should return 200 if the checklist item has been created', async () => {
        const token = await register();
        let checkListId = await createCheckList(token);
        await api.post('/task/' + checkListId, data, {
            headers: {
                authorization: token
            }
        }).then(async res => {
            expect(res.status).to.equal(200);
            expect(res.data.task).to.not.be.undefined;
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
        await deleteUser(token);
    });
});