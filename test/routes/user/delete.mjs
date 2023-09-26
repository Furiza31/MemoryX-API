import axios from 'axios';
import { it, describe } from 'mocha';
import { assert, expect } from 'chai';
import register from '../../actions/register.mjs'
import config from '../../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});

describe('DELETE /user', () => {
    
    it('should return 200 if the user is deleted successfully', async () => {
        const token = await register();
        await api.delete('/user', {
            headers: {
                authorization: token
            }
        }).then(async res => {
            expect(res.status).to.equal(200);
            expect(res.data.message).to.equal('User deleted successfully');
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
    });

    it('should return 401 if the user is not authenticated', async () => {
        await api.delete('/user').then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(401);
            expect(err.response.data.error).to.equal('No token provided');
            expect(err.response.data.invalidToken).to.equal(true);
        });
    });

    it('should return 401 if the token is invalid', async () => {
        await api.delete('/user', {
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
});