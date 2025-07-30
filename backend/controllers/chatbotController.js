const axios = require('axios');

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id; 

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [{
          text: `You are a helpful fitness and nutrition assistant. The user is asking: ${message}. Please provide helpful, accurate, and supportive advice related to fitness, nutrition, workouts, meal planning, or general health. Keep responses concise but informative.`
        }]
      }]
    };

    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const botResponse = response.data.candidates[0].content.parts[0].text;

    res.json({
      success: true,
      message: botResponse,
      userId: userId,
      timestamp: new Date()
    });

  } catch (error) {
    
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'Gemini API error',
        details: error.response.data || error.message 
      });
    } else if (error.request) {
      res.status(500).json({ 
        error: 'No response from Gemini API',
        details: 'Network error or API unavailable'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to get response from chatbot',
        details: error.message 
      });
    }
  }
};

module.exports = { chatWithBot };
