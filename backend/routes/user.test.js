const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validPassword = require('../utils').validPassword;

jest.setTimeout(30000);
const USERNAME = 'testuser';
const PASSWORD = 'testpassword';
describe('User routes', () => {
  let user;
  let token;

  beforeAll(async () => {
    // Create a test user and authenticate with JWT
    const {salt, hash} = require('../utils').toSaltAndHash(PASSWORD);
    user = new User({
      username: USERNAME,
      salt,
      hash
    });
    await user.save();
    token = jwt.sign({ id: user._id }, process.env.secretKey);
  });

  afterAll(async () => {
    // Remove the test user from the database
    let del1 = User.deleteOne({ username: 'prefix' + user.username });
    let del2 = User.deleteOne({ username: user.username });
    await Promise.all([del1, del2]);
  });

  describe('POST /user/login', () => {
    test('should return a token if username and password are correct', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({ username: USERNAME, password: PASSWORD })
        .expect(200);
      expect(res.body.token).toBeDefined();
    });

    test('should return an error if username is incorrect', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({ username: 'wronguser', password: PASSWORD })
        .expect(400);
      expect(res.body.message).toBe('Username or password is incorrect');
    });

    test('should return an error if password is incorrect', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({ username: USERNAME, password: 'wrongpassword' })
        .expect(400);
      expect(res.body.message).toBe('Username or password is incorrect');
    });
  });

  describe('POST /user', () => {
    test('should create a new user', async () => {
      const res = await request(app)
        .post('/user')
        .send({ username: 'prefix'+USERNAME, password: PASSWORD})
        .expect(201);
      expect(res.body.username).toBe('prefix'+USERNAME);
      // password should not be returned
      expect(res.body.password).toBeUndefined();
      // Check that the user has been added to the database
      const newUser = await User.findOne({ username:USERNAME });
      expect(newUser).not.toBeNull();
    });

    test('should return an error if username is already taken', async () => {
      await request(app)
        .post('/user')
        .send({ username: USERNAME, password: PASSWORD })
        .expect(400);
    });
  });

  describe('GET /user/:username', () => {
    test('should return the user with the said username', async () => {
      const res = await request(app)
        .get(`/user/${USERNAME}`)
        .expect(200);
      expect(res.body.username).toBe(USERNAME);
      expect(res.body.password).toBeUndefined();
    });
  });

  describe('PATCH /user', () => {
    test('should update the authenticated user', async () => {
      const res = await request(app)
        .patch('/user')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'newpassword' })
        .expect(200);
      expect(res.body.username).toBe(USERNAME);
      expect(res.body.password).toBeUndefined();
      // Check that the user has been updated in the database
      const updatedUser = await User.findById(user._id);
      expect(validPassword('newpassword', updatedUser.salt, updatedUser.hash)).toBe(true);
    });

    test('should return an error if not authenticated', async () => {
      await request(app)
        .patch('/user')
        .send({ password: 'newpassword' })
        .expect(401);
    });
  });

  describe('DELETE /user', () => {
    test('should delete the authenticated user', async () => {
      await request(app)
        .delete('/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
      // Check that the user has been removed from the database
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    test('should return an error if not authenticated', async () => {
      await request(app)
        .delete('/user')
        .expect(401);
    });
  });
});