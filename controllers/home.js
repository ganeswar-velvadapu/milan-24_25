export const homeCoversations = async (req, res) => {
    try {
        const token = req.cookies.token
        res.render("../views/home.ejs", { 
            token: token, 
            message: null,
        });
    } 
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
