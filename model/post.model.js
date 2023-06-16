const { db } = require("../config/db.connection");
const Schema = db.Schema;

const postSchema = new Schema(
    {
        caption : {type : String},
        fileUrl : { type : String, required : true},
        username : {type : String, required : true},
        comments: [
            {
                comment: { type: String, required: true },
                username: { type: String, required: true }
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Post = db.model("Post", postSchema);

module.exports = Post;