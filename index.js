const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, newGameOptions } = require("./gameOptions");

const tgToken = "6410360889:AAGYoGkX7QmV9oE1AjERlrU5t6qeQiJchKo";

const bot = new TelegramApi(tgToken, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `So now I guess a number from 0 to 9, and you'll try to pick the right one!`
  );
  const randomNum = Math.floor(Math.random() * 10);
  chats[chatId] = randomNum;
  await bot.sendMessage(chatId, "Guess a number!", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "greetings" },
    { command: "/info", description: "get user info" },
    { command: "/game", description: "start guessing game" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const userName = msg.from.first_name;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/2.webp"
      );
      return await bot.sendMessage(
        chatId,
        `Hello, ${userName}! Do you wanna play a guessing game with me?`
      );
    }
    if (text === "/info") {
      return await bot.sendMessage(chatId, `You're ${userName}, right?`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return await bot.sendMessage(chatId, `I don't understand you, try again`);
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/restart") {
      return startGame(chatId);
    }
    if (Number(data) === Number(chats[chatId])) {
      return await bot.sendMessage(
        chatId,
        `Congratulations! You've guessed the right number ${chats[chatId]}!`,
        newGameOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Oh no, incorrect, the right number was ${chats[chatId]}. Try again!`,
        newGameOptions
      );
    }
  });
};

start();
