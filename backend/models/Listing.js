const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: String,
  description: String,
  neighborhood_overview: String,
  picture_url: String,
  neighbourhood: String,
  neighbourhood_cleansed: String,
  neighbourhood_group_cleansed: String,
  location : {
    type: { type: String, enum: ['Point'] },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  property_type: String,
  room_type: String,
  accommodates: Number,
  bathrooms: Number,
  bedrooms: Number,
  beds: Number,
  amenities: [String],
  price: Number,
  minimum_nights: Number,
  maximum_nights: Number,
  availability_30: Number,
  availability_60: Number,
  availability_90: Number,
  availability_365: Number,
  number_of_reviews: Number,
  review_scores_rating: Number,
  review_scores_accuracy: Number,
  review_scores_cleanliness: Number,
  review_scores_checkin: Number,
  review_scores_communication: Number,
  review_scores_location: Number,
  review_scores_value: Number,
  license: String
});

listingSchema.index({ location: '2dsphere' });
listingSchema.index({ name: 'text', description: 'text', neighborhood_overview: 'text', amenities: 'text', neighbourhood: 'text', neighbourhood_cleansed: 'text', neighbourhood_group_cleansed: 'text', property_type: 'text', room_type: 'text'});


const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;