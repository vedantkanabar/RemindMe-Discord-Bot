const { Configuration, OpenAIApi } = require('openai');
const { SlashCommandBuilder } = require('@discordjs/builders');

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI
});

const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('custommessage')
    .setDescription('Generate a custom birthday wish message')
    
    .addStringOption(option => 
      option.setName('name')
        .setDescription(`Who's birthday is it?`)
        .setRequired(true)
        .setMaxLength(20))
    
    .addStringOption(option => option
      .setName('relationship')
      .setDescription('What is your relationship with this person?')
      .setRequired(true)
      .addChoices(
        {name: 'Friend', value: 'friend'},
        {name: 'Partner', value: 'partner'},
        {name: 'Parent', value: 'parent'},
        {name: 'Relative', value: 'relative'},
      ))
    
    .addIntegerOption(option => 
      option.setName('age')
        .setDescription(`How old will this person be?`)
        .setRequired(true))
      
      .addStringOption(option => 
        option.setName('info')
        .setDescription(`Additional info you want to include in the message.`)),
  async execute(interaction, client) {
    const name = interaction.options.getString('name');
    const age = interaction.options.getInteger('age');
    const relation = interaction.options.getString('relationship')
    const info = interaction.options.getString('info');

    let message;
    if (info === null){
      message = `Write a short birthday message for my ${relation}, ${name}, age ${age}`
    } else{
      message = `Write a short birthday message for my ${relation}, ${name}, age ${age} with these following additional info: ${info}`
    }
    await console.log(message)
    const completion = await openai.createCompletion({
      model: "text-curie-001",
      prompt: message,
      temperature: 0.7,
      max_tokens: 1000
    });

    const reply = await completion.data.choices[0].text;
    await console.log(completion.data.choices[0])
    await interaction.reply({content: reply, ephemeral: true });
  },
};

