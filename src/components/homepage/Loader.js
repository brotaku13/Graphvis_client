import React, { useState, useEffect } from "react";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = {
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-begin",
    width: "80%"
  },
  icon: {
    fontSize: 32
  },
  label: {
    paddingTop: "0.5em"
  },
  labelContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  }
};

const Loader = props => {
  const [loaded, setLoaded] = useState(false);
  const [checked, setChecked] = useState(false);

  const onLoad = e => {
    if (e.target.files.length !== 0) {
      let file = e.target.files[0];
      props.onLoad({
        ...props.graphData,
        [props.name]: file
      });
      setLoaded(true);
    }
  };

  const getIcon = () => {
    if (!loaded) {
      return (
        <AddCircleOutlineOutlinedIcon style={styles.icon} color="primary" />
      );
    } else {
      return (
        <CheckCircleOutlineOutlinedIcon style={styles.icon} color="primary" />
      );
    }
  };

  const handleCheck = e => {
    setChecked(e.target.checked);
    setLoaded(e.target.checked);
    props.onMatch(props.name)
  };

  return (
    <div style={styles.root}>
      <div>
        <Button component="label" color="primary">
          {getIcon()}
          <input type="file" style={{ display: "none" }} onChange={onLoad} />
        </Button>
      </div>
      <div style={styles.labelContainer}>
        <div style={styles.label}>
          <Typography variant="subtitle1">{props.label}</Typography>
        </div>
        <div>
          {props.allowMatch && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleCheck}
                  value="checked"
                  color="primary"
                />
              }
              label="Match Control"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Loader;
