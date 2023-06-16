const UserModel = require('./users.model.js');

module.exports = {
    Query: {
        Users: async () => {
            return await UserModel.getAllUsers();
         }
    },
    Mutation: {
        createUser: async (parent, args) => { 
            
            return UserModel.createUser(args)
        }
    }
}