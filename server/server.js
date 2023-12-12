const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const NodeRSA = require("node-rsa");
const User = require("./models/user.model");

const app = express();

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

publicKey =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCMHI/dTfmM/PuwTw7ENGQMHp3c\n" +
  "9PNQ9psyjIh31c5TMzH5zoPaQ+aTqoP/xGc9qavM62B/em6n7RO5xVCyHi+ys/uc\n" +
  "yohFnFqVd/8pUew+j7DJvBKMTlKRB3jH5sBzpu8vCU3HVMRV7WLjcdPabuJFkdIw\n" +
  "Bbxz98ipTNvh9TF5TQIDAQAB\n" +
  "-----END PUBLIC KEY-----";
privateKey =
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIICWwIBAAKBgQCMHI/dTfmM/PuwTw7ENGQMHp3c9PNQ9psyjIh31c5TMzH5zoPa\n" +
  "Q+aTqoP/xGc9qavM62B/em6n7RO5xVCyHi+ys/ucyohFnFqVd/8pUew+j7DJvBKM\n" +
  "TlKRB3jH5sBzpu8vCU3HVMRV7WLjcdPabuJFkdIwBbxz98ipTNvh9TF5TQIDAQAB\n" +
  "AoGAXBIgz7J/vJA57H/nGjO7UuODpUEp6xhCoBMNUoIjVTUdMCTvLCzWhk7U8uvj\n" +
  "U/f9N2mtPdf8g0kdX0Q0ZPfFK1A/phXXA3OM3D87aCbItmG1rV3qDGTuL1QFapTm\n" +
  "d3mMy1XYRUbZDBdG28ZEKiEmeIhkiCDExYzce7/gTcfZwUECQQDs8+9J1nKJvaV3\n" +
  "O2wwXHZnFpQ2TgfimjT1/lqYo5Fjx5G28w1CddDSiqxzEC8GwBYl6LlPIE2QQDWW\n" +
  "+n5N3AAJAkEAl1/OkXyjd4XQrPaH9qyCjzm8zorCjq50bVN84KKbJNMzBVFaE0SN\n" +
  "NgdJtpaVzBEOMwSgWhAQL8NGF14guye4JQJAP52iIcXETHyw/tjiS/2XAEhMlGPQ\n" +
  "tCLIkz6tngtUDmDXGzIX3j75SH1YnS+8IGjTyWu4zKiUimTivl0UKd0l2QJAHXx+\n" +
  "Inzi4r9gPLDxHy3PaNLYYmtJJr340+r1YlSKYAv73kdQgnxR/XpB8501pMCVwX5f\n" +
  "Nev3GzawipC9U3eTOQJAL4sPTzBfixo4WZYNFOB6EDtsq+ejV1jMu6C9QkyUBOQb\n" +
  "skC2fOAvGHwaJzb1Uu995Aj6ApPfrdZzdwsGQg6AWQ==\n" +
  "-----END RSA PRIVATE KEY-----";

let keyPrivate = new NodeRSA(privateKey);
let keyPublic = new NodeRSA(publicKey);

// decryptedString = keyPrivate.decrypt(encryptedString, "utf8");

app.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Encrypt the password with the public key
    encryptedPassword = keyPublic.encrypt(password, "base64");

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User Already Exists.");
      error.statusCode = 422;
      throw error;
    }

    // Create a new user
    const user = new User({
      fullname: name,
      email,
      password: encryptedPassword,
    });

    // Save the user to the database
    const result = await user.save();
    console.log("result:", result);

    // Respond with success
    res.json({ message: "Account created" });
  } catch (error) {
    console.error(error);
    // Send an error response
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Wrong email");
      error.statusCode = 401;
      throw error;
    }

    // Decrypt the stored password and compare with the provided password
    const decryptedPassword = keyPrivate.decrypt(existingUser.password, "utf8");
    const isPasswordMatch = decryptedPassword === password;

    if (isPasswordMatch) {
      return res.status(200).json({ message: "Logged in successfully" });
    } else {
      const error = new Error("Password incorrect");
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.muuzvzg.mongodb.net/EncryptionApp`
  )
  .then(conn => {
    console.log("Listening on port 8000");
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });
