const { join, parse } = require('path');
const PostsModel = require('./post.model')
const {createWriteStream} = require('fs');

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
        },
        updatePost: async (_, args) => { 
            return await PostsModel.updatePostById(args.id, args);
        },
        addComment: async (_, args) => { 
            return await PostsModel.addComment(args);
        }
    }
}