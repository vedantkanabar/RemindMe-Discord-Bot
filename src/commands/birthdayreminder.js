const { SlashCommandBuilder, ModalBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, TextInputBuilder } = require('discord.js');
const schedule = require('node-schedule-tz');

const number = process.env['TWILIO_NO'];

const accountSid = process.env['TWILIO_ACCOUNT_SID'];
const authToken = process.env['TWILIO_AUTH_TOKEN'];
const twil_client = require('twilio')(accountSid, authToken);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Create a birthday event reminder')
    .addStringOption(option => 
      option.setName('friendname')
        .setDescription(`Who's birthday is it?`)
        .setRequired(true))

    .addIntegerOption(option => 
      option.setName('month')
        .setDescription(`What month is the birthday on?`)
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(12))
    
    .addIntegerOption(option => 
      option.setName('day')
        .setDescription(`What day is the birthday on?`)
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(31))
    
    .addStringOption(option =>
      option.setName('timezone')
      .setDescription('What timezone is your friend located at?')
      .setRequired(true))

    .addStringOption(option => 
      option.setName('phoneno')
        .setDescription(`What is your phone no?`)
        .setRequired(true)),
  
  async execute(interaction, client) {

    const name = interaction.options.getString('friendname');
    const day = interaction.options.getInteger('day');
    const month = interaction.options.getInteger('month')-1;
    const timezone = interaction.options.getString('timezone');
    const phoneno = interaction.options.getString('phoneno');

    var date = new Date(2023, month, day, 0, 0, 0);

    console.log(name);
    console.log(day);
    console.log(month);
    console.log(timezone);
    console.log(phoneno);

    var rule = new schedule.RecurrenceRule();
    rule.minute = 0;
    rule.tz = timezone; // You can specify a timezone!

    const msg = `Its your friend ${name}'s birthday! Wish them!`
    
    const job = schedule.scheduleJob(date, rule, function(){
      console.log('Message sent to phone');
      interaction.followUp(msg);
      twil_client.messages
        .create({
           body: msg,
           from: number,
           to: phoneno
         })
        .then(message => console.log(message.sid));
    });


    await interaction.reply(`You will be given a reminder for your friend ${name}'s birthday on 2023/${month}/${day}.'`);

  },
};