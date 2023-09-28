import axios from 'axios';
import { it, describe } from 'mocha';
import { assert, expect } from 'chai';
import register from '../../../actions/register.mjs'
import deleteUser from '../../../actions/deleteUser.mjs'
import config from '../../../config.mjs';
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});

describe('POST /auth/login', () => {
    it('should return 200 if the user is logged in successfully', async () => {
        const token = await register();
        await api.post('/auth/login', {
            email: config.EMAIL,
            password: config.PASSWORD
        }).then(res => {
            expect(res.status).to.equal(200);
            expect(res.data.message).to.equal('Logged in successfully');
            expect(res.data.token).to.not.be.undefined;
            expect(res.data.user).to.not.be.undefined;
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
        await deleteUser(token);
    });

    it('should return 400 if the email is not sent', async () => {
        await api.post('/auth/login', {
            password: config.PASSWORD
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.not.be.undefined;
        });
    });

    it('should return 400 if the password is not sent', async () => {
        await api.post('/auth/login', {
            email: config.EMAIL
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.not.be.undefined;
        });
    });

    it('should return 400 if the email is invalid', async () => {
        await api.post('/auth/login', {
            email: config.EMAIL.replace('@', ''),
            password: config.PASSWORD
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.not.be.undefined;
        });
    });

    it('should return 400 if the password is less than 5', async () => {
        await api.post('/auth/login', {
            email: config.EMAIL,
            password: config.PASSWORD.substring(0, 3)
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.not.be.undefined;
        });
    });

    it('should return 404 if the email is not found', async () => {
        await api.post('/auth/login', {
            email: config.EMAIL.replace('@', 'a@'),
            password: config.PASSWORD
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(404);
            expect(err.response.data.error).to.equal('Invalid informations');
        });
    });

    it('should return 404 if the password is incorrect', async () => {
        await api.post('/auth/login', {
            email: config.EMAIL,
            password: config.PASSWORD.substring(0, 5)
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(404);
            expect(err.response.data.error).to.equal('Invalid informations');
        });
    });
});