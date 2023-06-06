"use strict";
const request = require("supertest");
const app = require("../app");
jest.setTimeout(40000);

/**
 * Test the GET /listing/search endpoint with this valid query :
 * {"_id":"6471c2e20d510d8c343527b6","id":27886,"listing_url":"https://www.airbnb.com/rooms/27886","scrape_id":20211104024252,"last_scraped":"2021-11-04T00:00:00.000Z","name":"Romantic, stylish B&B houseboat in canal district","description":"Stylish and romantic houseboat on fantastic historic location with breathtaking view.  Wheelhouse, deckhouse and captains room. Central, quiet. Great breakfast, 2 vanMoof design bikes and a Canadian Canoe are included. Just read the reviews on tripadvisor for instance!<br /><br /><b>The space</b><br />For a romantic couple: A beautifully restored traditional dutch barge, M.s. Luctor, with all modern comforts, your own entrance, three rooms,(sleeping room, deckhouse and wheelhouse) with two bikes and a Canadian canoe to explore the city. Have your breakfast weather permitting on the large jetty. (You  might want to give a piece of your fresh fruit to our Greek turtle...) Organic products, a variety of cheese, fresh orange juice and croisants... We are member of green-hotels (ECEAT) and care for the environment. (We just installed solar pannels! A lot of questions can be answered on our own site, there is a button with Frequently Asked Questions.) <br />The location is superb, fantastic","neighborhood_overview":"Central, quiet, safe, clean and beautiful.","picture_url":"https://a0.muscache.com/pictures/02c2da9d-660e-451d-8a51-2f7a17469df7.jpg","neighbourhood":"Amsterdam, North Holland, Netherlands","neighbourhood_cleansed":"Centrum-West","neighbourhood_group_cleansed":"","latitude":52.38761,"longitude":4.89188,"property_type":"Private room in houseboat","room_type":"Private room","accommodates":2,"bathrooms":null,"bedrooms":1,"beds":1,"amenities":["Smart lock","Refrigerator","Long term stays allowed","Dishes and silverware","Lake access","Heating","Hair dryer","Wifi","Shampoo","Hot water","Dedicated workspace","Hangers","TV","Fire extinguisher","Outdoor dining area","Waterfront","Coffee maker","Carbon monoxide alarm","Outdoor furniture","Luggage dropoff allowed","Smoke alarm","Private patio or balcony","Private entrance","Breakfast","Essentials"],"price":"$135.00","minimum_nights":2,"maximum_nights":730,"availability_30":15,"availability_60":22,"availability_90":22,"availability_365":22,"number_of_reviews":226,"review_scores_rating":4.95,"review_scores_accuracy":4.93,"review_scores_cleanliness":4.96,"review_scores_checkin":4.95,"review_scores_communication":4.92,"review_scores_location":4.9,"review_scores_value":4.8,"license":"0363 974D 4986 7411 88D8","__v":0},
 */
describe("GET /listing/search", () => {
  it("should return a list of listings for a valid search query with price only", async () => {
    const res = await request(app);
    const query = {
      min : 1,
      max : 60
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should return a list of listings for a valid search query with just property type", async () => {
    const res = await request(app);
    const query = {
      property_type : "Apartment"
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should return a list of listings for a valid search query with just room type", async () => {
    const res = await request(app);
    const query = {
      room_type : "Entire home/apt"
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should return a list of listings for a valid search query with just amenities", async () => {
    const res = await request(app);
    const query = {
      amenities : ["Kitchen", "Wifi"]
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should return a list of listings for a valid search query with just minimum nights", async () => {
    const res = await request(app);
    const query = {
      minimum_nights : 1
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should return a list of listings for a valid search query with just maximum nights", async () => {
    const res = await request(app);
    const query = {
      maximum_nights : 2
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should return a list of listings for a valid search query with just availability", async () => {
    const res = await request(app);
    const query = {
      availability_365 : 180
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should return a list of listings for a valid search query with just location", async () => {
    const res = await request(app);
    const query = {
      lat: 52.38761,
      lng: 4.89188,
      distance: 10000
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  it("should return a list of listings for a valid search query with just text", async () => {
    const res = await request(app);
    const query = {
      q: "spaarndammerbuurt"
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should return a list of listings for a search query with everything", async () => {
    const res = await request(app);
    const query = {
      q: "Amsterdam",
      lat: 52.38761,
      lng: 4.89188,
      distance: 10000,
      min: 1,
      max: 2,
      amenities: "Kitchen",
      room_type: "Entire home/apt",
      property_type: "Apartment",
      minimum_nights: 1,
      maximum_nights: 2,
      availability_365: 180,
    };
    const response = await res.get("/listing/search").query(query);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should return an error for a search query with invalid parameters", async () => {
    const res = await request(app).get("/listing/search").query({
      q: "New York",
      lat: "invalid",
      lng: -73.935242,
      distance: 10000,
      min: 1,
      max: 2,
      amenities: "Kitchen",
      room_type: "Entire home/apt",
      property_type: "Apartment",
      minimum_nights: 1,
      maximum_nights: 2,
      availability_365: 180,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });
  it("should return a valid listing for a valid search query (no text and no location)", async () => {
    const res = await request(app).get("/listing/search").query({
      min: 1,
      max: 2,
      amenities: "Kitchen",
      room_type: "Entire home/apt",
      property_type: "Apartment",
      minimum_nights: 1,
      maximum_nights: 2,
      availability_365: 180,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
  it("should return a valid listing for a valid search query (no text)", async () => {
    const res = await request(app).get("/listing/search").query({
      lat: 52.38761,
      lng: 4.89188,
      distance: 10000,
      min: 1,
      max: 2,
      amenities: "Kitchen",
      room_type: "Entire home/apt",
      property_type: "Apartment",
      minimum_nights: 1,
      maximum_nights: 2,
      availability_365: 180,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
  it("should return a valid listing for valid search query (no location)", async () => {
    const res = await request(app).get("/listing/search").query({
      q: "Amsterdam",
      min: 1,
      max: 2,
      amenities: "Kitchen",
      room_type: "Entire home/apt",
      property_type: "Apartment",
      minimum_nights: 1,
      maximum_nights: 2,
      availability_365: 180,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

describe("GET /listing/:id", () => {
  it("should return a valid listing for a valid id", async () => {
    const res = await request(app).get("/listing/i/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
  });
  it("should return an error for an invalid id", async () => {
    const res = await request(app).get("/listing/invalid");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
  });
});