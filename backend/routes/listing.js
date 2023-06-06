const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

// @route GET /listing/i/:id
// @desc Get a listing by id (not _id)
// @access Public
router.get("/i/:id", async (req, res) => {
  try {
    const listing = await Listing.findOne({ id: req.params.id });
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: "Listing not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /listing
// @desc Create a listing
// @access Public
router.post("/", async (req, res) => {
  // TODO : Handle image upload to some cloud storage
  const listing = new Listing({
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    picture_url: req.body.img,
    amenities: req.body.amenities,
    beds: req.body.beds,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    accommodates: req.body.accommodates,
    neighbourhood: req.body.neighbourhood,
    neighbourhood_cleansed: req.body.neighbourhood_cleansed,
    neighbourhood_group_cleansed: req.body.neighbourhood_group_cleansed,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    property_type: req.body.property_type,
    room_type: req.body.room_type,
    minimum_nights: req.body.minimum_nights,
    maximum_nights: req.body.maximum_nights,
  });
  try {
    const newListing = await listing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route PATCH /listing/:id
// @desc Update a listing
// @access Public
router.patch("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (req.body.name != null) {
      listing.name = req.body.name;
    }
    if (req.body.description != null) {
      listing.description = req.body.description;
    }
    if (req.body.price != null) {
      listing.price = req.body.price;
    }
    if (req.body.img != null) {
      listing.picture_url = req.body.img;
    }
    if (req.body.amenities != null) {
      listing.amenities = req.body.amenities;
    }
    if (req.body.beds != null) {
      listing.beds = req.body.beds;
    }
    if (req.body.bedrooms != null) {
      listing.bedrooms = req.body.bedrooms;
    }
    if (req.body.bathrooms != null) {
      listing.bathrooms = req.body.bathrooms;
    }
    if (req.body.accommodates != null) {
      listing.accommodates = req.body.accommodates;
    }
    if (req.body.neighbourhood != null) {
      listing.neighbourhood = req.body.neighbourhood;
    }
    if (req.body.neighbourhood_cleansed != null) {
      listing.neighbourhood_cleansed = req.body.neighbourhood_cleansed;
    }
    if (req.body.neighbourhood_group_cleansed != null) {
      listing.neighbourhood_group_cleansed =
        req.body.neighbourhood_group_cleansed;
    }
    if (req.body.latitude != null) {
      listing.latitude = req.body.latitude;
    }
    if (req.body.longitude != null) {
      listing.longitude = req.body.longitude;
    }
    if (req.body.property_type != null) {
      listing.property_type = req.body.property_type;
    }
    if (req.body.room_type != null) {
      listing.room_type = req.body.room_type;
    }
    if (req.body.minimum_nights != null) {
      listing.minimum_nights = req.body.minimum_nights;
    }
    if (req.body.maximum_nights != null) {
      listing.maximum_nights = req.body.maximum_nights;
    }
    const updatedListing = await listing.save();
    res.json(updatedListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route DELETE /listing/:id
// @desc Delete a listing
// @access Public
router.delete("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    await listing.remove();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/text
// @desc Search listings
// @access Public
router.get("/text/", async (req, res) => {
  try {
    const listings = await Listing.find({
      $text: { $search: req.query.q },
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/geo
// @desc Search listings by geo
// @access Public
router.get("/geo", async (req, res) => {
  try {
    const listings = await Listing.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [req.query.lng, req.query.lat],
          },
          $maxDistance: 10000 || req.query.distance,
        },
      },
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/beds
// @desc Search listings by beds
// @access Public
router.get("/beds", async (req, res) => {
  try {
    const listings = await Listing.find({
      beds: { $gte: req.query.min, $lte: req.query.max },
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/price
// @desc Search listings by price
// @access Public
router.get("/price", async (req, res) => {
  // TODO : We have to convert the price to integer after
  // removing the $ sign
  try {
    const listings = await Listing.find({
      price: { $gte: req.query.min, $lte: req.query.max },
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/amenities
// @desc Search listings by amenities
// @access Public
router.get("/amenities", async (req, res) => {
  const amenities =
    typeof req.query.amenities === "string"
      ? [req.query.amenities]
      : req.query.amenities;
  try {
    const listings = await Listing.find({
      amenities: { $all: amenities.map((amenity) => new RegExp(amenity, "i")) },
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/room_type
// @desc Search listings by room_type
// @access Public
router.get("/room_type", async (req, res) => {
  try {
    const listings = await Listing.find({
      room_type: req.query.room_type,
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/property_type
// @desc Search listings by property_type
// @access Public
router.get("/property_type", async (req, res) => {
  try {
    const listings = await Listing.find({
      property_type: req.query.property_type,
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/minimum_nights
// @desc Search listings by minimum_nights
// @access Public
router.get("/minimum_nights", async (req, res) => {
  try {
    const listings = await Listing.find({
      minimum_nights: { $lte: req.query.min },
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/maximum_nights
// @desc Search listings by maximum_nights
// @access Public
router.get("/maximum_nights", async (req, res) => {
  try {
    const listings = await Listing.find({
      maximum_nights: { $gte: req.query.max },
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/availability
// @desc Search listings by availability
// @access Public
router.get("/availability", async (req, res) => {
  try {
    if (req.query.min && req.query.max && req.query.min > req.query.max) {
      return res.status(400).json({
        message:
          "Minimum availability cannot be greater than maximum availability",
      });
    }
    const listings = await Listing.find({
      availability_365: { $gte: req.query.min, $lte: req.query.max },
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Combine all the search queries into one route
 * @route GET /listing/search
 * @desc Search listings
 * @access Public
 * @query q, lat, lng, distance, min, max, amenities, room_type, property_type, min, max
 * @example /listing/search?q=New%20York&lat=40.730610&lng=-73.935242&distance=10000&min=1&max=2&amenities=Kitchen&room_type=Entire%20home/apt&property_type=Apartment&min=1&max=2
 * @example /listing/search?q=Berlin&lat=52.520008&lng=13.404954&distance=10000&min=1&amenities=Kitchen&amenities=Wi-Fi&amenities=TV&room_type=Entire%20home/apt&property_type=Apartment&min=1&max=2
 * @example /listing/search?q=Paris&lat=48.864716&lng=2.349014&distance=10000&min=1&max=2&amenities=Kitchen&room_type=Entire%20home/apt&property_type=Apartment&min=1&max=2
 * @example /listing/search?q=San%20Francisco&lat=37.774929&lng=-122.419416&distance=15000&min=3&max=6&amenities=Pool&room_type=Private%20room&property_type=Condo&min=3&max=6
 * @example /listing/search?q=Tokyo&lat=35.689487&lng=139.691711&distance=20000&min=1&max=2&amenities=Gym&room_type=Shared%20room&property_type=Hostel
 * @example /listing/search?q=Amsterdam&lat=52.370216&lng=4.895168&distance=5000&min=1&max=2&amenities=Garden&room_type=Private%20room&property_type=House&min=1&max=2
 * @example /listing/search?q=New%20York&lat=40.730610&lng=-73.935242&distance=10000&min=1&max=2
 * @example /listing/search?q=Sydney&lat=-33.865143&lng=151.209900&distance=20000&min=3&max=6&amenities=Balcony&amenities=Pool&amenities=Gym&room_type=Shared%20room&property_type=Hostel&min=3&max=6
 */

router.get("/search", async (req, res) => {
  try {
    let {
      q,
      lat,
      lng,
      distance,
      min,
      max,
      amenities,
      room_type,
      property_type,
      minimum_nights,
      maximum_nights,
      availability_365,
    } = req.query;
    const query = {};
    if (q) {
      query.$text = { $search: q };
    }
    if (lat && lng && distance) {
      try {
        lat = parseFloat(lat);
        lng = parseFloat(lng);
        distance = parseFloat(distance);
        if(isNaN(lat) || isNaN(lng) || isNaN(distance)) {
          throw new Error("Latitude, longitude, and distance must be numbers")
        }
      } catch (err) {
        return res
          .status(400)
          .json({
            message: "Latitude, longitude, and distance must be numbers",
          });
      }
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: distance,
        },
      };
    }
    if (min && max) {
      try {
        min = parseInt(min);
        max = parseInt(max);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Minimum and maximum price must be numbers" });
      }
      if (min > max) {
        return res.status(400).json({
          message: "Minimum price cannot be greater than maximum price",
        });
      }
      query.price = { $gte: min, $lte: max };
    }
    if (amenities) {
      if (typeof amenities === "string") {
        amenities = [amenities];
      } else if (!Array.isArray(amenities)) {
        return res.status(400).json({
          message: "Amenities must be a string or an array of strings",
        });
      }
      // case insensitive search
      query.amenities = {
        $all: amenities.map((amenity) => new RegExp(amenity, "i")),
      };
    }
    if (room_type) {
      if (typeof room_type !== "string") {
        return res.status(400).json({ message: "Room type must be a string" });
      }
      query.room_type = room_type;
    }
    if (property_type) {
      if (typeof property_type !== "string") {
        return res
          .status(400)
          .json({ message: "Property type must be a string" });
      }
      query.property_type = property_type;
    }
    if (minimum_nights) {
      try {
        minimum_nights = parseInt(minimum_nights);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Minimum nights must be a number" });
      }
      query.minimum_nights = { $lte: minimum_nights };
    }
    if (maximum_nights) {
      try {
        maximum_nights = parseInt(maximum_nights);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Maximum nights must be a number" });
      }
      query.maximum_nights = { $gte: maximum_nights };
    }
    if (availability_365) {
      try {
        availability_365 = parseInt(availability_365);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Availability must be a number" });
      }
      query.availability_365 = { $gte: availability_365 };
    }

    // if query has both text and location, do two separate queries and combine the results
    if (query.$text && query.location) {
      const textQuery = { ...query };
      delete textQuery.location;
      const locationQuery = { ...query };
      delete locationQuery.$text;
      const textResults = await Listing.find(textQuery);
      const locationResults = await Listing.find(locationQuery);
      // find the intersection of the two results
      const results = textResults.filter((textResult) =>
        locationResults.some(
          (locationResult) =>
            textResult._id.toString() === locationResult._id.toString()
        )
      );
      return res.json(results);
    }
    const listings = await Listing.find(query);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing/:id
// @desc Get a listing by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /listing
// @desc Get all listings
// @access Public
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
