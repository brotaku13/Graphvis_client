import React, { useState, useEffect, useCallback } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";
import { Typography } from "@material-ui/core";

import Loader from "./Loader";

const GraphFiles = () => {
  return {
    edgeList: null,
    coordinates: null,
    nodeNames: null,
    nodeIds: null,
    orbits: null
  };
};
const MetaData = () => {
  return {
    graphName: null,
    author: null
  };
};

const steps = [
  { id: 0, title: "Metadata" },
  { id: 1, title: "Control Files" },
  { id: 2, title: "OCD Files" },
  { id: 3, title: "Submit" }
];

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%"
  },
  stepper: {
    width: "80%",
    paddingTop: "0.5em"
  },
  fileupload: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  loaderContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  submitContainer: {
    margin: "0.5em",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  loader: {
    margin: "0.5em"
  },
  loadIcon: {
    fontSize: 65,
    margin: "0.25em"
  },
  uploadResponse: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "0.5em"
  },
  responseDetails: {
    marginBottom: "0.5em"
  }
};

//props is just the cancel function to go back to the main screen

const UploadContainer = props => {
  const [activeStep, setActiveStep] = useState(3);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [ocdData, setOcdData] = useState(GraphFiles());
  const [conData, setConData] = useState(GraphFiles());
  const [metadata, setMetadata] = useState(MetaData());
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [graphId, setGraphId] = useState("k48vc93jk390s83kj30s");
  const [uploadErrors, setUploadErrors] = useState(
    "The following error occured and you reeeally need to fix it or something bad is going to happen"
  );

  const metadataChange = name => e => {
    setMetadata({ ...metadata, [name]: e.target.value });
  };

  const handleMetadataSubmit = e => {
    e.preventDefault();
    if (metadata.graphName !== null && metadata.author !== null) {
      completedStep();
      setActiveStep(activeStep + 1);
    }
  };

  const completedStep = useCallback(
    stepId => {
      if (!completedSteps.includes(stepId)) {
        setCompletedSteps([...completedSteps, stepId]);
      }
    },
    [completedSteps]
  );

  useEffect(() => {
    if (metadata.graphName !== null && metadata.author !== null) {
      completedStep(steps[0].id);
    }
  }, [metadata, completedStep]);

  useEffect(() => {
    if (Object.values(conData).every(o => o !== null)) {
      completedStep(steps[1].id);
    }
  }, [conData, completedStep]);

  useEffect(() => {
    if (Object.values(ocdData).every(o => o !== null)) {
      completedStep(steps[2].id);
    }
  }, [ocdData, completedStep]);

  const copyFile = file => {
    let newFile = new File([file], file.name, { type: file.type });
    return newFile;
  };

  const onMatch = filename => {
    //only using for OCD matching Control
    setOcdData({
      ...ocdData,
      [filename]: copyFile(conData[filename])
    });
  };

  const submit = () => {
    setActiveStep(activeStep + 1);
    setLoading(true);
    
  };

  const viewGraph = () => {};

  return (
    <div style={styles.root}>
      <Stepper activeStep={activeStep} style={styles.stepper}>
        {steps.map(step => {
          const stepProps = {
            completed: completedSteps.includes(step.id)
          };
          return (
            <Step key={step.id} {...stepProps}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div style={styles.fileupload}>
        <div style={{ display: activeStep === steps[0].id ? "" : "none" }}>
          <div>
            <form onSubmit={handleMetadataSubmit}>
              <TextField
                id="graphName"
                name="graphName"
                label="Graph Name"
                palceholder="Enter here"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={metadataChange("graphName")}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="authorName"
                name="author"
                label="Author"
                palceholder="Enter here"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={metadataChange("author")}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <button style={{ display: "none" }} type="submit" />
            </form>
          </div>
          <div style={styles.buttons}>
            <Button color="primary" onClick={props.cancel}>
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={!completedSteps.includes(activeStep)}
              onClick={() => setActiveStep(steps[1].id)}
            >
              Next
            </Button>
          </div>
        </div>

        <div
          style={{
            ...styles.loaderContainer,
            display: activeStep === steps[1].id ? "flex" : "none"
          }}
        >
          <Loader
            name="edgeList"
            label="Edge List"
            graphData={conData}
            onLoad={setConData}
          />
          <Loader
            name="orbits"
            label="Orbits"
            graphData={conData}
            onLoad={setConData}
          />
          <Loader
            name="coordinates"
            label="Coordinates"
            graphData={conData}
            onLoad={setConData}
          />
          <Loader
            name="nodeNames"
            label="Node Names"
            graphData={conData}
            onLoad={setConData}
          />
          <Loader
            name="nodeIds"
            label="Node Ids"
            graphData={conData}
            onLoad={setConData}
          />
          <div style={styles.buttons}>
            <Button color="primary" onClick={props.cancel}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => setActiveStep(activeStep - 1)}
            >
              Back
            </Button>
            <Button
              color="primary"
              disabled={!completedSteps.includes(activeStep)}
              onClick={() => setActiveStep(activeStep + 1)}
            >
              Next
            </Button>
          </div>
        </div>
        <div
          style={{
            ...styles.loaderContainer,
            display: activeStep === steps[2].id ? "flex" : "none"
          }}
        >
          <Loader
            name="edgeList"
            label="Edge List"
            graphData={ocdData}
            onLoad={setOcdData}
          />
          <Loader
            name="orbits"
            label="Orbits"
            graphData={ocdData}
            onLoad={setOcdData}
          />
          <Loader
            name="coordinates"
            label="Coordinates"
            graphData={ocdData}
            onLoad={setOcdData}
            allowMatch
            onMatch={onMatch}
          />
          <Loader
            name="nodeNames"
            label="Node Names"
            graphData={ocdData}
            onLoad={setOcdData}
            allowMatch
            onMatch={onMatch}
          />
          <Loader
            name="nodeIds"
            label="Node Ids"
            graphData={ocdData}
            onLoad={setOcdData}
            allowMatch
            onMatch={onMatch}
          />
          <div style={styles.buttons}>
            <Button color="primary" onClick={props.cancel}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => setActiveStep(activeStep - 1)}
            >
              Back
            </Button>
            <Button
              color="primary"
              disabled={!completedSteps.includes(activeStep)}
              onClick={() => submit()}
            >
              Create Graph
            </Button>
          </div>
        </div>
        <div style={{ display: activeStep === steps[3].id ? "" : "none" }}>
          <div style={styles.submit}>
            {loading ? (
              <div style={styles.submitContainer}>
                <div style={styles.loader}>
                  <CircularProgress
                    variant="indeterminate"
                    size={44}
                    thickness={2}
                    color="primary"
                  />
                </div>
                <Typography variant="h6">Creating Graph</Typography>
              </div>
            ) : (
              <div>
                {uploadSuccess ? (
                  <div>
                    <div style={styles.uploadResponse}>
                      <CheckCircleOutlinedIcon
                        style={styles.loadIcon}
                        color="primary"
                      />
                      <Typography variant="subtitle2" gutterBottom>
                        Your graph ID is
                      </Typography>
                      <Typography variant="h5">{graphId}</Typography>
                    </div>

                    <div style={styles.buttons}>
                      <Button color="primary" onClick={() => viewGraph()}>
                        View Graph
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={styles.uploadResponse}>
                      <HighlightOffOutlinedIcon
                        style={styles.loadIcon}
                        color="error"
                      />
                      <Typography variant="subtitle2">
                        {uploadErrors}
                      </Typography>
                    </div>
                    <div style={styles.buttons}>
                      <Button color="primary" onClick={props.cancel}>
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => setActiveStep(activeStep - 1)}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadContainer;
