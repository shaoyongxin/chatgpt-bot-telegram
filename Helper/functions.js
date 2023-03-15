const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);

const chatMessages = [];

const getImage = async (text) => {
  try {
    const response = await openai.createImage({
      prompt: text,
      n: 1,
      size: '256x256',
    });

    return response.data.data[0].url;
  } catch (error) {
    console.log(error);
  }
};

const getChat = async (text) => {
  chatMessages.push({
    role: 'user',
    content: text,
  });
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: chatMessages,
      temperature: 0.2,
      max_tokens: 1024,
    });
    const content = response.data.choices[0].message.content;
    chatMessages.push({ role: 'assistant', content });
    return content;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { openai, getImage, getChat };
