const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

UserSchema.methods.securePassword = password => {
  return (this.password = bcrypt.hashSync(password, 12));
};

UserSchema.methods.verifyPassword = password => {
  return (this.password = bcrypt.compareSync(password, this.password));
};

module.exports = mongoose.model("User", UserSchema);
