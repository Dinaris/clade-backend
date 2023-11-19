const express = require('express');
const router = express.Router();

const redisService = require('../service/redis.service');


router.get('/:prefix/:key', async function(req, res, next) {
  const { prefix, key } = req.params;
  const data = await redisService.get(`${prefix}:${key}`);
  if (!data) {
    return res.status(404).send('Not found');
  }
  return res.send(data);
});

router.post('/:prefix/:key', async function(req, res, next) {
  const { prefix, key } = req.params;
  await redisService.set(`${prefix}:${key}`, req.body);
  return res.status(201).send('Created');
});

router.delete('/:prefix/:key', async function(req, res, next) {
  const { prefix, key } = req.params;
  await redisService.del(`${prefix}:${key}`);
  return res.status(204).send('Deleted');
});

//add list
router.post('/:prefix', async function(req, res, next) {
  const { prefix } = req.params;
  await redisService.putList(`${prefix}`, req.body);
  return res.status(201).send('Created');
});

//get list
router.get('/:prefix', async function(req, res, next) {
  const { prefix } = req.params;
  const data = await redisService.getList(`${prefix}`);
  if (!data) {
    return res.status(404).send('Not found');
  }

  const filterType = req.query.filterType;
    const filterValue = req.query.filterValue;

    if (filterType && filterValue) {
        const filteredData = data.filter(item => item[filterType] === filterValue);
        return res.send(filteredData);
    }

  return res.send(data);
});

module.exports = router;
