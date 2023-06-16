const { db } = require("../config/db.connection");
const Schema = db.Schema;

const postSchema = new Schema(
    {
        title: String,
        description: String,
        username : {type : String, required : true},
    },
    {
        timestamps: true,
    }
);

const Post = db.model("Post", postSchema);

module.exports = Post;