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

  if (msg.content.startsWith(prefix + 'travel_to')) {

    // Get args
    let [first, ...second] = msg.content.split(" ")
    args = second.join(" ")

    if (args == '--help') {
      msg.channel.send('These are the systems you\'re allowed to travel to: \n'+
        allowedString +
        '\nuse "!travel_to `<system name>`" to travel to that system')

      return
    }

    // Get the role ignoreing the users case
    let role = msg.guild.roles.find((role) => {
      return role.name == args
    });

    if (!role || role === null) {
      msg.channel.send('Could not find a system by the name of ' + args)
      return
    }

    if (allowedSystems.indexOf(role.name) === -1) {
      msg.channel.send('Doesn\'t look like you\'re allowed to travel to that system. \nFor a list of allowed systems type `!travel_too --help`')
      return
    }

    let from = ""
    msg.member.roles.forEach((role) => {
      if (allowedSystems.indexOf(role.name) != -1) {
        from = role.name;
        msg.member.removeRole(role).catch(console.error);
      }
    })

    msg.member.addRole(role).then(() => {
      msg.channel.send(`${msg.member.displayName} has traveled to ${role.name} from ${from}`)
    }).catch(console.error)

    return
  }
})

Client.on('ready', () => {
  Client.user.setActivity('type !travel_to --help')
})

Client.on('error', e => { console.error(e) })

Client.login(botToken)