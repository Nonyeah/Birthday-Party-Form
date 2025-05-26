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
const pathAttending = path.join(__dirname, "confirmation_email.html"); //email attending path
const pathNotAttending = path.join(__dirname, "decline_email.html"); //email not attending path

//create transporter for sending system emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


//transporter configuration for email sent to organiser
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: `${process.env.EMAIL_USER}, nonyeulasi@hotmail.com`,
  subject: "80th Birthday Party Guest List Update",
  attachments: [
    {
      filename: "invitationList.txt",
      path: path.join(__dirname, "invitationList.txt"),
    },
  ],
};

//transporter configuration for email sent to guests
const guestMailOptions = {
  from: process.env.EMAIL_USER,
  subject: "Mama Ethels's 80th Birthday Bash!"
};

app.use(
  cors({
    origin: "https://ethels-80th-birthday.online",
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.post("/api", (req, res) => {
  console.log("Request body:", req.body);
  const { name, email, attending, otherguests } = req.body;
  const [firstName, lastName] = name.split(" ");

  const tempArray = [];
  let guestCount = 0;
  let htmlFragment = 
  "<html><head><style>h2{padding:30px;text-align:center;font-size:20px;text-transform:uppercase}\
  body{text-align:left;text-transform:capitalize;font-size:16px}</style>\
  </head><body><h2>List of attendees</h2><ol>";

  try {
    const fileData = fs.readFileSync("invitationList.txt", "utf-8");
    if (fileData) {
      const guestList = JSON.parse(fileData);
      tempArray.push(...guestList);
    }
  } catch (err) {
    console.error("No existing file or invalid JSON.");
  }

  tempArray.push(req.body);

  //tally total number of guests
  tempArray.forEach((guest) => {
    if (guest.attending) {
      let totalAttendees = Number(guest.otherguests) + 1;
      guestCount += totalAttendees;
      htmlFragment += `<li>${guest.name}</li>`;
    }   
  });

  htmlFragment += `</ol><p>Total number of guests confirmed as attending so far: ${guestCount}</p></body></html>`;

  //update guest list 
  fs.writeFile(
    "invitationList.txt",
    JSON.stringify(tempArray, null, 4),
    (err) => {
      if (err) console.error(err);
    }
  );

  if (attending) {
    res.send(
      `That's awesome ${firstName}, we look forward to seeing you on 1st November!`
    );

//send confirmation email to guest attending
    const htmlData = fs.readFileSync(pathAttending, "utf-8");
    guestMailOptions.html = htmlData;
    guestMailOptions.to = email.trim();
    transporter.sendMail(guestMailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(info.response);
      }
    });
  } else {
//send confirmation email to guest that declined
    res.send(`Awww that's a pity ${firstName}, we're sorry you can't make it.`);
    const htmlData = fs.readFileSync(pathNotAttending, "utf-8");
    guestMailOptions.html = htmlData;
    guestMailOptions.to = email.trim();
    transporter.sendMail(guestMailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(info.response);
      }
    });
  }

  //send email to event organiser with guest list attachment
  mailOptions.html = htmlFragment;
  (mailOptions.text = `Updated list of attendees on 1st November. Current total guest count ${guestCount} `),
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(
          "Error:",
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
