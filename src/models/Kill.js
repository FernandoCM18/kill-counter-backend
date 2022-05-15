import mongoose, {plugin, Schema} from 'mongoose';

const KillSchema = new Schema({
  low: {
    type: Number,
    required: true,
    min: 0
  },
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  idGroup: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  }
}, {
    timestamps: true
});

export default mongoose.model('Kill', KillSchema);