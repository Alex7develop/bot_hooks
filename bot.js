const TelegramBot = require('node-telegram-bot-api');

const token = '6883883776:AAHZjVX9VKblezFQlrG9ZRUY_F8iR7zH5FE';

const bot = new TelegramBot(token, { polling: true });

const welcomeChannelId = '-1002079819189'; 
const targetChannelId = '-1002183570081';  

const welcomeMessage = `
📲 Если вы хотите поделиться чем-то интересным, у вас открывается новая кофейня или в кофейне обновилось меню - сезонное/бранчи/ланчи, новая кофейная карта, сезонные напитки, или вы добавили супер вкусные сырники, или вам нужны сотрудники, напишите свои условия работы, скидывайте фото и видео в бота @onhooknews_bot.

Сообщение можно прислать 24/7 и не забудьте подписать адрес и название, где находится кофейня.
Как только ваше сообщение пройдет модерацию, мы опубликуем пост. 
`;

// bot.sendMessage(welcomeChannelId, welcomeMessage, {
//   reply_markup: {
//     inline_keyboard: [
//       [{ text: 'ПРИСЛАТЬ НОВОСТЬ', url: 'https://t.me/onhooknews_bot' }]
//     ]
//   }
// });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '/start') {
    bot.sendMessage(chatId, 'Привет! Нажмите кнопку ниже, чтобы отправить новость.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Отправить новость', callback_data: 'send_news' }]
        ]
      }
    });
  }
});

bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;

  if (callbackQuery.data === 'send_news') {
    bot.sendMessage(chatId, 'Отправьте ваше сообщение, новость, фотографию, картинку или PDF файл. Когда закончите, отправьте /done.');

    const userMessages = [];

    const messageHandler = (newMsg) => {
      if (newMsg.text && newMsg.text === '/done') {
        bot.sendMessage(chatId, 'Ваши материалы приняты.');
        userMessages.forEach((userMessage) => {
          bot.forwardMessage(targetChannelId, userMessage.chat.id, userMessage.message_id);
        });

        bot.removeListener('message', messageHandler);
      } else {
        userMessages.push(newMsg);
      }
    };
    bot.on('message', messageHandler);
  }
});


