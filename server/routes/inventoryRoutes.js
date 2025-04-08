const express = require("express");
const {
  createInventory,
  getInventoryByDate,
  updateInventoryByDate,
} = require("../controllers/inventoryController.js");

const router = express.Router();

router.post("/", createInventory);
router.get("/:date", getInventoryByDate);
router.put("/:date", updateInventoryByDate);
module.exports = router;
