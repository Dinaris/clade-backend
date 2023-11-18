const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

async function setup() {
    await client.on('connect', function () {
        console.log('Redis client connected');
    }).connect();

    await client.on('error', function (err) {
        console.log('Something went wrong ' + err);
    });
}

setup().then(() => console.log('init'));

async function set(key, value) {
    return await client.set(key, JSON.stringify(value));
}

async function get(key) {
    const promise = await client.get(key);
    if(!promise) {
        return {};
    }
    return JSON.parse(promise);
}

async function putList(key, value) {
    let list = await client.get(key);
    if(!list) {
        list = [];
    } else {
        list = JSON.parse(list);
    }
    list.push(value);
    return await client.set(key, JSON.stringify(list));
}

async function getList(key) {
    const promise = await client.get(key);
    if(!promise) {
        return {};
    }
    return JSON.parse(promise);
}

async function del(key) {
    return await client.del(key);
}

module.exports = {
    setup,
    set,
    get,
    del,
    putList,
    getList,
};