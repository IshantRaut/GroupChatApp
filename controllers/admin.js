const User = require('../models/user');
exports.deleteGroupMember = async (req, res) => {
    try{
        const memberEmail = req.query.email;
        const group = req.group;
        const user = req.user;
        if(user.email === memberEmail){
            res.status(400).json({ msg: 'Admin cannot remove itself from group' });
            return;
        }
        
        const member = await User.findOne({
            where: { email: memberEmail }
        });
        if(!member){
            res.status(404).json({ msg: 'member not found' });
            return;
        }
        await group.removeUser(member); // update user_group junction table
        res.status(200).json({ 
            msg: `member <${member.username}> removed from the group <${group.groupName}> by admin <${user.username}>` 
        });
    }catch(err){
        console.log('DELETE GROUP MEMBER ERROR');
        res.status(500).json({ error: err, msg: 'Could not delete group member' });
    }
}