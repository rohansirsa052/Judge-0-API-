import axios from "axios";
import "./App.css";
import stubs from "./stubs";
import React, { useState, useEffect } from "react";
import moment from "moment";

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [name, setProjectName] = useState("");

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  let pollInterval;

  const handleSubmit = async () => {
    setProjectName(window.prompt("Enter the project name:")); // Prompt for project name

    const payload = {
      language,
      code,
      name,
    };

    try {
      setOutput("");
      setStatus(null);
      setJobId(null);
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:8080/run", payload);
      if (data.jobId) {
        setJobId(data.jobId);
        setStatus("Submitted.");

        // poll here
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:8080/status`,
            {
              params: {
                id: data.jobId,
              },
            }
          );
          const { success, job, error } = statusRes;
          console.log(statusRes);
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);
            if (jobStatus === "pending") return;
            setOutput(jobOutput);
            clearInterval(pollInterval);
          } else {
            console.error(error);
            setOutput(error);
            setStatus("Bad request");
            clearInterval(pollInterval);
          }
        }, 1000);
      } else {
        setOutput("Retry again.");
      }
    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Please retry submitting.");
      }
    }
  };
  
  const OpenPrivious = () => {
    const projectName = window.prompt("Enter the project name:");
    if (projectName) {
      getProjectByName(projectName);
    } else {
      console.log("Project name is empty!");
    }
  };
  
  const deletePrivious=()=>{
    const projectName = window.prompt("Enter the project name you want to delete:");
    if (projectName) {
      deleteProjectByName(projectName);
    } else {
      console.log("Project name is empty!");
    }
  };
  
  
  const getProjectByName = async (projectName) => {
    try {
      const response = await axios.get(`http://localhost:8080/run/name/${projectName}`);
      const project = response.data;
      // Process the project data as needed
      console.log(project);
     setCode(project);
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteProjectByName = async (projectName) => {
    try {
      const response = await axios.delete(`http://localhost:8080/run/name/${projectName}`);
      const project = response.data;
      // Process the project data as needed
      console.log(project);
      setOutput(`${projectName} Deleted succesfully`);
    } catch (error) {
      console.error(error);
    }
  };
  

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = "";
    submittedAt = moment(submittedAt).toString();
    result += `Job Submitted At: ${submittedAt}  `;
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true);
    result += `Execution Time: ${diff}s`;
    return result;
  };

  return (
    <div className="App">
      <h1>Judge 0 API</h1>
      <div>
        <label>Language:</label>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <br />
      <br />
      <textarea
        name="textarea"
        id="myWords"
        cols="50"
        rows="15"
        placeholder="Type Something!"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></textarea>
      <button id="btn" className="btn" onClick={handleSubmit}>
        Run
      </button>
      <button id="btn" className="btn2" onClick={OpenPrivious}>
      Open
    </button>

    <button id="btn" className="btn3" onClick={deletePrivious}>
    Delete Project
  </button>

      <div id="myWords2">
        <h2 className="output">Output</h2>
        <div className="response">{status}</div>
        <div className="response">{jobId ? `Job ID: ${jobId}` : ""}</div>
        <div className="response">{renderTimeDetails()}</div>
        <div className="response">{output}</div>
      </div>
    </div>
  );
}

export default App;
