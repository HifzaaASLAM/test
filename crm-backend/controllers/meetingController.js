const Meeting = require('../models/Meeting');
const Lead = require('../models/Lead');
const User = require('../models/User');

const include = [
  { model: Lead, as: 'lead', attributes: ['id', 'customerName', 'companyName'] },
  { model: User, as: 'assignedRep', attributes: ['id', 'name'] }
];

exports.createMeeting = async (req, res) => {
  try {
    const { leadId, date, type, assignedTo, title, meetingLink, notes } = req.body;
    if (!leadId || !date) {
      return res.status(400).json({ message: 'Lead and date are required' });
    }
    const lead = await Lead.findByPk(leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const meeting = await Meeting.create({
      leadId, date, type: type || 'zoom',
      assignedTo: assignedTo || req.user.id,
      title, meetingLink, notes
    });

    if (['new', 'assigned', 'contacted', 'interested', 'qualified', 'follow_up'].includes(lead.status)) {
      await lead.update({ status: 'meeting' });
    }
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'employee') where.assignedTo = req.user.id;
    if (req.query.leadId) where.leadId = req.query.leadId;
    const meetings = await Meeting.findAll({ where, include, order: [['date', 'ASC']] });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    await meeting.update(req.body);
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    await meeting.destroy();
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};