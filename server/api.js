import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import nodemon from "nodemon";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
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
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
