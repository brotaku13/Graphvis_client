import React, { useState, useEffect } from "react";

import Graph from "./graph";
import { getGraph } from "../../utils/GraphvisAPI";

const styles = {
  root: {
    display: "flex",
    flexDirection: "row"
  }
};
const buildGraphComponents = nodes => {
  let nodesList = []
  let edgeList = []

  
}

const GraphContainer = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [ocdNodes, setOcdNodes] = useState([]);
  const [ocdEdges, setOcdEdges] = useState([]);
  const [conNodes, setConNodes] = useState([]);
  const [conEdges, setConEdges] = useState([]);

  useEffect(() => {
    getGraph(props.graphId).then(res => {
      if (res.status !== 200) {
        //set errors
      }
      setGraphData(res.data);
      console.log(res.data);
      let ocd = buildGraphComponents(res.data.ocd.nodes);
      let con = buildGraphComponents(res.data.con.nodes);
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div style={styles.root}>
        <Graph name="ocd" nodes={ocdNodes} edges={ocdEdges} />
        <Graph name="ocd" nodes={ocdNodes} edges={ocdEdges} />
      </div>
    );
  }
};

export default GraphContainer;
