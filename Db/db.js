const { type } = require("express/lib/response");
const mongoose  = require(`mongoose`);

const url = "mongodb+srv://langasammy21:langasammy21@cluster0.j8aimgl.mongodb.net/?retryWrites=true&w=majority"

async function connect() {
    try{
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}

connect();

const loginSchema = new mongoose.Schema({
    username:{
        type:String,
        unique: true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required : true,
        unique :true
    }
});

const User = new mongoose.model("User", loginSchema);
module.exports = User;

