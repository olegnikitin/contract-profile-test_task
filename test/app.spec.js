const app = require('../src/app');
const axios = require('axios');
const assert = require("assert");

describe('App', function () {
    let server;

    before(function () {
        server = app.listen(3001, () => {
            console.log('Express App Listening on Port 3001');
        });
    });

    after(function () {
        server.close();
    })

    it('should return profile', async function () {
        const result = await axios.get('http://localhost:3001/contracts/1', {
            headers: {
                'profile_id': 1,
            }
        });

        assert.deepStrictEqual(result.data.id, 1);
    });
});