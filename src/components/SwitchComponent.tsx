import React from "react";
import { SwitchData, Port } from "./types";
import "./SwitchComponent.css";

interface SwitchComponentProps {
  switchData: SwitchData;
  onOpenPortConfig: (port: Port, switchId: string) => void;
  onRemoveSwitch: (removeSwitch: SwitchData) => void;
}

const SwitchComponent: React.FC<SwitchComponentProps> = ({
  switchData,
  onOpenPortConfig,
  onRemoveSwitch,
}) => {
  const handleRemoveSwitch = (remSwitch: SwitchData) => {
    if (
      window.confirm(
        "Are you sure you want to delete switch " +
          remSwitch.switchIdentifier +
          " ?"
      )
    ) {
      onRemoveSwitch(remSwitch);
    }
  };

  return (
    <div>
      <h3>Switch Identifier: {switchData.switchIdentifier}</h3>
      {switchData.reachable ? (
        <div>
          <p>Sysname: {switchData.sysname}</p>
          <p>IP Address: {switchData.address}</p>
          <p style={{ marginBottom: 0 }}>Connected Devices:</p>
          {switchData.neighborSysNames.map((remsysname, index) => {
            const localportnum = switchData.neighborLocalPorts[index];
            const remportid = switchData.neighborPortIds[index];
            const connectedDeviceInfo = `Port ${localportnum}: ${remsysname}, ${remportid}`;
            return (
              <div style={{ marginTop: 0 }} key={index}>
                {connectedDeviceInfo}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <p>IP Address: {switchData.address}</p>
          <p>Switch is unreachable</p>
        </div>
      )}
      {/* Port configuration buttons */}
      {switchData.tsnPorts.map((port) => (
        <button
          className="switch-component-button"
          key={port.portNumber}
          onClick={() => onOpenPortConfig(port, switchData.switchIdentifier)}
        >
          Configure Port {port.portNumber}
        </button>
      ))}
      <div>
        <button
          className="deleteButton"
          key={switchData.switchIdentifier}
          onClick={() => handleRemoveSwitch(switchData)}
        >
          Delete Switch
        </button>
      </div>
    </div>
  );
};

export default SwitchComponent;
