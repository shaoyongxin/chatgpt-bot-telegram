require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const { getImage, getChat } = require('./Helper/functions');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const configuration = new Configuration({
  apiKey: process.env.API,
});
const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);
bot.start((ctx) => ctx.reply('Welcome , You can ask anything from me'));

bot.help((ctx) => {
  ctx.reply('如果需要创建图片，则在开头输入画、生成或创建');
});

bot.on(message('text'), async (ctx) => {
  const text = ctx.message.text;
  const isImage =
    text.startsWith('画') || text.startsWith('生成') || text.startsWith('创建');
  if (isImage) {
    const imageText = text
      .replace('画', '')
      .replace('生成', '')
      .replace('创建', '');
    const res = await getImage(imageText);

    if (res) {
      ctx.sendChatAction('upload_photo');
      ctx.replyWithPhoto(res);
    }
  } else {
    ctx.sendChatAction('typing');
    const res = await getChat(text);
    if (res) {
      ctx.reply(res);
    }
  }
});

bot.launch();
