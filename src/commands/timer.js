const { SlashCommandBuilder } = require('@discordjs/builders');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Set a timer')
    .addStringOption(option =>
      option.setName('timerfor')
        .setDescription("Enter what the timer is for:")
        .setRequired(true))
    .addNumberOption(option => 
      option.setName('hourstime')
        .setDescription("Enter timer duration in hrs")
        .setMinValue(0))
        // .setRequired(true))
    .addNumberOption(option => 
      option.setName('minutestime')
        .setDescription("Enter timer duration in min")
        .setMaxValue(59)
        .setMinValue(0))
        // .setRequired(true))
    .addNumberOption(option => 
      option.setName('secondstime')
        .setDescription("Enter timer duration in sec")
        .setMaxValue(59)
        .setMinValue(0)),
        // .setRequired(true)
  async execute(interaction, client) {
    const stringtoP = interaction.options.getString('timerfor')
    const timeinS = interaction.options.getNumber('secondstime');
    const timeinM = interaction.options.getNumber('minutestime');
    const timeinH = interaction.options.getNumber('hourstime');
    const totalS = timeinS + (timeinM * 60) + (timeinH * 3600);

    // if (timeinM <= 0){
    //   await interaction.reply('Not a valid Time in minutes.')
    //   return;
    // }

  const schedule = new ToadScheduler();

  const task = new Task('simple task', () => {
    interaction.followUp(`Timer is done!  ${stringtoP}`);
    schedule.stop();
  });

  const job = new SimpleIntervalJob({ seconds: totalS}, task)
  schedule.addSimpleIntervalJob(job);
  // schedule.stop();
  await interaction.reply('Timer is set');
  
  },

  
};