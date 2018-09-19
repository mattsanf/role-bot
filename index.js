let Discord = require('discord.js')
let Client = new Discord.Client()
let dotenv = require('dotenv');

// Grabs the BOT_TOKEN from .env and stores in on the `process.env`
dotenv.load()

let allowedSystems = process.env.ALLOWED_SYSTEMS.split(',')
let botToken = process.env.BOT_TOKEN

// allowed strings
let allowedString = ''
allowedSystems.forEach((system) => {
  allowedString = allowedString.concat('- ' + system + '\n')
})

Client.on('message', msg => {
  // Set prefix
  let prefix = "!"

  if (!msg.content.startsWith(prefix)
    || msg.author.bot
  ) return

  if (msg.content.startsWith(prefix + 'system')) {

    // Get args
    let args = msg.content.split(" ");

    if (args.length < 2 || args[1] == '--help') {
      msg.channel.sendMessage('These are the systems you\'re allowed to travel to: \n'+
        allowedString +
        '\nuse "!system `<system_name>` to travel to a system')

      return
    }

    // Get the system
    let system = msg.guild.systems.find("name", args[1].toLowerCase());

    if (!system || system === null) {
      msg.channel.sendMessage('Could not find a system by that name.')
      return
    }

    if (allowedSystems.indexOf(system.name) === -1) {
      msg.channel.sendMessage('Doesn\'t look like you\'re allowed to travel there. \nFor a list of allowed systems type `!system --help`')
      return
    }

    msg.member.addRole(system).catch(console.error);
    msg.channel.sendMessage('You\'ve have traveled to: ' + system.name)

    return
  }
})

Client.on("guildMemberAdd", member => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );

    //member.guild.defaultChannel.sendMessage(`Welcome "${member.user.username}"! Be sure to set your platform by typing "!system"`);
})

Client.on('ready', () => {
  Client.user.setGame('type !system --help')
  console.log(`Ready to set systems in ${Client.channels.size} channels on ${Client.guilds.size} servers, for a total of ${Client.users.size} users.`)
})

Client.on('error', e => { console.error(e) })

Client.login(botToken)
