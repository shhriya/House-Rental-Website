const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

mongoose
  .connect("mongodb://127.0.0.1:27017/Rental", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  specification: { type: String, enum: ["Buyer", "Seller"], required: true },
});
const User = mongoose.model("User", userSchema);

const houseSchema = new mongoose.Schema({
  houseName: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  email: { type: String },
});
const House = mongoose.model("House", houseSchema);

app.post("/register", async (req, res) => {
  const { fname, lname, email, password, confirmpassword, specification } =
    req.body;

  if (password !== confirmpassword) {
    return res.status(400).json("Passwords do not match");
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
      specification,
    });

    await user.save();
    res.status(201).json({ specification });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).send("Server error");
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }

    res.status(200).json({ specification: user.specification });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send("Server error");
  }
});
app.post("/add-house", upload.single("image"), async (req, res) => {
  const { houseName, location, price, email } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    let house = await House.findOne({ houseName, email });

    if (house) {
      return res.status(400).json({ error: "House already exists" });
    }

    house = new House({
      houseName,
      location,
      price,
      image,
      email,
    });

    await house.save();
    res.status(201).json({ message: "House added successfully" });
  } catch (err) {
    console.error("Error during adding house:", err.message);
    res.status(500).send("Server error");
  }
});

app.get("/houses", async (req, res) => {
  try {
    const houses = await House.find();
    res.json(houses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/sellers", async (req, res) => {
  const { email } = req.query;

  console.log("Received email query param:", email);

  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  try {
    const seller = await User.findOne({ email, specification: "Seller" });

    if (!seller) {
      console.log("Seller not found for email:", email);
      return res.status(404).json({ error: "Seller not found" });
    }

    const houses = await House.find({ email });

    res.status(200).json({
      seller: {
        name: `${seller.fname} ${seller.lname}`,
        email: seller.email,
      },
      houses,
    });
  } catch (err) {
    console.error("Error fetching seller details and houses:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/houses/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const houses = await House.find({ email });
    res.json(houses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
app.delete("/house/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const house = await House.findByIdAndDelete(id);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    res.status(200).json({ message: "House deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/house/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { houseName, location, price } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    let house = await House.findById(id);

    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    house.houseName = houseName || house.houseName;
    house.location = location || house.location;
    house.price = price || house.price;
    if (image) house.image = image;

    await house.save();
    res.status(200).json({ message: "House updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
