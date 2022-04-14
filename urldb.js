import mongoose from 'mongoose';

const urlschema = mongoose.Schema({
      url:String,
      username:String,
});

export default mongoose.model('url',urlschema)