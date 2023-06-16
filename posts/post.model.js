const postSchema = require('../model/post.model');
const mongoose = require('mongoose');
const userSchema = require('../model/user.model');
const { join, parse } = require('path');
const {createWriteStream} = require('fs');


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
                            user: "$user",
                            fileUrl : 1
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
        console.log(args);
        let fileUrl = "";
        if (args.file) {
            console.log(args.file);
            const file = args.file.file;
            const { createReadStream, filename, mimetype, encoding } = await file;
            let { ext, name } = parse(filename);
            
            const stream = createReadStream();
            name = `single${Math.floor((Math.random() * 1000000) + 1)}`;
            let url = join(__dirname, `../uploads/${name}-${Date.now()}${ext}`);
            const imageStream = await createWriteStream(url);
            await stream.pipe(imageStream);
            const baseUrl = `http://localhost:4000`;
            url = `${baseUrl}/${url.split('uploads')[1]}`;
            fileUrl = url;
            console.log(fileUrl);
        }
        const user = await userSchema.findOne({ username: args.username });
        if (!user) throw new Error('User not found');
        const post = new postSchema({fileUrl : fileUrl, title : args.title, description : args.description, username : args.username});
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
                        user: "$user",
                        fileUrl : 1
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

async function updatePostById(id, args) {
    try {

        if (args.file) {
            console.log(args.file);
            const file = args.file.file;
            const { createReadStream, filename, mimetype, encoding } = await file;
            let { ext, name } = parse(filename);
            
            const stream = createReadStream();
            name = `single${Math.floor((Math.random() * 1000000) + 1)}`;
            let url = join(__dirname, `../uploads/${name}-${Date.now()}${ext}`);
            const imageStream = await createWriteStream(url);
            await stream.pipe(imageStream);
            const baseUrl = `http://localhost:4000`;
            url = `${baseUrl}/${url.split('uploads')[1]}`;
            fileUrl = url;
            delete args.file;
            args.fileUrl = fileUrl;
        }
        await postSchema.updateOne({ _id: args.id }, {$set : args});
        return getPostById(args.id);
    }
    catch (e) {
        console.log(e);
        return e.message;
    }
    
}
module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    updatePostById 
}