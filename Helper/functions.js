const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);

const getImage = async (text) => {
  try {
    const response = await openai.createImage({
      prompt: text,
      n: 1,
      size: '1024x1024',
    });

    return response.data.data[0].url;
  } catch (error) {
    console.log(error);
  }
};

const getChat = async (text) => {
  try {
    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt: text,
      temperature: 0,
      max_tokens: 1024,
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { openai, getImage, getChat };
