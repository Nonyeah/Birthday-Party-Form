import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import nodemon from "nodemon";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: `${process.env.EMAIL_USER}, nonyeulasi@hotmail.com`,
  subject: "80th Birthday Party Guest List Update",
  totalGuests: 0,
  attachments: [
    {
      filename: "invitationList.txt",
      path: path.join(__dirname, "invitationList.txt"),
    },
  ],
};

app.use(
  cors({
    origin: "https:ethels-80th-birthday.online",
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.post("/", (req, res) => {
  console.log("Request body:", req.body);
  const { name, email, attending, otherguests } = req.body;
  const [firstName, lastName] = name.split(" ");

  const tempArray = [];
  let guestCount = 0;

  try {
    const fileData = fs.readFileSync("invitationList.txt", "utf-8");
    if (fileData) {
      const guestList = JSON.parse(fileData);
      tempArray.push(...guestList);
    }
  } catch (err) {
    console.log("No existing file or invalid JSON.");
  }

  tempArray.push(req.body);
  tempArray.forEach((guest) => {
    if (guest.attending) {
      let totalAttendees = Number(guest.otherguests) + 1;
      guestCount += totalAttendees;
    }
  });

  fs.writeFile(
    "invitationList.txt",
    JSON.stringify(tempArray, null, 4),
    (err) => {
      if (err) console.log(err);
    }
  );

  if (attending) {
    res.send(
      `That's awesome ${firstName}, we look forward to seeing you on 1st November!`
    );
  } else {
    res.send(`Awww that's a pity ${firstName}, we're sorry you can't make it.`);
  }

  mailOptions.totalGuests = guestCount;
  mailOptions.text = `Updated list of attendees on 1st November. Current total guest count ${mailOptions.totalGuests} `,

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(
        "Error:",
        process.env.EMAIL_USER,
        process.env.EMAIL_PASSWORD,
        error
      );
    } else {
      console.log("Info", info);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
