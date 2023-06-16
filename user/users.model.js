const userSchema = require('../model/user.model');

async function getAllUsers() {
    const users = await userSchema.find({}, { _id: 0, __v: 0 });
    return users;
}
async function createUser(args) { 
    try {
        /** duplicate user  */
        const isUser = await userSchema.findOne({ username: args.username });
        if (isUser) throw new Error('User already exists');
        const user = new userSchema(args);
        await user.save();
        return { message: "User created successfully" };
        
    }
    catch (err) {
        console.log(err.message);
        return {message : err.message}
    }
}

module.exports = {
    getAllUsers,
    createUser
}