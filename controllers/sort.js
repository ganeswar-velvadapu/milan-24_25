import User from "../models/user.js"


export const sortBydegree = (req, res) => {
    const degrees = ['B.Tech', 'M.Tech', 'PhD'];
    res.render('../views/sort/degree.ejs', { degrees });
}

export const sortByBranch = async (req, res) => {
    const { degree } = req.params;
    const branches = await User.distinct('branch', { degree });
    res.render('../views/sort/selectBranch.ejs', { degree, branches });
}

export const sortByYear = async (req, res) => {
    const { degree, branch } = req.params;
    const years = await User.distinct('year', { degree, branch });
    res.render('../views/sort/selectYear.ejs', { degree, branch, years });
}

export const studentsList = async (req, res) => {
    const currentUserId = req.user.id;
    const { degree, branch, year } = req.params;
    const students = await User.find({ degree, branch, year,_id: { $ne: currentUserId } }).sort({ name: 1 });
    res.render('../views/sort/studentsList.ejs', { degree, branch, year, students });
}

export const sortByHostel = async (req, res) => {
    try {
        const hostels = await User.distinct('hostel');
        res.render('../views/sort/selectHostel.ejs', { hostels });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error while retrieving hostels');
    }
}

export const studentsByHostels = async (req,res)=>{
    try {
        const currentUserId = req.user.id;
        const { hostel } = req.params;
        const students = await User.find({ hostel,_id: { $ne: currentUserId } }).sort({ name: 1 });
        res.render('../views/sort/studentsByHostels.ejs', { hostel, students});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error while retrieving students for the selected hostel');
    }
}