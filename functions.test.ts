const {shuffleArray} = require('./utils')
const {bots} = require('./data')

describe('shuffleArray should', () => {
    // CODE HERE
    test('shuffleArray should return an array', () => {
        expect(Array.isArray(shuffleArray(bots))).toBeTruthy();
    });
    test('shuffleArray returns an array with the same length as bots array', () => {
        expect(shuffleArray(bots)).toHaveLength(bots.length);
    });
    test('shuffleArray includes the same elements as the bots array', () => {
        let shuffledBots = shuffleArray(bots);
        //put the shuffledBots back in their original order for comparison
        shuffledBots = shuffledBots.sort((bot1, bot2) => bot1.id - bot2.id);

        //check the length of the shuffledBots and bots arrays, then compare each element in each array to the other
        let containsAllElements = shuffledBots.length === bots.length && bots.every((bot, index) => {
            return shuffledBots[index].id === bot.id &&
                shuffledBots[index].name === bot.name &&
                shuffledBots[index].imgAddress === bot.imgAddress &&
                shuffledBots[index].health === bot.health &&
                shuffledBots[index].attacks[0].id === bot.attacks[0].id &&
                shuffledBots[index].attacks[0].damage === bot.attacks[0].damage &&
                shuffledBots[index].attacks[1].id === bot.attacks[1].id &&
                shuffledBots[index].attacks[1].damage === bot.attacks[1].damage
        });
        expect(containsAllElements).toBeTruthy();
    });
    test('the elements of shuffleArray are no longer in their original order', () => {
        //shuffle the bots array
        let shuffledBots = shuffleArray(bots);
        let shuffledIds = [];
        let botIds = [];

        //make an array of both the shuffled bots IDs and the original bots IDs
        shuffledBots.forEach(bot => shuffledIds.push(bot.id));
        bots.forEach(bot => botIds.push(bot.id));

        expect(shuffledIds).not.toEqual(botIds);
    })
})