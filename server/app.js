const express = require("express");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const auth = require("./middleware/auth");
const dotenv = require("dotenv");
const path = require("path");
const app = express();

require("./mongoose/index").connect();
const User = require("./models/users");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());
dotenv.config();

const router = express.Router();

// ----------- start Authentication/Authorization ------------------
router.post("/signup", (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  user
    .save()
    .then(async function () {
      const token = await user.generateAuthToken();
      res.cookie("Auth", token, {
        expires: new Date(Date.now() + 300000),
        httpOnly: true,
        // sameSite: "none",
        secure: true,
      });
      res.send({ user: user.getPublicObject(), token });
    })
    .catch((err) => res.send(err));
});

router.post("/signin", async function (req, res) {
  try {
    const user = await User.authenticateByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.cookie("Auth", token, {
      expires: new Date(Date.now() + 300000),
      httpOnly: true,
      // sameSite: "none",
      secure: true,
    });

    res.send({ user: user.getPublicObject(), token: req.cookies });
  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
});

router.post("/signout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });

    await req.user.save();
    res.send("Signed Out!");
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/signout-all", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Signed Out!");
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/user-profile", auth, async (req, res) => {
  try {
    await User.deleteOne({ _id: req.user._id });
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});
// ----------- end Authentication/Authorization ------------------

router.get("/user-profile", auth, async (req, res) => {
  const publicObject = req.user.getPublicObject();
  res.send(publicObject);
});

const upload = multer({
  dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload correct format image!"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/upload-avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.post("/delete-avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

app.use("/api/", router);

// ------------------ Deployment ----------------------

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
