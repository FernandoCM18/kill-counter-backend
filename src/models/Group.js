import mongoose, {Schema} from 'mongoose';

const GroupSchema = new Schema({
  name:{
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }]
}, {
  timestamps: true
});

export default mongoose.model('Group', GroupSchema);