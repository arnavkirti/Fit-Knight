const express = require('express');
const { GroupInfo } = require('../controllers/group');
const router = express.Router();

router.get("/group-info", GroupInfo);

module.exports = router;