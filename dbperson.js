import mongoose from 'mongoose';

const cardschema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phone:String,

})

export default mongoose.model('cards',cardschema)