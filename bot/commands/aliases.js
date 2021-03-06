module.exports = {
  name: 'aliases',
  description: 'list all aliases to simplify your life.',
  aliases: ['alias', 'a'],
  shortUsage(prefix) {
    return `${prefix}a`
  },
  longUsage(prefix) {
    return `${prefix}alias`
  },
  forceNoDelete: false,
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function(message, argsStr, embed) {
    const categoriesMapped = {
      Main: {},
      Advanced: {},
      Settings: {},
      Other: {}
    }

    message.client.commands.forEach(cmd => {
      if(cmd.category === 'hidden')
        return

      const category = categoriesMapped[cmd.category]

      category[cmd.name] = {
        aliases: cmd.aliases,
      }
    })

    embed.setTitle('All aliases')
      .setDescription('To simplify your life!')

    for (const [cat, commandsList] of Object.entries(categoriesMapped)) {
      const field = []
      for (const [name, details] of Object.entries(commandsList)) {
        field.push(`**${process.env.PREFIX}${name}**: \`${process.env.PREFIX}${details.aliases.join(`\`, \`${process.env.PREFIX}`)}\``)
      }
      embed.addField(`**${cat}:**`, field)
    }

    return embed
  }
};