import User from "../models/user.js"


export const sortBydegree = (req, res) => {
    const token = req.cookies.token
    const degrees = ['B.Tech', 'M.Tech', 'PhD'];
    res.render('../views/sort/degree.ejs', { degrees,token});
}

export const sortByBranch = async (req, res) => {
    const token = req.cookies.token
    const { degree } = req.params;
    const branches = await User.distinct('branch', { degree });
    res.render('../views/sort/selectBranch.ejs', { degree, branches,token});
}

export const sortByYear = async (req, res) => {
    const token = req.cookies.token
    const { degree, branch } = req.params;
    const years = await User.distinct('year', { degree, branch });
    res.render('../views/sort/selectYear.ejs', { degree, branch, years,token });
}

export const studentsList = async (req, res) => {
    const token = req.cookies.token
    const currentUserId = req.user.id;
    const { degree, branch, year } = req.params;
    const students = await User.find({ degree, branch, year,_id: { $ne: currentUserId } }).sort({ name: 1 });
    res.render('../views/sort/studentsList.ejs', { degree, branch, year, students,token });
}

export const sortByHostel = async (req, res) => {
    const token = req.cookies.token
    try {
        const hostels = await User.distinct('hostel');
        res.render('../views/sort/selectHostel.ejs', { hostels,token });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error while retrieving hostels');
    }
}

export const studentsByHostels = async (req,res)=>{
    const token = req.cookies.token
    try {
        const currentUserId = req.user.id;
        const { hostel } = req.params;
        const students = await User.find({ hostel,_id: { $ne: currentUserId } }).sort({ name: 1 });
        res.render('../views/sort/studentsByHostels.ejs', { hostel, students,token});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error while retrieving students for the selected hostel');
    }
}


export const sortByPlacements = async  (req,res)=>{
    const token = req.cookies.token
    try {
        const companies = await User.distinct('company');
        res.render("../views/sort/companylist.ejs",{companies,token})
    } catch (error) {
        console.log(error)
    }
}

export const studentsByCompany = async (req,res)=>{
    const token = req.cookies.token
    try {
        const {company} = req.params
        const currentUserId = req.user.id;
        const students = await User.find({ company,_id: { $ne: currentUserId } }).sort({ name: 1 });
        res.render("../views/sort/studentsByCompany.ejs",{students,token,company})
    } catch (error) {
        console.log(error)
    }
}