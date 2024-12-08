const path = require('path');
const User = require('../models/user'); 
const Group = require('../models/group');
const Admin = require('../models/admin');


exports.getUserGroups = async (req, res) => {
    try{
        const user = req.user;
        const groups = await Group.findAll({
            attributes: ['id', 'groupName'],
            include: [{
                model: User,
                where: { id: user.id },
                attributes: []
            }]
        });
        res.status(200).json(groups); 
    }catch(err){
        console.log('GET USER GROUPS ERROR');
        res.status(500).json({ error: err, msg: 'Could not fetch current user groups' });
    }
}

exports.postCreateGroup = async (req, res) => {
    try{
        const user = req.user;
        const groupName = req.body.groupName;
        const group = await Group.create({
            groupName
        });


        await user.addGroup(group); //update the junction table
        await Admin.create({
            userId: user.id,
            groupId: group.id
        });

        res.status(201).json(group);
    }catch(err){
        console.log('POST CREATE GROUP ERROR');
        res.status(500).json({ error: err, msg: 'Could not create group' });
    }
}