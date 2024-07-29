const express = require("express");
const validator = require("validator");
const passwordValidator = require("password-validator");
const router = express.Router();
const user = require("../db/user");
const contactUs = require("../db/contactus");

//http://localhost:5000/user/signup
router.post("/signup", async (req, resp) => {
  const schema = new passwordValidator();
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces();
  try {
    const { name, email, password, confirmpassword } = req.body;
    const result = {
        name: name,
      email: email,
      password: password,
      confirmpassword: confirmpassword,
    };
    //   let Token;
    console.log(result);
    if (!validator.isEmail(email)) {
      return resp.status(203).send({ message: "Invalid email address" });
    }
    //password validation check
    const isValid = schema.validate(password);
    if (!isValid) {
      return resp.status(203).send({ message: "Password is not valid" });
    }
    if (password !== confirmpassword) {
      return resp
        .status(203)
        .send({ message: "Password and confirm password does not match" });
    }
    let userCheck = await user.findOne({ email: email });
    console.log("uZER chack:", userCheck);
    if (userCheck) {
      return resp.status(203).send({ message: "user already exists" });
    } else {
      let valu = new user(result);
      let data = await valu.save();
      data = data.toObject();
      //   resp.status(200).send({ data, auth: Token });
      resp.status(200).send({ data });
    }
  } catch (err) {
    console.log("end Err", err);
    resp.status(203).send({
      message: "something went wrongg",
    });
  }
});

// Login

//http://localhost:5000/user/login

router.post("/login", async (req, res) => {
  const { email } = req.body;
  const userInfo = await user.findOne({ email: email });
  try {
    if (userInfo) {
      if (req.body.password === userInfo.password) {
        res.status(200).send({ userInfo, message: "User Exists" });
      } else {
        res.status(203).send({ message: "wrong password" });
      }
    } else {
      return res.status(203).send({ message: "cannot find user" });
    }
  } catch (err) {
    res.status(203).json(console.log(err));
  }
});


//http://localhost:5000/user/contactus

// router.post("/contactus", async (req, res) => {
//     const { name, email, phonenumber , state , district , text } = req.body;
//     try {
//       const contactusData = {
//         name: name,
//         email: email,
//         phonenumber: phonenumber,
//         state: state,
//         district: district,
//         text: text,
//       };
//       const contactus = new contactUs(contactusData);
//       await contactus.save();
//       res.status(200).send({ message: "Message sent successfully" });
//     } catch (err) {
//       console.log(err);
//       res.status(500).send({ message: "Error in sending message" });
//     }
  
// });




module.exports = router;
