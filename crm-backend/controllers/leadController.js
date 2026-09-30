const { Op } = require('sequelize');
const Lead = require('../models/Lead');
const User = require('../models/User');
const { sendLeadThankYou } = require('../services/emailServices');

const canAccess = (user, lead) => user.role !== 'employee' || lead.assignedTo === user.id;

const toList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

exports.createLead = async (req, res) => {
  try {
    const {
      customerName, companyName, phone, email, leadSource, serviceRequired,
      campaign, assignedTo, currency, opportunityValue, nextFollowUp, notes
    } = req.body;

    if (!customerName || !companyName || !phone || !email || !leadSource || !serviceRequired || !assignedTo) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const lead = await Lead.create({
      customerName, companyName, phone, email, leadSource, serviceRequired, campaign,
      assignedTo, currency: currency || 'AED', opportunityValue: opportunityValue || 0,
      nextFollowUp: nextFollowUp || null, notes, status: 'assigned'
    });
    const rep = await User.findByPk(assignedTo, { attributes: ['name', 'calendlyUrl'] });
    sendLeadThankYou(lead, rep).catch((e) => console.error('Email failed:', e.message));

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAssignees = async (req, res) => {
  try {
    const users = await User.findAll({ where: { status: 'active' }, attributes: ['id', 'name', 'role'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const {
      search, status, leadSource, serviceRequired, assignedTo,
      followUpFrom, followUpTo, page, limit
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const where = {};

    const statuses = toList(status);
    const sources = toList(leadSource);
    const services = toList(serviceRequired);
    const reps = toList(assignedTo);

    if (statuses.length) where.status = { [Op.in]: statuses };
    if (sources.length) where.leadSource = { [Op.in]: sources };
    if (services.length) where.serviceRequired = { [Op.in]: services };

    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`;
      where[Op.or] = [
        { customerName: { [Op.like]: term } },
        { companyName: { [Op.like]: term } },
        { email: { [Op.like]: term } },
        { phone: { [Op.like]: term } }
      ];
    }

    if (req.user.role === 'employee') {
      where.assignedTo = req.user.id;
    } else if (reps.length) {
      where.assignedTo = { [Op.in]: reps };
    }

    const from = followUpFrom ? new Date(`${followUpFrom}T00:00:00`) : null;
    const to = followUpTo ? new Date(`${followUpTo}T23:59:59.999`) : null;

    if ((from && !isNaN(from)) || (to && !isNaN(to))) {
      where.nextFollowUp = {};
      if (from && !isNaN(from)) where.nextFollowUp[Op.gte] = from;
      if (to && !isNaN(to)) where.nextFollowUp[Op.lte] = to;
    }

    const { count, rows } = await Lead.findAndCountAll({
      where,
      include: [{ model: User, as: 'assignedRep', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
      distinct: true
    });

    res.json({
      leads: rows,
      total: count,
      page: pageNum,
      pages: Math.ceil(count / pageSize)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id, {
      include: [{ model: User, as: 'assignedRep', attributes: ['id', 'name'] }]
    });
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    if (!canAccess(req.user, lead)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    if (!canAccess(req.user, lead)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await lead.update(req.body);
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    await lead.destroy();
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};