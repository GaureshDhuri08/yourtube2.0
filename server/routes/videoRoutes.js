const express = require("express");
const router = express.Router();

router.get("/getall", (req, res) => {
  res.json({
    success: true,
    videos: []
  });
});

module.exports = router;
