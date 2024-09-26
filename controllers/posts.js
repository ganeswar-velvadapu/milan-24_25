import Post from "../models/posts.js"
import User from "../models/user.js"
export const addNewPost = async (req,res) =>{
    try {
        const {caption,image} = req.body
        const author = req.id
        const post = await Post.create({
            caption,
            image,
            author:author
        })
        const user = await User.findById(author)
        if(user){
            user.posts.push(post._id)
            await user.save()
        }
        await post.populate({path:"author",select:"-password"})
        return res.status(200).json({
            "message" : "post created"
        })
    } catch (error) {
        console.log(error)
    }
}

const getAllPosts = async (req,res)=>{
    try {
        const post = Post.find().sort({createdAt:-1}).populate({path:"author",select:'username,profilePic'}).populate({path:'author',select:"username,profilePic"}).populate(
            {
                path:"comments",
                sort:{createdAt:-1},
                populate:{
                    path:"author",
                }
            }
        )
        return res.json({
            posts
        })
    } catch (error) {
        console.log(error)
    }
}