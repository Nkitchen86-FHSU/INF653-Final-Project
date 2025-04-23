require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const State = require('./model/State');
const connectDB = require('./config/dbConn');

const seedStates = async () => {
    connectDB();

    try{
        const data = JSON.parse(fs.readFileSync('./data/states.json', 'utf8'));

        // Check if any states already exist
        const count = await State.countDocuments();
        if (count === 0) {
            const stateCodes = data.map(state => ({ stateCode: state.code }));
            await State.insertMany(stateCodes);
            console.log('State codes seeded successfully.');
        } else {
            console.log('States already exist in the database. Skipping seed.');
        }
    } catch(err) {
        console.error(err)
    } finally {
        mongoose.disconnect();
    }
};

seedStates();