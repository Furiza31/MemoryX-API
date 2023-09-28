import axios from 'axios';
import { it, describe } from 'mocha';
import { expect, assert } from 'chai';
import config from '../../../config.mjs';
import deleteUser from '../../../actions/deleteUser.mjs'
import register from '../../../actions/register.mjs'
const api = axios.create({
    baseURL: `http://localhost:${config.PORT}`
});

describe('POST /auth/register', () => {

    it('should return 200 if the user is created successfully', async () => {
        await api.post('/auth/register', {
            username: config.USERNAME,
            email: config.EMAIL,
            password: config.PASSWORD
        }).then(async res => {
            expect(res.status).to.equal(200);
            expect(res.data.message).to.equal('Account created successfully');
            expect(res.data.token).to.not.be.undefined;
            expect(res.data.user).to.not.be.undefined;
            await deleteUser(res.data.token);
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
    });

    it('should return 400 if the username is not sent', async () => {
        await api.post('/auth/register', {
            email: config.EMAIL,
            password: config.PASSWORD
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.not.be.undefined;
        });
    });

    it('should return 400 if the email is not sent', async () => {
        await api.post('/auth/register', {
            username: config.USERNAME,
            password: config.PASSWORD
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.not.be.undefined;
        });
    });

    it('should return 400 if the password is not sent', async () => {
        await api.post('/auth/register', {
            username: config.USERNAME,
            email: config.EMAIL
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.not.be.undefined;
        });
    });

    it('should return 400 if the email is invalid', async () => {
        await api.post('/auth/register', {
            username: config.USERNAME,
            email: config.EMAIL.replace('@', ''),
            password: config.PASSWORD
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.not.be.undefined;
        });
    });

    it('should return 400 if the password is less than 5 characters', async () => {
        await api.post('/auth/register', {
            username: config.USERNAME,
            email: config.EMAIL,
            password: config.PASSWORD.substring(0, 3)
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.errors).to.not.be.undefined;
        });
    });

    it('should return 400 if the email already exists', async () => {
        const token = await register();
        await api.post('/auth/register', {
            username: config.USERNAME,
            email: config.EMAIL,
            password: config.PASSWORD
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(400);
            expect(err.response.data.error).to.equal('Email already exists');
        });
        await deleteUser(token);
    });
});
