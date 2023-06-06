import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { openai } from '../index.js';

dotenv.config();
const router = express.Router();

// Route for processing text requests
router.post('/text', async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    // Create a chat completion using OpenAI
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: text },
      ],
    });

    // Send the generated response to the chat engine
    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          'Project-ID': process.env.PROJECT_ID,
          'User-Name': process.env.BOT_USER_NAME,
          'User-Secret': process.env.BOT_USER_SECRET,
        },
      }
    );

    // Respond with the generated text
    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    
    res.status(500).json({ error: 'An error occurred.' });
  }
});

// Route for processing code requests
router.post('/code', async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    // Create a chat completion using OpenAI for code generation
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant coder who responds with only code and no explanations.',
        },
        { role: 'user', content: text },
      ],
    });

    // Send the generated code to the chat engine
    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          'Project-ID': process.env.PROJECT_ID,
          'User-Name': process.env.BOT_USER_NAME,
          'User-Secret': process.env.BOT_USER_SECRET,
        },
      }
    );

    // Respond with the generated code
    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
      res.status(500).json({ error: 'An error occurred.' });
  }
});

// Route for providing sentence completions
router.post('/assist', async (req, res) => {
  try {
    const { text } = req.body;

    // Create a chat completion using OpenAI to assist with sentence completion
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: "You are a helpful assistant that serves to only complete user's thoughts or sentences.",
        },
        { role: 'user', content: `Finish my thought: ${text}` },
      ],
    });

    // Respond with the completed sentence
    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    
    res.status(500).json({ error: 'An error occurred.' });
  }
});

export default router;
