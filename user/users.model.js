
const Users = [
    {
        id: 1,
        name: 'John',
        email: 'abc@gmail.com',
        password: null,
    },
    {
        id: 2,
        name: 'Doe',
        email: 'ac2@c.com',
        password: "2x",
    }
];


async function getAllUsers() {
    return Users;
}

module.exports = {
    getAllUsers
}