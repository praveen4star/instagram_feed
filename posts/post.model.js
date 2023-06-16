
const Posts = [
    {
        id : 1,
        title : 'Psts',
        description :"hello",
        user: {
            id: 1,
            name: 'John',
            email: 'abc@gmail.com',
            psssword: "1x",
        },
    }
];

async function getAllPosts() { 
    return Posts;
}

module.exports = {
    getAllPosts
}