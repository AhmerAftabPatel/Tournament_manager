const { check, validationResult } = require("express-validator");
var express = require("express");
var router = express.Router();
const {
  signout,
  signup,
  signin,
  isSignedIn,
  getAllUsers
} = require("../controllers/authentication");

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 })
  ],
  signin
);

router.post(
  "/signup",
  [
    // check("phone_number", "Number should be 10 char").isLength({min : 10}),
    check("first_name", "name should be at least 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "pass  should be atleast 7 char").isLength({ min: 5 }),
  ],
  signup
);

router.get("/signout", signout);

router.get("/users",getAllUsers);

router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.authentication);
});

module.exports = router;
