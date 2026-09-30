const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', checkRole('management', 'team_leader', 'employee'), leadController.createLead);
router.get('/', leadController.getLeads);
router.get('/assignees', leadController.getAssignees);
router.get('/:id', leadController.getLeadById);
router.put('/:id', checkRole('management', 'team_leader', 'employee'), leadController.updateLead);
router.delete('/:id', checkRole('management', 'team_leader'), leadController.deleteLead);

module.exports = router;
