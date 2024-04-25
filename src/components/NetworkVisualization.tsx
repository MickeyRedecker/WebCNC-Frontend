import React from "react";
import { ForceGraph2D } from "react-force-graph";
import { SwitchData, GraphNode, GraphLink } from "./types";

type NetworkGraphProps = {
  switches: SwitchData[];
};
const NetworkGraph: React.FC<NetworkGraphProps> = ({ switches }) => {
  const calculateGraphData = (
    switches: SwitchData[]
  ): { nodes: GraphNode[]; links: GraphLink[] } => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const allSysnames = new Set(switches.map((s) => s.sysname));

    //process data for each switch
    switches.forEach((switchData) => {
      if (switchData.reachable === true) {
        //ignore unreachable switches
        //add switch to nodes
        nodes.push({
          id: switchData.sysname,
          name: switchData.switchIdentifier,
          group: "switch",
        });

        let unnamedCount = 0; //used to generate unique ids for unnamed neighbors
        //process each LLDP neighbor
        switchData.neighborSysNames.forEach((neighbor) => {
          //case: unidentified neighbor without known system name
          if (neighbor === "") {
            //generate unique id for unnamed neighbor
            const uniqueUnnamedId = `unidentified-${unnamedCount + 1}-${
              switchData.switchIdentifier
            }`;
            unnamedCount++;
            nodes.push({
              id: uniqueUnnamedId,
              name: uniqueUnnamedId,
              group: "unnamed",
            });
            //add link between switch and unnamed neighbor
            links.push({ source: switchData.sysname, target: uniqueUnnamedId });
          }
          //case: identified new neighbor, add to nodes
          else if (!allSysnames.has(neighbor)) {
            allSysnames.add(neighbor);
            nodes.push({ id: neighbor, name: neighbor, group: "device" });
          }
          //add link between switch and identified neighbor
          if (neighbor !== "") {
            links.push({ source: switchData.sysname, target: neighbor });
          }
        });
      }
    });

    return { nodes, links };
  };

  const groupColors: any = {
    switch: "lightgoldenrodyellow",
    device: "lightgreen",
    unnamed: "yellow",
  };

  //node rendering
  const nodeCanvasObject = (node: any, context: any, globalScale: any) => {
    const label = node.name;
    const fontSize = 20 / globalScale; //adjust font to zoom level
    context.font = `${fontSize}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.beginPath();
    context.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
    context.fillStyle = groupColors[node.group];
    context.fill();
    context.fillText(label, node.x, node.y - 10);
  };

  return (
    <div style={{ position: "relative" }}>
      <ForceGraph2D
        graphData={calculateGraphData(switches)}
        nodeCanvasObject={nodeCanvasObject}
        nodeAutoColorBy="group"
        linkWidth={4}
        linkColor={() => "rgba(0, 0, 0, 0.5)"}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div>
          <span
            className="device-legend"
            style={{
              height: "10px",
              width: "10px",
              display: "inline-block",
              marginRight: "5px",
              backgroundColor: "lightgoldenrodyellow",
            }}
          />
          Switch
        </div>
        <div>
          <span
            style={{
              height: "10px",
              width: "10px",
              display: "inline-block",
              marginRight: "5px",
              backgroundColor: "lightseagreen",
            }}
          />
          Other Device
        </div>
        <div>
          <span
            style={{
              height: "10px",
              width: "10px",
              display: "inline-block",
              marginRight: "5px",
              backgroundColor: "yellow",
            }}
          />
          Unidentified Device
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
