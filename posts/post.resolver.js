const PostsModel = require('./post.model')

module.exports = {
    Query: {
        getAllPosts: async () => {
            const posts = await PostsModel.getAllPosts();
            return posts;
        },
        getPostById: async (_, args) => { 
            const post = await PostsModel.getPostById(args.id);
            return post;
        }
    },
    Mutation: {
        createPost: async (_, args) => {
            return await PostsModel.createPost(args);
         }
    }
}