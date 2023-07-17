const express = require("express");
const app = express();
const cors = require("cors");
const generateFilePath = require("./generateFilePath");
const getOutputCpp = require("./generate_output cpp");
const getOutputPy = require("./generate_output py");
const {addJobToQueue} = require("./handleload");
const fs= require("fs");
//const getOutputJava = require("./generate_output java");
const mongoose = require("mongoose");
const Job = require("./databaseConnectivity/job");


mongoose
  .connect("mongodb://127.0.0.1:27017/compilerdb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/status", async (req, res) => {
  const jobId = req.query.id;

  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }

  const job = await Job.findById(jobId);

  if (job === undefined) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }

  return res.status(200).json({ success: true, job });
});


app.post("/run", async (req, res) => {
  const { language = "cpp", code, name:name } = req.body;
console.log(name);
  console.log(language, "Length:", code.length);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  // need to generate a c++ file with content from the request
  const filepath = await generateFilePath(language, code);
  // write into DB
  const job = await new Job({ language, filepath, name}).save();
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ jobId });
});
app.get("/run", async (req, res) => {
  try {
    const result = await Job.find(); //   .sort({ Ranking: 1 });  is used to sort data on the basis of ranking
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});
app.get("/run/name/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const result = await Job.findOne({ name: name });
    
    if (!result) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const filePath = result.filepath;
    const data = fs.readFileSync(filePath, "utf-8");
    console.log(data);

    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/run/name/:name", async (req, res) => {
  try {
   
    const name = req.params.name;
    const result = await Job.findOneAndDelete({ name: name });
    console.log(result);
    res.send("Deleted successfully");
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running at ${port}`));
