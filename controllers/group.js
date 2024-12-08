const {Op} = require('sequelize');
const User = require('../models/user'); 
const Group = require('../models/group');
const Chat = require('../models/chat');
exports.getGroupChats = async (req, res) => {
    try{
        const lastmessageid = req.query.lastmsgid;
        const groupId = req.group.id;
        
        const groupChats = await Chat.findAll({
            where: {
                [Op.and]: [
                    { id: { [Op.gt]: lastmessageid } }, // id > lastmessageid
                    { groupId: groupId }
                ]
            },
            attributes: ['id', 'message', 'timeStamp'],
            include: [{
                model: User,
                attributes: ['username']
            }]
        });
        res.status(200).json(groupChats);
    }catch(err){
        console.log('GET GROUP CHATS ERROR');
        res.status(500).json({ error: err, msg: 'Could not fetch group chats' });
    }
}
exports.postaddChat = async (req, res) => {
    try{
        const userId = req.user.id;
        const groupId = req.group.id;
        const message = req.body.message;
        if(!message){
            res.status(400).json({ msg: 'All fields are required' });
            return;
        }
        const chat = await Chat.create({
            message,
            timeStamp: new Date(),
            userId,
            groupId,
        });
        res.status(201).json(chat);
    }catch(err){
        console.log('POST ADD CHAT IN GROUP ERROR');
        res.status(500).json({ error: err, msg: 'Could not add chat in group' });
    }
}
exports.getGroupMembers = async (req, res) => {
    try{
        const groupId = req.group.id;
        const members = await User.findAll({
            attributes: ['username', 'email'],
            include: [{
                model: Group,
                where: { id: groupId },
                attributes: []
            }]
        });
        res.status(200).json(members);
    }catch(err){
        console.log(err);
        res.status(500).json({ msg: 'Could not fetch group members' });
    }
}