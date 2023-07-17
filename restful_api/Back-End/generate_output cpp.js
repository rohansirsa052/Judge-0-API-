const { execFile, execFileSync } = require("child_process");
const path = require("path");
const fs =require("fs");

function executeExecutable(executablePath) {
  return new Promise((resolve, reject) => {
    execFile(executablePath, (err, stdout, stderr) => {
      if (err) {
        console.log("Execution error:", err);
        reject(err);
      } else if (stderr) {
        console.log("Execution error:", stderr);
        reject(stderr);
      } else {
        console.log("Output:", stdout);
        resolve(stdout);
      }
    });
  });
}

async function getOutput(file_path) {

    const outputFilePath= path.join(__dirname , "./outputs")

if(!fs.existsSync(outputFilePath)){
    fs.mkdir( outputFilePath, (err)=>{
       if(err) 
       console.log(err);      
       else
       console.log("folder Created");z

})
}
//['b05acbe9-0024-4a29-84e4-79fd3dcd3e6d.cpp, cpp']=>path.baseName(file_path)

  const jobId = path.basename(file_path).split(".")[0];
  //console.log(jobId);
  const executablePath = path.join(outputFilePath, `${jobId}.out`);
  

  try {
    const compilationResult = await new Promise((resolve, reject) => {
      execFile("g++", [file_path, "-o", executablePath], (err, stdout, stderr) => {
        if (err) {
          console.log("Compilation error:", err);
          reject(err);
        } else if (stderr) {
          console.log("Syntax error:", stderr);
          reject(stderr);
        } else {
          console.log("Compilation successful");
          resolve();
        }
      });
    });

    const output = await executeExecutable(executablePath);
    return output;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = getOutput;
