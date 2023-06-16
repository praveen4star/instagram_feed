const postSchema = require('../model/post.model');
const mongoose = require('mongoose');
const userSchema = require('../model/user.model');
const { join, parse } = require('path');
const {createWriteStream} = require('fs');


async function getAllPosts(args) { 
    try {
        const offset = args.offset || 0;
        const limit = args.limit || 10;
       const getPosts =  new Promise((resolve, reject) => { 
            postSchema.aggregate(
                [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'username',
                            foreignField: 'username',
                            as: 'user'
                        }
                    },
                    { $unwind: '$user' },
                    {
                        $project: {
                            id: "$_id",
                            caption : 1,
                            user: "$user",
                            fileUrl: 1,
                            comments : 1
                        }
                    },
                    { $skip: offset },
                    { $limit: limit }
                        
                ]
            ).exec((err, results) => {
                if (err) reject(err);
                resolve(results)
            })
       });
        const posts = await getPosts;
        return { message: "success", posts: posts };
        
    }
    catch (e) {
        return { message: e.message, posts: [] };
    }
}
async function getFileUrl(files) { 
    if (!files || !files.file) return "";
    const file = files.file;
    const { createReadStream, filename, mimetype, encoding } = await file;
    let { ext, name } = parse(filename);
    
    const stream = createReadStream();
    name = `single${Math.floor((Math.random() * 1000000) + 1)}`;
    let url = join(__dirname, `../uploads/${name}-${Date.now()}${ext}`);
    const imageStream = await createWriteStream(url);
    await stream.pipe(imageStream);
    const baseUrl = `http://localhost:4000`;
    url = `${baseUrl}/uploads${url.split('uploads')[1]}`;
    return url;
}
async function createPost(args) { 
    try {
        let fileUrl = await getFileUrl(args.file);
        const user = await userSchema.findOne({ username: args.username });
        if (!user) throw new Error('User not found');
        const post = new postSchema({fileUrl : fileUrl, caption : args.caption, username : args.username});
        await post.save();
        post.user = user;
        return { message: "success", post: post };
    }
    catch (e) {
        return { message: e.message, post: null };
    }
}

async function getPostById(id) { 
    return new Promise((resolve, reject) => { 
        postSchema.aggregate(
            [
                { $match : {_id : mongoose.Types.ObjectId(id)}},
                {
                    $lookup: {
                        from: 'users',
                        localField: 'username',
                        foreignField: 'username',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $project: {
                        id: "$_id",
                        caption : 1,
                        user: "$user",
                        fileUrl: 1,
                        comments : 1
                    }
                }
                    
            ]
        ).exec((err, results) => {
            if (err) reject(err);
            resolve(results[0])
        })
    });
}
async function postById(id) {
    try {
        const post = await getPostById(id);
        if(!post) throw new Error('Post not found');
        return { message: "success", post: post };
    }
    catch (e) {
        return { message: e.message, post: null };
    }
}
async function updatePostById(id, args) {
    try {
        const isPost = await postSchema.findOne({ _id:id });
        if (!isPost) throw new Error('Post not found');
        
        if (isPost.username != args.username) throw new Error('You are not authorized to update this post');
        
        if (args.file) {
            isPost.fileUrl = await getFileUrl(args.file);
            delete args.file;
        }
        if(args.hasOwnProperty('caption'))
            isPost.caption = args.caption;

        await isPost.save();
        return { message : "success", post : await getPostById(id) };
    }
    catch (e) {
        return { message: e.message, post: null };
    }
    
}

async function addComment(args) {
    try{
        const post = await postSchema.findOne({ _id: args.id });
        if (!post) throw new Error('Post not found');
        const user = await userSchema.findOne({ username: args.username });
        if (!user) throw new Error('User not found');
        post.comments.push({ username: args.username, comment: args.comment });
        await post.save();
        return { message : "success", post : await getPostById(args.id) };
    }
    catch (e) {
        return { message : e.message, post : null}
    }

}
module.exports = {
    getAllPosts,
    createPost,
    getPostById : postById,
    updatePostById,
    addComment
}