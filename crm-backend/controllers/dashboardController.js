const { Op, fn, col, literal } = require('sequelize');
const Lead = require('../models/Lead');
const User = require('../models/User');
const Meeting = require('../models/Meeting');

const num = (v) => Number(v || 0);

exports.getDashboard = async (req, res) => {
  try {
    const me = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'role', 'calendlyUrl'] });
    const isEmp = req.user.role === 'employee';
    const where = isEmp ? { assignedTo: req.user.id } : {};
    const mWhere = { ...(isEmp ? { assignedTo: req.user.id } : {}), status: 'scheduled' };
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const followWhere = { ...where, nextFollowUp: { [Op.lte]: end }, status: { [Op.notIn]: ['won', 'lost'] } };
    const rep = [{ model: User, as: 'assignedRep', attributes: ['id', 'name'] }];

    const [byStatus, bySource, followUpCount, followUps, meetings, meetingCount, recentLeads] = await Promise.all([
      Lead.findAll({
        where,
        attributes: ['status', [fn('COUNT', col('id')), 'count'], [fn('SUM', col('valueAED')), 'value']],
        group: ['status'], raw: true
      }),
      Lead.findAll({
        where,
        attributes: [
          'leadSource',
          [fn('COUNT', col('id')), 'leads'],
          [fn('SUM', literal("CASE WHEN status = 'won' THEN 1 ELSE 0 END")), 'won']
        ],
        group: ['leadSource'], raw: true
      }),
      Lead.count({ where: followWhere }),
      Lead.findAll({ where: followWhere, include: rep, order: [['nextFollowUp', 'ASC']], limit: 6 }),
      Meeting.findAll({
        where: { ...mWhere, date: { [Op.gte]: start } },
        include: [
          { model: Lead, as: 'lead', attributes: ['id', 'customerName', 'companyName'] },
          ...rep
        ],
        order: [['date', 'ASC']], limit: 6
      }),
      Meeting.count({ where: { ...mWhere, date: { [Op.gte]: start } } }),
      Lead.findAll({ where, include: rep, order: [['createdAt', 'DESC']], limit: 5 })
    ]);

    const s = {};
    byStatus.forEach((x) => { s[x.status] = { count: num(x.count), value: num(x.value) }; });
    const c = (k) => (s[k] ? s[k].count : 0);
    const v = (k) => (s[k] ? s[k].value : 0);
    const total = Object.values(s).reduce((a, x) => a + x.count, 0);

    res.json({
      user: { id: me.id, name: me.name, role: me.role },
      calendlyUrl: me.calendlyUrl || '',
      stats: {
        total,
        newLeads: c('new') + c('assigned'),
        qualified: c('qualified'),
        followUps: followUpCount,
        meetings: meetingCount,
        proposals: c('proposal'),
        won: c('won'),
        lost: c('lost'),
        notContacted: c('not_contacted'),
        revenue: v('won'),
        conversion: total ? Math.round((c('won') / total) * 100) : 0
      },
      leadSources: bySource.map((x) => {
        const leads = num(x.leads), won = num(x.won);
        return { source: x.leadSource, leads, won, rate: leads ? Math.round((won / leads) * 100) : 0 };
      }).sort((a, b) => b.leads - a.leads),
      pipeline: ['qualified', 'meeting', 'proposal', 'negotiation', 'won', 'lost']
        .map((k) => ({ stage: k, count: c(k), value: v(k) })),
      followUps, meetings, recentLeads
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
