const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    location: {
      type: String,
    },
    designation: {
      type: String,
    },
    linkedinUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// profileSchema.pre("save", async function (next) {
//   // if (!this.isModified("password")) {
//   //   return next();
//   // }

//   // this.password = await bcrypt.hash(this.password, 10);
//   console.log(this.user);
// });

module.exports = mongoose.model("Profile", profileSchema);
