const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.post("/", dataController.receiveData);
router.get("/", dataController.getAllData);

module.exports = router;
