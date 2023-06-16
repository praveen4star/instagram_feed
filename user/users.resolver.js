const UserModel = require('./users.model.js');

module.exports = {
    Query: {
        Users: async () => {
            return await UserModel.getAllUsers();
         }
    }
}