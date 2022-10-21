var mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
var { ObjectId } = mongoose.Schema;
var Schema = mongoose.Schema;
var userSchema = new Schema(
  {
    first_name : {
      type : String,
      required : true,
    },
    last_name : {
      type : String,
      required : true,
    },
    email : {
      type : String,
      unique : true,
      required : true,
    },
    role: {
      type: Number,
      default: 0
    },
    macthes : {
      played : Number,
      draw : Number,
      losses : Number,
      wins : Number
    },
    encry_password: {
      type: String,
      required: true
    },
    salt: String
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
