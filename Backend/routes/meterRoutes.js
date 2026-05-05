const express = require('express');
const meterController = require('../controller/meterController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', meterController.getMeters);
router.post('/', meterController.createMeter);
router.get('/:id', meterController.getMeterById);
router.put('/:id', meterController.updateMeter);
router.delete('/:id', meterController.deleteMeter);
router.get('/:id/readings', meterController.getReadings);
router.post('/:id/readings', meterController.addReading);

module.exports = router;
