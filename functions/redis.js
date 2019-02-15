const redis = require('redis');
const { promisify } = require('util');


const plainRedisConnection = () => {
    const client = redis.createClient({
        prefix: 'fab-price-monitoring:',
    });
    const redisSet = promisify(client.set).bind(client);
    const redisGet = promisify(client.get).bind(client);
    const redisExpire = promisify(client.expire).bind(client);
    const redisDel = promisify(client.del).bind(client);
    const redisKeys = promisify(client.keys.bind(client));
    const redisHset = promisify(client.hset).bind(client);
    const redisHgetAll = promisify(client.hgetall).bind(client);
    return {
        redisSet,
        redisGet,
        redisExpire,
        redisDel,
        redisKeys,
        redisHset,
        redisHgetAll,
    };
};

const redisConnection = (req, res, next) => {
    const {
        redisExpire, redisSet, redisGet, redisDel, redisHset, redisKeys, redisHgetAll,
    } = plainRedisConnection();
    req.redis = {};
    req.redis.set = redisSet;
    req.redis.get = redisGet;
    req.redis.expire = redisExpire;
    req.redis.del = redisDel;
    req.redis.hset = redisHset;
    req.redis.keys = redisKeys;
    req.redis.hgetall = redisHgetAll;
    return next();
};


module.exports = {
    redisConnection,
    plainRedisConnection,
};