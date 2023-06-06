const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
  id: {type : Number, unique : true, dropDups: true, required : true},
  url: String,
  name: String,
  since: Date,
  location: String,
  about: String,
  response_time: String,
  response_rate: String,
  acceptance_rate: String,
  is_superhost: String,
  thumbnail_url: String,
  picture_url: String,
  neighbourhood: String,
  listings_count: Number,
  total_listings_count: Number,
  verifications: [String],
  has_profile_pic: String,
  identity_verified: String
});

const Host = mongoose.model('Host', hostSchema);

module.exports = Host;