const supertest = require('supertest');
const app = require('../app.js');

function post(path, body) {
    return supertest(app).post(path).send(body);
}

function get(path) {
    return supertest(app).get(path);
}

function patch(path, body) {
    return supertest(app).patch(path).send(body);
}

function del(path) {
    return supertest(app).delete(path);
}

const all = {
    post,
    get,
    patch,
    del
}
async function test() {
    await post('/user', {
        username : 't',
        password : 't',});
    let response = await post('/user/login', {
        username : 't',
        password : 't',});
    let token = response.body.token;
    await del('/user').set('Authorization', `Bearer ${token}`).send({});
    console.log('done');
}

test();