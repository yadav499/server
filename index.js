const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const dotenv = require("dotenv").config();
const cors = require("cors");
const UserModel = require("./models/user.model.js");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
  

    app.get("/", (req,res)=>{
        return res.status(200).send({
            success:true,
            message:"Hii, server is working"
        })
    })
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
      });
app.post("/send-details", async (req, res) => {
    const {
        displayName, 
        email,
        companyName, 
        phone,
        companyWebsite,
        companySize, 
        industry, 
        projectName, 
        planName, 
        planFamilyId, 
        wcc_id
    } = req.body;

    try {
        if (!displayName || !email || !companyName || !phone || !companyWebsite || !companySize || !industry || !projectName || !planName || !planFamilyId || !wcc_id) {
            return res.status(400).send({
                message: "Please fill all the fields"
            });
        } else {
            const newUser = new UserModel({
                displayName, 
                email,
                companyName, 
                phone,
                companyWebsite,
                companySize, 
                industry, 
                projectName, 
                planName, 
                planFamilyId, 
                wcc_id
            });
            await newUser.save();
            return res.status(200).send({
                message: "Data sent successfully",
                data: newUser
            });
        }
    } catch (err) {
        return res.status(500).send({
            message: "Something went wrong",
            error: err.message
        });
    }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
