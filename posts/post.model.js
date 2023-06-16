const postSchema = require('../model/post.model');
const mongoose = require('mongoose');

async function getAllPosts() { 
    try {

        return new Promise((resolve, reject) => { 
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
                            title: 1,
                            description: 1,
                            user : "$user"
                        }
                    }
                        
                ]
            ).exec((err, results) => {
                if (err) reject(err);
                resolve(results)
            })
        });
        
    }
    catch (e) {
        console.log(e);
        return e.message;
    }
}
async function createPost(args) { 
    try {
        const user = await userSchema.findOne({ username: args.username });
        if (!user) throw new Error('User not found');
        const post = new postSchema(args);
        await post.save();
        post.user = user;
        return post;
    }
    catch (e) {
        console.log(e);
        return e.message;
    }
}

async function getPostById(id) { 
    return new Promise((resolve, reject) => { 
        postSchema.aggregate(
            [
                {$match : {_id : mongoose.Types.ObjectId(id)}},
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
                        title: 1,
                        description: 1,
                        user : "$user"
                    }
                }
                    
            ]
        ).exec((err, results) => {
            if (err) reject(err);
            // console.log(results);
            resolve(results[0])
        })
    });
}
module.exports = {
    getAllPosts,
    createPost,
    getPostById
}