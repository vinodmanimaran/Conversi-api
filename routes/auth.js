import express from 'express';
import axios from 'axios';

const router = express.Router ();

/**
 * Endpoint: /api/auth/login
 * Description: Authenticate user login
 * Method: POST
 */
router.post ('/login', async (req, res) => {
  try {
    const {username, password} = req.body;

    // Send request to ChatEngine API to authenticate login
    const chatEngineRes = await axios.get (
      'https://api.chatengine.io/users/me',
      {
        headers: {
          'Private-Key': process.env.PRIVATE_KEY,
          'User-Name': username,
          'User-Secret': password,
        },
      }
    );

    const responseData = {
      username,
      password,
      // Include any other required data from chatEngineRes
    };

    // Send success response with authenticated user data
    res.status (200).json ({response: responseData});
  } catch (error) {
    // Handle error and send error response
    res.status (500).json ({error: 'Failed to authenticate login'});
  }
});

/**
 * Endpoint: /api/auth/signup
 * Description: Register a new user
 * Method: POST
 */
router.post ('/signup', async (req, res) => {
  try {
    const {username, password} = req.body;

    // Send request to ChatEngine API to register a new user
    const chatEngineRes = await axios.post (
      'https://api.chatengine.io/users',
      {
        username,
        secret: password,
      },
      {
        headers: {'Private-Key': process.env.PRIVATE_KEY},
      }
    );

    const responseData = {
      username,
      password,
      // Include any other required data from chatEngineRes
    };

    // Send success response with registered user data
    res.status(200).json({ response: responseData });
  } catch (error) {
    // Handle error and send error response
    res.status (500).json ({error: 'Failed to register user'});
  }
});

export default router;
