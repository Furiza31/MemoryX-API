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

describe('GET /task/:checklistId', () => {

    it('should return 401 if not authenticated', async () => {
        await api.get('/task/9999').then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(401);
            expect(err.response.data.error).to.equal('No token provided');
            expect(err.response.data.invalidToken).to.equal(true);
        });
    });

    it('should return 401 if the token is invalid', async () => {
        await api.get('/task/9999', {
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

    it('should return 404 if the checklist is not found', async () => {
        const token = await register();
        await api.get('/task/9999', {
            headers: {
                authorization: token
            }
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(404);
            expect(err.response.data.error).to.equal('Check list items not found');
        });
        await deleteUser(token);
    });

    it('should return 200 if checklists are fetched successfully', async () => {
        const token = await register();
        let checkListId = await createCheckList(token);
        await api.get('/task/' + checkListId, {
            headers: {
                authorization: token
            }
        }).then(async res => {
            expect(res.status).to.equal(200);
            expect(res.data.checkList).to.not.be.undefined;
            expect(res.data.tasks).to.not.be.undefined;
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
        await deleteUser(token);
    });

});