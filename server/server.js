const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(express.static(path.join(__dirname, "..")));
app.use(express.json());
app.use(cors());

/* ---------------- DATABASE CONNECTION ---------------- */

mongoose.connect("mongodb+srv://Yashaswini:yashu%402007@cluster0.vve2mnm.mongodb.net/collegeEvents?retryWrites=true&w=majority")
.then(()=>console.log("MongoDB Atlas Connected"))
.catch(err=>console.log(err));

/* ---------------- STUDENT SCHEMA ---------------- */

const studentSchema = new mongoose.Schema({
name:String,
email:{type:String,unique:true},
password:String
});


const Student = mongoose.model("Student", studentSchema);

/* ---------------- CLUB SCHEMA ---------------- */

const clubSchema = new mongoose.Schema({
email:{type:String,unique:true},
password:String
});

const Club = mongoose.model("Club", clubSchema);

/* ---------------- EVENT REGISTRATION SCHEMA ---------------- */

const registrationSchema = new mongoose.Schema({

studentEmail:String,
eventId:String

});

const Registration = mongoose.model("Registration", registrationSchema);

/* ---------------- LOGIN / REGISTER ---------------- */

app.post("/studentLogin", async (req,res)=>{

const {name,email,password} = req.body;

try{

if(!email || !password){
return res.json({
success:false,
message:"Email and Password required"
});
}

const student = await Student.findOne({email:email});

/* FIRST TIME USER */

if(!student){

const newStudent = new Student({
name:name || "Student",
email:email,
password:password
});

await newStudent.save();

return res.json({
success:true,
studentName:name || "Student",
message:"Registered successfully"
});

}

/* PASSWORD CHECK */

if(student.password !== password){

return res.json({
success:false,
message:"Invalid password ❌"
});

}

/* LOGIN SUCCESS */

return res.json({
success:true,
studentName:student.name,
message:"Login successful"
});

}catch(err){

console.log("LOGIN ERROR:",err);

return res.json({
success:false,
message:"Something went wrong"
});

}

});

/* ---------------- CLUB LOGIN ---------------- */

app.post("/clubLogin", async (req,res)=>{

const {email,password} = req.body;

try{

const club = await Club.findOne({email:email});

/* FIRST TIME LOGIN → REGISTER */

if(!club){

const newClub = new Club({
email:email,
password:password
});

await newClub.save();

return res.json({
success:true,
message:"Club registered successfully"
});

}

/* WRONG PASSWORD */

if(club.password !== password){

return res.json({
success:false,
message:"Wrong password ❌"
});

}

/* LOGIN SUCCESS */

return res.json({
success:true,
message:"Login successful"
});

}catch(err){

console.log(err);

return res.json({
success:false,
message:"Server error"
});

}

});

/* ---------------- EVENT SCHEMA ---------------- */

const eventSchema = new mongoose.Schema({
clubName:String,
eventName:String,
clubDesc:String,
eventDesc:String,
venue:String,
date:String,
time:String,
link:String
});

const Event = mongoose.model("Event",eventSchema);

/* ---------------- SAVE EVENT ---------------- */

app.post("/addEvent", async (req,res)=>{

try{

const newEvent = new Event(req.body);
await newEvent.save();

res.json({message:"Event saved successfully"});

}catch(err){

res.json({message:"Error saving event"});

}

});

/* ---------------- GET EVENTS ---------------- */

app.get("/getEvents", async (req,res)=>{

const events = await Event.find();
res.json(events);

});

/* ---------------- UPDATE EVENT ---------------- */

app.put("/updateEvent/:id", async (req,res)=>{

await Event.findByIdAndUpdate(req.params.id, req.body);

res.json({message:"Event updated successfully"});

});

/* ---------------- DELETE EVENT ---------------- */

app.delete("/deleteEvent/:id", async (req,res)=>{

await Event.findByIdAndDelete(req.params.id);

res.json({message:"Event deleted successfully"});

});

/* ---------------- SERVER ---------------- */

app.listen(3000, ()=>{
console.log("Server running on port 3000");
});

/* ---------------- ADMIN LOGIN ---------------- */

app.post("/adminLogin",(req,res)=>{

const {email,password} = req.body;

const adminEmail = "admin@vitap.ac.in";
const adminPassword = "admin123";

if(email === adminEmail && password === adminPassword){

return res.json({
success:true,
message:"Admin login successful"
});

}

return res.json({
success:false,
message:"Invalid admin credentials"
});

});

/* ---------------- GET STUDENTS ---------------- */

app.get("/getStudents", async (req,res)=>{

try{

const students = await Student.find();

res.json(students);

}catch(err){

console.log(err);

res.json([]);

}

});

/* ---------------- GET CLUBS ---------------- */

app.get("/getClubs", async (req,res)=>{

try{

const clubs = await Club.find();

res.json(clubs);

}catch(err){

console.log(err);

res.json([]);

}

});

/* ---------------- REGISTER EVENT ---------------- */

app.post("/registerEvent", async (req,res)=>{

const {studentEmail,eventId} = req.body;

try{

// check if already registered
const existing = await Registration.findOne({
studentEmail:studentEmail,
eventId:eventId
});

if(existing){

return res.json({
message:"You already registered for this event"
});

}

// save registration

const reg = new Registration({
studentEmail:studentEmail,
eventId:eventId
});

await reg.save();

res.json({
message:"Registration successful 🎉"
});

}catch(err){

console.log(err);
res.json({
message:"Server error"
});

}

});

/* ---------------- GET EVENT REGISTRATION COUNT ---------------- */

app.get("/eventCount/:eventId", async (req,res)=>{

const eventId = req.params.eventId;

try{

const count = await Registration.countDocuments({
eventId:eventId
});

res.json({
count:count
});

}catch(err){

console.log(err);

res.json({
count:0
});

}

});

/* ---------------- GET STUDENT REGISTERED EVENTS ---------------- */

app.get("/myEvents/:email", async (req,res)=>{

const email = req.params.email;

try{

const registrations = await Registration.find({studentEmail:email});

let eventIds = registrations.map(r => r.eventId);

const events = await Event.find({_id:{$in:eventIds}});

res.json(events);

}catch(err){

console.log(err);
res.json([]);

}

});
