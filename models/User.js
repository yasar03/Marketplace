// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const UserSchema = new mongoose.Schema({
//   username: { type: String, unique: true },
//   password: String,
//   shops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
//   pendingInvites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }] // Add pending invites array
// });

// // Hash the user's password before saving it to the database
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const hash = await bcrypt.hash(this.password, 10);
//   this.password = hash;
//   next();
// });

// // Compare the user's password with the hashed password in the database
// UserSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  shops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
  pendingInvites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }]
});

// Hash the user's password before saving it to the database
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// Compare the user's password with the hashed password in the database
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
