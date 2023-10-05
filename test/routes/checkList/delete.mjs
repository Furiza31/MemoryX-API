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

describe('DELETE /checklists/:id', () => {
    it('should return 401 if not authenticated', async () => {
        await api.delete('/checklists/0').then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(401);
            expect(err.response.data.error).to.equal('No token provided');
            expect(err.response.data.invalidToken).to.equal(true);
        });
    });

    it('should return 401 if the token is invalid', async () => {
        await api.delete('/checklists/0',{
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

    it('should return 404 if the id is missing', async () => {
        const token = await register();
        await api.delete('/checklists', {
            headers: {
                authorization: token
            }
        }).then(() => {
            assert.fail('Hum something went wrong');
        }).catch(err => {
            expect(err.response.status).to.equal(404);
        });
        await deleteUser(token);
    });

    it('should return 200 if the checklist has been deleted', async () => {
        const token = await register();
        const checkListId = await createCheckList(token);
        await api.delete('/checklists/' + checkListId ,{
            headers: {
                authorization: token
            }
        }).then(res => {
            expect(res.status).to.equal(200);
            expect(res.data.message).to.equal(`Check list ${checkListId} deleted successfully`);
        }).catch(() => {
            assert.fail('Hum something went wrong');
        });
        await deleteUser(token);
    });
});