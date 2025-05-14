const router = require('express').Router();
const { resetDb } = require('../tests/test_helper');

router.post('/reset', async (_req, resp) => {
  await resetDb();
  resp.status(204).end();
});

module.exports = router;
