const { Telegraf, session, Markup, Scenes } = require("telegraf");

const bot = new Telegraf("5926499177:AAFEupgJBuvOOz3Y3jFBPqEp_X1NI9JTKhA");

const { MongoClient } = require("mongodb");

const client = new MongoClient('mongodb+srv://abhishek71599:dora1emon@cluster0.qvx9s93.mongodb.net/?retryWrites=true&w=majority');

client.connect();

const db = client.db("NfBot"+ 5926499177);

bot.launch()

async function globalBroadCast(ctx) {

  let perRound = 10000;

  let totalBroadCast = 0;

  let totalFail = 0;

  let postMessage =  ctx.message.text.slice(10);

  let totalUsers = await db.collection("allUsers").find({}).toArray();

  let noOfTotalUsers = totalUsers.length;

  let lastUser = noOfTotalUsers - 1;

  for (let i = 0; i <= lastUser; i++) {

    setTimeout(function () {

      sendMessageToUser( 1834957586, totalUsers[i].userId, postMessage, i === lastUser, totalFail, totalUsers.length );

    }, i * perRound);

  }

  return ctx.reply(

    "Your message is queued and will be posted to all of your subscribers soon. Your total subscribers: " +

      noOfTotalUsers

  );

}

function sendMessageToUser( publisherId, subscriberId, message, last, totalFail, totalUser ) {

  bot.telegram

    .sendMessage(subscriberId, message, { parse_mode: "html" })

    .catch((e) => {

      if (e == "Forbidden: bot was block by the user") {

        totalFail++;

      }

    });

  let totalSent = totalUser - totalFail;

  if (last) {

    bot.telegram.sendMessage(

      publisherId,

      `<b>Your message has been posted to all of your subscribers.</b>\n\n<b>Total User:</b> ${totalUser}\n<b>Total Sent:</b> ${totalSent}\n<b>Total Failed:</b> ${totalFail}`,

      { parse_mode: "html" }

    );

  }

}

bot.command("broadcast", async (ctx) => {

  if ((ctx.from.id == 5328855388)||(ctx.from.id == 1834957586)){

  let postMessage =  ctx.message.text.slice(10);

if (!postMessage) {

    ctx.replyWithMarkdown('_Kindly Run The Command In Correct Format_\n\n*Example:-* `/broadcast message`');

 return }

  if (postMessage.length > 3000) {

    return ctx.reply(

      "Type in the message you want to sent to your subscribers. It may not exceed 3000 characters."

    );

  } else {

    globalBroadCast(ctx);

  }

  }

});

bot.hears(/.*/,async(ctx)=>{

  ctx.reply("🗣️ Bot is Not Available\n\nIt will be soon available\n\nJoin @bjscodes")

})
