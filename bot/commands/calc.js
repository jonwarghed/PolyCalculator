const fight = require('../util/fightEngine')
const units = require('./units')

module.exports = {
  name: 'calc',
  description: 'calculate the outcome of a fight in the most simple format.',
  aliases: ['c'],
  shortUsage(prefix) {
    return `\`${prefix}c wa 7, ri 5\` or\n\`${prefix}c wa bo, wa sh, wa bs, de d\``
  },
  longUsage(prefix) {
    return `\`${prefix}calc warrior 7, rider 5\` or\n\`${prefix}calc warrior boat, warrior ship, warrior bship, defender d\``
  },
  forceNoDelete: false,
  category: 'Main',
  // category: 'Paid',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: async function(message, argsStr, embed, trashEmoji, data) {
    if(argsStr.length === 0 || argsStr.includes('help'))
      return 'Try `.help c` for more information on how to use this command!'

    const unitsArray = units.getBothUnitArray(argsStr, message)

    const defenderStr = unitsArray.pop()
    const defenderArray = defenderStr.split(/ +/).filter(x => x != '')
    const attackers = []

    const defender = units.getUnitFromArray(defenderArray, message, trashEmoji)
    // defender.getOverride(defenderArray)

    unitsArray.forEach(x => {
      const attackerArray = x.split(/ +/).filter(y => y != '')
      const attacker = units.getUnitFromArray(attackerArray, message, trashEmoji)
      // attacker.getOverride(attackerArray)
      if (attacker.att !== 0)
        attackers.push(attacker)
    })

    if(attackers.length === 0)
      throw 'You need to specify at least one unit with more than 0 attack.'

    try {
      embed = await fight.calc(attackers, defender, embed)
    } catch (error) {
      throw error
    }

    data.attacker = attackers.length
    data.defender = defender.name
    data.defender_description = defender.description
    if(embed.fields !== undefined)
      data.reply_fields = [embed.fields[0].value, embed.fields[1].value]

    return embed
  }
};