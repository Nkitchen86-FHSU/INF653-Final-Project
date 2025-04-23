const State = require('../model/State');
const statesJSON = require('../model/states.json')

const getAllStates = async (req, res) => {
    let states = statesJSON;
    const contig = req.query.contig;

    if (contig === 'true'){
        try{
            const dbStates = await State.find();
            let filteredStates = states.filter(state => state.code !== 'AK' && state.code !== 'HI')
            filteredStates = filteredStates.map(state => {
                    const match = dbStates.find(s => s.stateCode === state.code)
                    return match ? { ...state, funfacts: match.funfacts} : state;
            });
            if (!filteredStates) return res.status(204).json({ 'message': 'No states found.' });
            res.json(filteredStates);
        } catch (err) {
            console.error(err);
        }
    } else if (contig === 'false') {
        try{
            const dbStates = await State.find();
            let filteredStates = states.filter(state => state.code === 'AK' || state.code === 'HI')
            filteredStates = filteredStates.map(state => {
                    const match = dbStates.find(s => s.stateCode === state.code)
                    return match ? { ...state, funfacts: match.funfacts} : state;
            });
            if (!filteredStates) return res.status(204).json({ 'message': 'No states found.' });
            res.json(filteredStates);
        } catch (err) {
            console.error(err);
        }
    } else{
        try{
            const dbStates = await State.find();
            states = states.map(state => {
                const match = dbStates.find((s) => {return s.stateCode === state.code})
                return match ? { ...state, funfacts: match.funfacts} : state;
            });
            if (!states) return res.status(204).json({ 'message': 'No states found.' });
            res.json(states);
        } catch (err) {
            console.error(err);
        }
    }

}

const createFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { funfacts } = req.body;

    if (!funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    if(!Array.isArray(funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }

    try {
        let state = await State.findOne({stateCode});

        if (state) {
            state.funfacts.push(...funfacts);
        } else {
            state = new State({ stateCode, funfacts });
        }

        const result = await state.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const patchFunFact = async (req, res) => {
    if(!req?.body?.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required'})
    }
    if(!req?.body?.funfact) {
        return res.status(400).json({ 'message': 'State fun fact value required'})
    }
    if (!Number.isInteger(req.body.index) || req.body.index < 1) {
        return res.status(400).json({ 'message': 'Invalid integer input for index'})
    }
    const upperStateCode = req.params.state.toUpperCase();
    let states = statesJSON;
    const state = states.find(state => state.code === upperStateCode);
    const stateCode = req.params.state.toUpperCase();
    const index = req.body.index - 1;

    try{
        const stateDB = await State.findOne({ stateCode: stateCode })
        if (!stateDB?.funfacts || stateDB.funfacts.length === 0) {
            return res.status(400).json({ "message": `No Fun Facts found for ${state.state}` });
        }
        if (index < 0 || index >= stateDB.funfacts.length) {
            return res.status(400).json({ "message": `No Fun Fact found at that index for ${state.state}` });
        }
        stateDB.funfacts[index] = req.body.funfact;
        const result = await stateDB.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const deleteFunFact = async (req, res) => {
    if(!req?.body?.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required'})
    }
    if (!Number.isInteger(req.body.index) || req.body.index < 1) {
        return res.status(400).json({ 'message': 'Invalid integer input for index'})
    }
    const upperStateCode = req.params.state.toUpperCase();
    let states = statesJSON;
    const state = states.find(state => state.code === upperStateCode);
    const stateCode = req.params.state.toUpperCase();
    const index = req.body.index - 1;

    try{
        const stateDB = await State.findOne({ stateCode: stateCode })
        if (!stateDB?.funfacts || stateDB.funfacts.length === 0) {
            return res.status(400).json({ "message": `No Fun Facts found for ${state.state}` });
        }
        if (index < 0 || index >= stateDB.funfacts.length) {
            return res.status(400).json({ "message": `No Fun Fact found at that index for ${state.state}` });
        }
        stateDB.funfacts.splice(index, 1);
        const result = await stateDB.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const getState = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State code required.' });
    const upperStateCode = req.params.state.toUpperCase();
    let states = statesJSON;
    const state = states.find(state => state.code === upperStateCode);
    if (!state) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    try{
        const dbStates = await State.find();
        let filteredState = states.filter(state => state.code === upperStateCode);
        filteredState = filteredState.map(state => {
                const match = dbStates.find(s => s.stateCode === state.code)
                return match ? { ...state, funfacts: match.funfacts} : state;
        });
        if (filteredState.length === 0) return res.status(204).json({ 'message': 'No states found.' });
        res.json(filteredState[0]);
    } catch (err) {
        console.error(err);
    }
}

const getStateFunFact = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    const upperStateCode = req.params.state.toUpperCase();
    const states = statesJSON;
    const state = states.find(state => state.code === upperStateCode);
    if (!state) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    try{
        const dbState = await State.findOne({ stateCode: upperStateCode });
        if (!dbState || !dbState.funfacts || dbState.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
        }
        const index = Math.floor(Math.random() * (dbState.funfacts.length));
        const randomFunFact = dbState.funfacts[index];

        res.json({ funfact: randomFunFact });
    } catch (err) {
        console.error(err);
    }
}

const getStateCapital = async (req,res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State code required.' });
    const upperStateCode = req.params.state.toUpperCase();
    const states = statesJSON;
    const state = states.find(state => state.code === upperStateCode);
    if (!state) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    if (!state || !state.capital_city) {
        return res.status(404).json({ message: `No capital found for ${upperStateCode}` });
    }

    res.json({ state: state.state, capital: state.capital_city }); 
}

const getStateNickname = async (req,res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State code required.' });
    const upperStateCode = req.params.state.toUpperCase();
    const states = statesJSON;
    const state = states.find(state => state.code === upperStateCode);
    if (!state) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    if (!state || !state.nickname) {
        return res.status(404).json({ message: `No nickname found for ${upperStateCode}` });
    }

    res.json({ state: state.state, nickname: state.nickname }); 
}

const getStatePopulation = async (req,res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State code required.' });
    const upperStateCode = req.params.state.toUpperCase();
    const states = statesJSON;
    const state = states.find(state => state.code === upperStateCode);
    if (!state) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    if (!state.population) {
        return res.status(404).json({ message: `No population found for ${upperStateCode}` });
    }

    res.json({ state: state.state, population: state.population.toLocaleString('en-US') }); 
}

const getStateAdmission = async (req,res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State code required.' });
    const upperStateCode = req.params.state.toUpperCase();
    const states = statesJSON;
    const state = states.find(state => state.code === upperStateCode);
    if (!state) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
    if (!state.admission_date) {
        return res.status(404).json({ message: `No admission date found for ${upperStateCode}` });
    }

    res.json({ state: state.state, admitted: state.admission_date }); 
}

module.exports = {
    getAllStates,
    createFunFact,
    patchFunFact,
    deleteFunFact,
    getState,
    getStateFunFact,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission
}