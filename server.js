require('dotenv').config();
const express = require('express')
const cors = require('cors');
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')
const {SERVER_ENV, ROLLBAR_TOKEN} = process.env;

app.use(express.json())
app.use(express.static('public'))
app.use(cors());

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        rollbar.error(`ERROR GETTING BOTS ON ${SERVER_ENV}`);
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        rollbar.info(`SUCCESSFULLY RETRIEVED FIVE BOTS ON ${SERVER_ENV}`);
        res.status(200).send({choices, compDuo})
    } catch (error) {
        rollbar.error(`ERROR GETTING FIVE BOTS ON ${SERVER_ENV}`);
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            rollbar.info(`USER LOST ON ${SERVER_ENV}`);
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            rollbar.info(`USER WON ON ${SERVER_ENV}`);
            res.status(200).send('You won!')
        }
    } catch (error) {
        rollbar.error(`ERROR OCCURED DURING DUEL ON ${SERVER_ENV}`);
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        if(playerRecord.length)
        {
            rollbar.info(`PLAYER STATS SUCCESSFULLY RETRIEVED ON ${SERVER_ENV}`);
        }
        res.status(200).send(playerRecord)
    } catch (error) {
        rollbar.critical(`ERROR GETTING PLAYER STATS ON ${SERVER_ENV}`);
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

app.listen(4000, () => {
  console.log(`Listening on 4000`)
})