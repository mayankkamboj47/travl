/**
 * This file is used to upload the listings to the database
 * First, it cleans the ../models/listing.json file
 * Then, it uploads the listings to the database
 */
const mongoose = require("mongoose");
const fs = require("fs").promises;
const Listing = require("../models/Listing");
const Host = require("../models/Host");
// Load environment variables
require("dotenv").config();
let dbstring =
  "mongodb+srv://mayankkamboj:ot5oFid4r66Vz8KI@travel.u1yxzkm.mongodb.net/?retryWrites=true&w=majority";
// Connect to MongoDB
mongoose
  .connect(dbstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

// Clean the listings.json file
async function cleanListings(path) {
  const listings = await fs.readFile(path);
  const listingsJSON = JSON.parse(listings);
  const cleanedListings = listingsJSON.map((listing) => {
    const {
      name,
      description,
      neighborhood_overview,
      picture_url,
      neighbourhood,
      neighbourhood_cleansed,
      neighbourhood_group_cleansed,
      latitude,
      longitude,
      property_type,
      room_type,
      accommodates,
      bathrooms,
      bedrooms,
      beds,
      amenities,
      price,
      minimum_nights,
      maximum_nights,
      availability_30,
      availability_60,
      availability_90,
      availability_365,
      number_of_reviews,
      review_scores_rating,
      review_scores_accuracy,
      review_scores_cleanliness,
      review_scores_checkin,
      review_scores_communication,
      review_scores_location,
      review_scores_value,
      license,
    } = listing;
    return {
      name,
      description,
      neighborhood_overview,
      picture_url,
      neighbourhood,
      neighbourhood_cleansed,
      neighbourhood_group_cleansed,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      property_type,
      room_type,
      accommodates,
      bathrooms,
      bedrooms,
      beds,
      amenities,
      price: new Number(price.slice(1)),
      minimum_nights,
      maximum_nights,
      availability_30,
      availability_60,
      availability_90,
      availability_365,
      number_of_reviews,
      review_scores_rating,
      review_scores_accuracy,
      review_scores_cleanliness,
      review_scores_checkin,
      review_scores_communication,
      review_scores_location,
      review_scores_value,
    };
  });
  await fs.writeFile(
    "../models/listings.json",
    JSON.stringify(cleanedListings)
  );
}

// Upload hosts to the database
async function uploadHosts() {
  const hosts = await fs.readFile("../models/hosts.json");
  const hostsJSON = JSON.parse(hosts);
  await Host.insertMany(hostsJSON);
}

// Upload the listings to the database
async function uploadListings() {
  const listings = await fs.readFile("../models/listings.json");
  const listingsJSON = JSON.parse(listings);
  await Listing.insertMany(listingsJSON);
}

// Clean the listings.json file
(() => {
  return Promise.all([
    uploadListings()
      .then(() => {
        console.log("Uploaded listings to database");
      })
      .catch((err) => console.error(err)),
  ]).then(() => {
    mongoose.disconnect();
  });
})();
