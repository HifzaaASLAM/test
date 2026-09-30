const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', checkRole('management', 'team_leader', 'employee'), meetingController.createMeeting);
router.get('/', meetingController.getMeetings);
router.put('/:id', checkRole('management', 'team_leader', 'employee'), meetingController.updateMeeting);
router.delete('/:id', checkRole('management', 'team_leader'), meetingController.deleteMeeting);

module.exports = router;