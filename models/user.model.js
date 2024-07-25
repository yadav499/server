const mongoose = require("mongoose");

const wabaSchema = mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    companyWebsite: {
        type: String,
        required: true
    },
    companySize: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    planFamilyId: {
        type: String,
        required: true
    },
    wcc_id: {
        type: String,
        required: true
    }
}, { timestamps: true });

const UserModel = mongoose.model("User", wabaSchema);
module.exports = UserModel;
