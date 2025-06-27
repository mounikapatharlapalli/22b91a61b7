const express = require("express");
const router = express.Router();
const ShortURL = require("../models/ShortURL");
const Click = require("../models/Click");
const generateCode = require("../utils/generator");

router.post("/shorturls", async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  let code = shortcode || generateCode();
  const exists = await ShortURL.findOne({ shortCode: code });
  if (exists) return res.status(400).json({ message: "Shortcode already exists" });

  const expiresAt = new Date(Date.now() + validity * 60000);
  const newShort = new ShortURL({ originalUrl: url, shortCode: code, expiresAt });

  await newShort.save();

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  res.status(201).json({ shortUrl: `${baseUrl}/${code}`, expiry: expiresAt.toISOString() });
});

router.get("/:code", async (req, res) => {
  const record = await ShortURL.findOne({ shortCode: req.params.code });
  if (!record) return res.status(404).json({ message: "Shortcode does not exist" });

  if (new Date() > record.expiresAt) return res.status(410).json({ message: "Link expired" });

  await new Click({
    shortUrlId: record._id,
    referer: req.headers.referer || "unknown",
    location: req.headers["x-forwarded-for"] || req.ip
  }).save();

  res.redirect(record.originalUrl);
});

router.get("/shorturls/:code", async (req, res) => {
  const record = await ShortURL.findOne({ shortCode: req.params.code });
  if (!record) return res.status(404).json({ message: "Shortcode does not exist" });

  const clicks = await Click.find({ shortUrlId: record._id });

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  res.json({
    shortUrl: `${baseUrl}/${record.shortCode}`,
    expiry: record.expiresAt.toISOString(),
    totalClicks: clicks.length,
    clickDetails: clicks.map(c => ({
      timestamp: c.timestamp.toISOString(),
      referer: c.referer,
      location: c.location
    }))
  });
});

module.exports = router;
