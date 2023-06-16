const PostsModel = require('./post.model')

module.exports = {
    Query: {
        getAllPosts: async () => {
            return await PostsModel.getAllPosts();
        }
    }
}