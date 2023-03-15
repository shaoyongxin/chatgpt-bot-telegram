require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const { getImage, getChat, clearSession } = require('./Helper/functions');
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

bot.command('clearsession', (ctx) => {
  clearSession();
  ctx.reply('会话已清空');
});

bot.on(message('text'), async (ctx) => {
  const text = ctx.message.text;
  if (text === '/clearsession') {
    return;
  }
  const isImage =
    text.startsWith('画') || text.startsWith('生成') || text.startsWith('创建');
  if (isImage) {
    const imageText = text
      .replace('画', '')
      .replace('生成', '')
      .replace('创建', '');
    ctx.sendChatAction('upload_photo');
    const res = await getImage(imageText);

    if (res) {
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
