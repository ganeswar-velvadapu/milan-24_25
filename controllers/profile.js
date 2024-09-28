import User from "../models/user.js"

export const getProfile = async (req,res)=>{
    const token = req.cookies.token
    const id = req.user.id
    try {
        
        const user = await User.findById(id)
         let parsedClubs;
         if (user.clubs && user.clubs.length > 0) {
             parsedClubs = JSON.parse(user.clubs[0]); 
         } else {
             parsedClubs = []; 
         }
        res.render("../views/user/profile.ejs",{user,token,parsedClubs})
    } catch (error) {
        
    }
}