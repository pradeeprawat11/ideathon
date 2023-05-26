import express from "express.js"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config();

const DATABASE = process.env.DATABASE
const PORT = process.env.PORT || 8080
// import pkg from "jsonwebtoken"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect(DATABASE)
.then(()=>{
    console.log("connection successful")
}).catch((err)=>{
    console.log(err)
})

// Schema -> modal -> document
const userSchema = new mongoose.Schema({
    name: String,
    profession: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

// register
app.post("/register", async (req, res) => {
    const {name, profession,key, email, password} = req.body;
    let user = await User.findOne({email: email});
        if(user) {
            res.send({ message : "User Already Registered"})
        }
        else if(profession === 'admin'){
            if(key === 'i3') {
                const user = new User({
                    name,
                    profession,
                    email,
                    password
                })
                
                user.save();
                res.send( {message: "Successfully Registered" })
            }
            else {
                res.send( {message: "Incorrect Key"})
            }
        }
        else{
            const user = new User({
                name,
                profession,
                email,
                password
            })
            
            user.save();
            res.send( {message: "Successfully Registered" })
        }
    })
// Routes
app.post("/login", async (req, res) => {
    // const token = jwt.sign({}, JWT_SECRET)
    const {email, password} = req.body
    // let user = await User.findOne({email: email});
    // let user = await User.findOne({email: email}, (err, user))
    let user = await User.findOne({email: email})
    if(user) {
        if(password === user.password){
        // const token = jwt.sign(user, secret);
        //    token = jwt.sign(user, JWT_SECRET)

            // if(res.status(201)){
                let userExist=true;
                res.send({userExist, message: "Login Successful" , user});
            // }
            // else{
            //     return res.json({error: "error"})
            // }
            // res.send({ message : "Login Successful", user:user})
        }
        else{
            let userExist=false;
            res.send({userExist , message: "Please Check Password"})    
        }
        }
    else{
        res.send({ message : "User Not Exist"})
    }
    })

// Problem Statements
const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    email: String,
    approve: Boolean,
    accept: Boolean,
    reject: Boolean,
})
const Post = new mongoose.model("Post", postSchema)
app.post("/post", async (req, res) => {
    const { title, description, email, approve, accept, reject} = req.body;
    if(title && description && email) {
        const post = new Post({
            title,
            description,
            email,
            approve,
            accept,
            reject,
        })
        post.save();
        res.send({ message : "Posted Successfully"})
    }
    else {
        res.send({ message : "Provide Input"})
    }
})

// Get Problems
app.get("/getPosts", async (req, res) => {
    try {
        const allData = await Post.find({});
        res.send({status:"ok", data: allData });
    } catch (error) {
        console.log(error)
    }
})

// Post Idea
const ideaSchema = new mongoose.Schema({
    title: String,
    description: String,
    leader: String,
    member: String,
    email: String,
    link: String,
    file: String,
    author: String,
    approve: Boolean,
    accept: Boolean,
    reject: Boolean,
})
const Idea = new mongoose.model("Idea", ideaSchema)
app.post("/idea", async (req, res) => {
    const { title, description, leader, member, email, link, file, author, approve, accept, reject} = req.body;
    if(title && description && leader && member && email && link && file) {
        const idea = new Idea({
            title,
            description,
            leader,
            member,
            email,
            link,
            file,
            author,
            approve,
            accept,
            reject,
        })
        idea.save();
        res.send({ message : "Submitted Successfully"})
    }
    else {
        res.send({ message : "Provide Input"})
    }
})

// Get Ideas
app.get("/getIdeas", async (req, res) => {
    try {
        const allData = await Idea.find({});
        res.send({status:"ok", data: allData });
    } catch (error) {
        console.log(error)
    }
})

// approve Post
const approvePost = async (_id) => {
    try {
        const result = await Post.findByIdAndUpdate({_id}, {$set :{accept:true}});
        // console.log(result)
    }
    catch(err){
        console.log(err)
    }
}
app.post('/approvePost', async (req, res)=>{
    approvePost(req.body.id).then(res.send({message:"Approved"}))
})
// reject post
const rejectPost = async (_id) => {
    try {
        const result = await Post.findByIdAndUpdate({_id}, {$set :{reject:true}});
        // console.log(result)
    }
    catch(err){
        console.log(err)
    }
}
app.post('/rejectPost', async (req, res)=>{
    rejectPost(req.body.id).then(res.send({message:"Rejected"}))
})

// approve Solution
const approveSolution = async (_id) => {
    try {
        const result = await Idea.findByIdAndUpdate({_id}, {$set :{accept:true}});
        // console.log(result)
    }
    catch(err){
        console.log(err)
    }
}
app.post('/approveSolution', async (req, res)=>{
    approveSolution(req.body.id).then(res.send({message:"Approved"}))
})

// reject Solution
const rejectSolution = async (_id) => {
    try {
        const result = await Idea.findByIdAndUpdate({_id}, {$set :{reject:true}});
        // console.log(result)
    }
    catch(err){
        console.log(err)
    }
}
app.post('/rejectSolution', async (req, res)=>{
    rejectSolution(req.body.id).then(res.send({message:"Rejected"}))
})

app.listen(PORT, () => {
    console.log("DB started at port " ,PORT)
})
