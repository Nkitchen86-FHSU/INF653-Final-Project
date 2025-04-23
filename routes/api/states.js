const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

// Get Routes
router.route('/').get(statesController.getAllStates);

router.route('/:state').get(statesController.getState);

router.route('/:state/funfact').get(statesController.getStateFunFact);

router.route('/:state/capital').get(statesController.getStateCapital);

router.route('/:state/nickname').get(statesController.getStateNickname);

router.route('/:state/population').get(statesController.getStatePopulation);

router.route('/:state/admission').get(statesController.getStateAdmission);

// Rest of the routes
router.route('/:state/funfact').post(statesController.createFunFact);

router.route('/:state/funfact').patch(statesController.patchFunFact);

router.route('/:state/funfact').delete(statesController.deleteFunFact);

module.exports = router;