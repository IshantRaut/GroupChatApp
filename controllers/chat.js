const path = require('path');

const Chat = require('../models/chat');
const User = require('../models/user');
exports.getChat = (req, res) => {
    res.sendFile(path.join(__dirname,'..','views','chat.html'));
}
exports.postChat = async (req, res) => {
    try{
        const userId = req.user.id;
        const message = req.body.message;
        if(!message){
            res.status(400).json({ msg: 'All fields are required '});
            return;
        }
        const chat = await Chat.create({
            message,
            userId
        });
        res.status(200).json(chat);
    }catch(err){console.log(err);
        console.log('POST CHAT ERROR');
        res.status(500).json({ error: err, msg: 'Could not add chat '});
    }
}
exports.getAllChats = async (req, res) => {
    try{
        const chats = await Chat.findAll({
            attributes: ['message'],
            include: [{
                model: User,
                attributes: ['username']
            }]
        });
        res.status(200).json(chats);
    }catch(err){
        console.log('GET ALL CHATS ERROR');
        res.status(500).json({ error: err, msg: 'Could not fetch chats' });
    }
}