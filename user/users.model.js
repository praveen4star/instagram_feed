const userSchema = require('../model/user.model');

async function getAllUsers() {
    const users = await userSchema.find({}, { _id: 0, __v: 0 });
    // console.log(users);
    return users;
}
async function createUser(args) { 
    const user = new userSchema(args);
    await user.save();
    return user;
}

module.exports = {
    getAllUsers,
    createUser
}