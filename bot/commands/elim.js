const fight = require('../util/fightEngine')
const units = require('./units')

module.exports = {
  name: 'elim',
  description: 'allow to display the most optimal hp to eliminate units by putting a `?` on either side (attacker or defender).',
  aliases: ['e'],
  shortUsage(prefix) {
    return `This command is too complicated to show an example. Try \`${prefix}help elim\``
  },
  longUsage(prefix) {
    return `\`${prefix}e gi 32, de w ?\`\nThis returns the strongest defender the 32hp giant can kill.\n\n\`${prefix}e gi ?, de w 6\`\nThis returns the weakest giant needed to kill a walled defender with 6hp.`
  },
  forceNoDelete: false,
  category: 'Advanced',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: function(message, argsStr, embed, trashEmoji, data) {
    if(argsStr.length === 0 || argsStr.includes('help'))
      return 'Try `.help e` for more information on how to use this command!'

    const unitsArray = units.getBothUnitArray(argsStr, message)

    const attackerArray = unitsArray[0].split(/ +/).filter(x => x != '')
    const defenderArray = unitsArray[1].split(/ +/).filter(x => x != '')

    if(!argsStr.includes('?')) {
      message.channel.send(`\`${process.env.PREFIX}elim\` requires a \`?\`\nI'll give you both sides.\nYou can do \`${process.env.PREFIX}help elim\` for more information on how to use it!`)
      unitsArray[0] = unitsArray[0] + '?'
      unitsArray[1] = unitsArray[1] + '?'
    }

    const attacker = units.getUnitFromArray(attackerArray, message, trashEmoji)
    const defender = units.getUnitFromArray(defenderArray, message, trashEmoji)

    if(unitsArray[0].includes('?') && unitsArray[1].includes('?')) {
      const attackerClone = { ...attacker }
      const defenderClone = { ...defender }

      data.attacker = attacker.name
      data.defender = defender.name
      if(embed.fields[0])
        data.reply_fields = [embed.fields[0].value]

      message.channel.send(fight.provideDefHP(attacker, defender, embed))
      message.channel.send(fight.provideAttHP(attackerClone, defenderClone, embed))
      return
    }

    if(unitsArray[0].includes('?')) {
      embed = fight.provideDefHP(attacker, defender, embed)
    }
    if(unitsArray[1].includes('?')) {
      embed = fight.provideAttHP(attacker, defender, embed)
    }
    data.attacker = attacker.name
    data.defender = defender.name
    if(embed.fields.length < 1)
      data.reply_fields = ['Can\'t kill']
    else {
      if(embed.fields[0])
        data.reply_fields = [embed.fields[0].value]
    }

    return embed
  }
}