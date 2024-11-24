const express = require("express");
const admininventory = require("../controllers/Inventory");
const adminsaleslog = require("../controllers/Sales");

const router = express.Router();

router.post("/add", admininventory.additems);
router.get("/getall", admininventory.getitems);
router.post("/sell", adminsaleslog.sellitems);
router.get("/getsales", adminsaleslog.logs);



module.exports = router;