import axios from 'axios';
import { it, describe } from 'mocha';
import { assert, expect } from 'chai';
import config from '../../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});

describe('GET /', () => {
    it('should return a 200 status code', async () => {
        await api.get('/').then(res => {
            expect(res.status).to.equal(200);
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
    });
    it('should return a message', async () => {
        await api.get('/').then(res => {
            expect(res.data.message).to.not.be.undefined;
            expect(res.data.available).to.be.true;
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
    });
});