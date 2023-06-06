const Host = require("../models/Host");
const router = require("express").Router();
const mongoose = require("mongoose");

// @route POST /host
// @desc  Create a new host
// @access Public
router.post("/", async (req, res) => {
  const properties = [
    "name",
    "url",
    "since",
    "location",
    "about",
    "response_time",
    "response_rate",
    "acceptance_rate",
    "is_superhost",
    "thumbnail_url",
    "picture_url",
    "neighbourhood",
    "listings_count",
    "total_listings_count",
    "verifications",
    "has_profile_pic",
    "identity_verified",
  ];
  if (Object.keys(req.body).some((key) => !properties.includes(key))) {
    return res.status(400).json({ message: "Invalid property" });
  }
  const host = new Host({ ...req.body });
  try {
    const newHost = await host.save();
    res.status(201).json(newHost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route  GET /host
// @desc   Get all hosts
// @access Public
router.get("/", async (req, res) => {
  try {
    const hosts = await Host.find();
    res.json(hosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
