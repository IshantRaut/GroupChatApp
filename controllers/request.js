const { Op } = require('sequelize');
const User = require('../models/user'); 
const Group = require('../models/group');
const Request = require('../models/request');
exports.postGenerateRequest = async (req, res) => {
    try{
        const userId = req.user.id;
        const groupId = req.group.id;
        const receiverEmail = req.body.email;
        if(!receiverEmail){
            res.status(400).json({ msg: 'Receiver email required to send request' });
            return;
        }
        const request = await Request.create({
            email: receiverEmail,
            status: 'pending',
            userId,
            groupId
        });
        res.status(201).json(request);
    }catch(err){
        console.log('POST GENERATE REQUEST ERROR');
        res.status(500).json({ error: err, msg: 'Could not create request'});
    }
}
exports.getPendingRequests = async (req, res) => {
    try{
        const email = req.user.email;
        const requests = await Request.findAll({
            where: {
                [Op.and]: [
                    { email },
                    { status: 'pending' }
                ]
            },
            attributes: [],
            include: [{
                model: User,
                attributes: ['username']
            },{
                model: Group,
                attributes: ['id', 'groupName']
            }]
        });
        res.status(200).json(requests);
    }catch(err){
        console.log(err);
        res.status(500).json({ error: err, msg: 'Could get requests'});
    }
}
exports.postConfirmRequest = async (req, res) => {
    try{
        const user = req.user;
        const email = req.user.email;
        const groupId = req.query.groupId;
        const status = req.body.status === 'accepted' ? 'accepted' : 'rejected';
        const request = await Request.findOne({
            where: {
                [Op.and]: [
                    { email },
                    { status: 'pending' },
                    { groupId }
                ]
            },
            include: [{
                model: Group
            }]
        });
        if(!request){
            res.status(400).json({ msg: 'Request not found' });
            return;
        }
        if(status === 'rejected'){
            request.status = status;
            await request.save();
            res.status(200).json({ status: 'rejected' });
            return;
        }
        const group = request.group;
        await user.addGroup(group);  // update the junction table
        request.status = status;
        await request.save();
        res.status(200).json({ status: 'accepted' });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: err, msg: 'Could not confirm request'});
    }
}