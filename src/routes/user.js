const express = require("express");
const validator = require("validator");
const passwordValidator = require("password-validator");
const router = express.Router();
const user = require("../db/user");
const jwt = require("jsonwebtoken");
const jwtKey = "my-key";

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
      let Token;
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
      // this jwt token will be generated when we signup
      jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.status(203).send({ message: "something went wrong or token expired" });
        } else {
          Token = token;
        }
      });
    }
    let valu = new user(result);
    let data = await valu.save();
    data = data.toObject();
    resp.status(200).send({ data, auth: Token , message:"User Created Successfully. Please Login Now." });

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
        jwt.sign({ userInfo }, jwtKey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            res.send({ message: "something went wrong or token expired" });
          } else {
            res.status(200).send({ userInfo, message: "User Exists", auth:token });
          }
        });
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

//http://localhost:5000/user/forgetpassword

router.post("/forgetpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await user.findOne({ email: email });
    if (!user) {
      return res
        .status(203)
        .send({ message: "No user is registered with this email" });
    } else {
      return res
        .status(200)
        .send({ message: "User is registered", email: email });
    }
  } catch (err) {
    console.log(err);
    res.status(203).send({ message: "Error in sending message" });
  }
});

//http://localhost:5000/user/passwordupdate
router.put("/passwordupdate", async (req, res) => {
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
  const { email, password, confirmpassword } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.status(203).send({ message: "Invalid email address" });
    }
    //password validation check
    const isValid = schema.validate(password);
    if (!isValid) {
      return res.status(203).send({ message: "Password is not valid" });
    }
    if (password !== confirmpassword) {
      return res
        .status(203)
        .send({ message: "Password and confirm password does not match" });
    }
    var query = { email: email };
    var data = { password: password, confirmpassword: confirmpassword };
    const result = await user.updateOne(query, data);
    res.status(200).send({result, message:"Password updated successfully"});
  } catch (err) {
    console.log(err);
    res.status(203).send({ message: "Error in resetting password" });
  }
});

module.exports = router;
