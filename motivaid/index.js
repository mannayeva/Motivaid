const axios = require('axios');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('How are you feeling today? ', async (mood) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a kind motivational coach.' },
        { role: 'user', content: `I feel this way: ${mood}. Please give me a short motivational message.` }
      ],
      max_tokens: 60
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✨ Motivational Quote:');
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Hata oluştu:', error.message);
  }

  rl.close();
});
