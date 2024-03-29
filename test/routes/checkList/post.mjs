import axios from 'axios';
import { it, describe } from 'mocha';
import { assert, expect } from 'chai';
import register from '../../actions/register.mjs'
import deleteUser from '../../actions/deleteUser.mjs'
import config from '../../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});
const data = {
    name: "Test checklist",
}

describe('POST /checklist', () => {

    it('should return 401 if not authenticated', async () => {
        await api.post('/checklist', data).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(401);
            expect(err.response.data.error).to.equal('No token provided');
            expect(err.response.data.invalidToken).to.equal(true);
        });
    });

    it('should return 401 if the token is invalid', async () => {
        await api.post('/checklist', data, {
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
        await api.post('/checklist', {
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

    it('should return 200 if the checklist has been created', async () => {
        const token = await register();
        await api.post('/checklist', data, {
            headers: {
                authorization: token
            }
        }).then(async res => {
            expect(res.status).to.equal(200);
            expect(res.data.message).to.equal('Check list created successfully');
            expect(res.data.checkList).to.not.be.undefined;
            expect(res.data.checkList.id).to.not.be.undefined;
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
        await deleteUser(token);
    });
});