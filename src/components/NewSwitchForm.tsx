import React, { useState } from "react";
import { SwitchInfo, SwitchData } from "./types";
import "./NewSwitchForm.css";

interface Props {
  onSave: (newSwitchInfo: SwitchInfo) => void;
  onClose: () => void;
  switches: SwitchData[];
}

const NewSwitchForm: React.FC<Props> = ({ onSave, onClose, switches }) => {
  const [switchInfo, setSwitchInfo] = useState<SwitchInfo>({
    switchIdentifier: "UniqueIdentifier",
    address: "192.0.0.1",
    port: 161,
    authUserName: "SNMPUserName",
    authAlgorithm: "MD5",
    authPassword: "SNMPAuthPassword",
    encryptAlgorithm: "DES",
    encryptPassword: "SNMPEncryptionPassword",
    tsnPortsString: "1,2,3",
  });
  const [inputErrors, setInputErrors] = useState({
    switchIdentifierError: "",
    addressError: "",
    portError: "",
    authUserNameError: "",
    authAlgorithmError: "",
    authPasswordError: "",
    encryptAlgorithmError: "",
    encryptPasswordError: "",
    tsnPortsListError: "",
  });

  const validateInputs = () => {
    let inputsValid = true;
    let newInputErrors = { ...inputErrors };

    //validate switchIdentifier
    let switchIdentifierConflict = false;
    switches.forEach((switchData) => {
      if (switchData.switchIdentifier === switchInfo.switchIdentifier) {
        newInputErrors.switchIdentifierError =
          "Switch Identifier already exists";
        inputsValid = false;
        switchIdentifierConflict = true;
      } else if (switchInfo.switchIdentifier === "") {
        newInputErrors.switchIdentifierError = "Switch Identifier required";
        inputsValid = false;
        switchIdentifierConflict = true;
      } else if (!/^[a-zA-Z0-9]+$/.test(switchInfo.switchIdentifier)) {
        newInputErrors.switchIdentifierError =
          "Switch identifier can only contain alphanumeric characters";
        inputsValid = false;
        switchIdentifierConflict = true;
      }
    });
    if (!switchIdentifierConflict) {
      newInputErrors.switchIdentifierError = "";
    }

    //validate address
    let addressInvalid = false;
    const parts = switchInfo.address.split(".");
    if (parts.length !== 4) {
      newInputErrors.addressError = "IP address is invalid";
      inputsValid = false;
      addressInvalid = true;
    }
    for (let i = 0; i < parts.length; i++) {
      const part = parseInt(parts[i]);
      if (
        isNaN(part) ||
        part.toString() !== parts[i] ||
        part < 0 ||
        part > 255
      ) {
        newInputErrors.addressError = "IP address is invalid";
        inputsValid = false;
        addressInvalid = true;
      }
    }
    if (!addressInvalid) {
      newInputErrors.addressError = "";
    }

    //validate port
    let number = Number(switchInfo.port);
    if (switchInfo.port < 0 || switchInfo.port > 65535) {
      inputsValid = false;
      newInputErrors.portError = "Port must be bewteen 0 and 65535";
    } else if (isNaN(number)) {
      inputsValid = false;
      newInputErrors.portError = "Port must be a number";
    } else if (!isFinite(number)) {
      inputsValid = false;
      newInputErrors.portError = "Port must be finite";
    } else if (!Number.isSafeInteger(number)) {
      inputsValid = false;
      newInputErrors.portError = "Port must be an integer";
    } else {
      newInputErrors.portError = "";
    }

    //validate authUserName
    if (switchInfo.authUserName === "") {
      inputsValid = false;
      newInputErrors.authUserNameError =
        "SNMP Authentication User Name required";
    } else {
      newInputErrors.authUserNameError = "";
    }

    //validate authAlgorithm
    if (
      switchInfo.authAlgorithm !== "MD5" &&
      switchInfo.authAlgorithm !== "SHA1"
    ) {
      inputsValid = false;
      newInputErrors.authAlgorithmError =
        "SNMP Authentication Algorithm invalid";
    } else {
      newInputErrors.authAlgorithmError = "";
    }

    //validate authPassword
    if (switchInfo.authPassword === "") {
      inputsValid = false;
      newInputErrors.authPasswordError =
        "SNMP Authentication Password required";
    } else {
      newInputErrors.authPasswordError = "";
    }

    //validate encryptAlgorithm
    if (
      switchInfo.encryptAlgorithm !== "DES" &&
      switchInfo.encryptAlgorithm !== "AES128"
    ) {
      inputsValid = false;
      newInputErrors.encryptAlgorithmError =
        "SNMP Encryption Algorithm invalid";
    } else {
      newInputErrors.encryptAlgorithmError = "";
    }

    //validate encryptPassword
    if (switchInfo.encryptPassword === "") {
      inputsValid = false;
      newInputErrors.encryptPasswordError = "SNMP Encryption Password required";
    } else {
      newInputErrors.encryptPasswordError = "";
    }

    //validate tsnPortsString
    let tsnPortsStringInvalid = false;
    const numbers = switchInfo.tsnPortsString.split(",");
    for (const num of numbers) {
      const parsedNum = parseInt(num);
      if (
        isNaN(parsedNum) ||
        (parsedNum.toString() !== num && num !== "0") ||
        parsedNum < 0
      ) {
        if (switchInfo.tsnPortsString !== "") {
          inputsValid = false;
          newInputErrors.tsnPortsListError = "TSN Ports List invalid";
          tsnPortsStringInvalid = true;
        }
      }
    }
    if (!tsnPortsStringInvalid) {
      newInputErrors.tsnPortsListError = "";
    }

    setInputErrors(newInputErrors);
    return inputsValid;
  };

  const handleSave = () => {
    if (validateInputs()) {
      onSave(switchInfo);
    }
  };

  return (
    <div className="switch-info-container">
      <h3>New Switch Information:</h3>
      <div className="input-group">
        <label htmlFor="switchIdentifier">Switch Identifier:</label>
        <input
          id="switchIdentifier"
          type="string"
          value={switchInfo.switchIdentifier}
          onChange={(e) =>
            setSwitchInfo({ ...switchInfo, switchIdentifier: e.target.value })
          }
        />
      </div>
      {inputErrors.switchIdentifierError && (
        <div className="error">{inputErrors.switchIdentifierError}</div>
      )}
      <div className="input-group">
        <label htmlFor="address">IP Address:</label>
        <input
          id="address"
          type="string"
          value={switchInfo.address}
          onChange={(e) =>
            setSwitchInfo({ ...switchInfo, address: e.target.value })
          }
        />
      </div>
      {inputErrors.addressError && (
        <div className="error">{inputErrors.addressError}</div>
      )}
      <div className="input-group">
        <label htmlFor="port">SNMP Port (UDP):</label>
        <input
          id="port"
          type="number"
          value={switchInfo.port}
          onChange={(e) =>
            setSwitchInfo({ ...switchInfo, port: Number(e.target.value) })
          }
        />
      </div>
      {inputErrors.portError && (
        <div className="error">{inputErrors.portError}</div>
      )}
      <div className="input-group">
        <label htmlFor="authUserName">SNMP Authentication User Name:</label>
        <input
          id="authUserName"
          type="string"
          value={switchInfo.authUserName}
          onChange={(e) =>
            setSwitchInfo({ ...switchInfo, authUserName: e.target.value })
          }
        />
      </div>
      {inputErrors.authUserNameError && (
        <div className="error">{inputErrors.authUserNameError}</div>
      )}
      <div className="input-group">
        <label htmlFor="authAlgorithm">SNMP Authentication Algorithm:</label>
        <select
          id="authAlgorithm"
          value={switchInfo.authAlgorithm}
          onChange={(e) =>
            setSwitchInfo({ ...switchInfo, authAlgorithm: e.target.value })
          }
        >
          <option value="MD5">MD5</option>
          <option value="SHA1">SHA1</option>
        </select>
      </div>
      {inputErrors.authAlgorithmError && (
        <div className="error">{inputErrors.authAlgorithmError}</div>
      )}
      <div className="input-group">
        <label htmlFor="authPassword">SNMP Authentication Password:</label>
        <input
          id="authPassword"
          type="string"
          value={switchInfo.authPassword}
          onChange={(e) =>
            setSwitchInfo({ ...switchInfo, authPassword: e.target.value })
          }
        />
      </div>
      {inputErrors.authPasswordError && (
        <div className="error">{inputErrors.authPasswordError}</div>
      )}
      <div className="input-group">
        <label htmlFor="encryptAlgorithm">SNMP Encryption Algorithm:</label>
        <select
          id="encryptAlgorithm"
          value={switchInfo.encryptAlgorithm}
          onChange={(e) =>
            setSwitchInfo({ ...switchInfo, encryptAlgorithm: e.target.value })
          }
        >
          <option value="DES">DES</option>
          <option value="AES128">AES128</option>
        </select>
      </div>
      {inputErrors.encryptAlgorithmError && (
        <div className="error">{inputErrors.encryptAlgorithmError}</div>
      )}
      <div className="input-group">
        <label htmlFor="encryptPassword">SNMP Encryption Password:</label>
        <input
          id="encryptPassword"
          type="string"
          value={switchInfo.encryptPassword}
          onChange={(e) =>
            setSwitchInfo({ ...switchInfo, encryptPassword: e.target.value })
          }
        />
      </div>
      {inputErrors.encryptPasswordError && (
        <div className="error">{inputErrors.encryptPasswordError}</div>
      )}
      <div className="input-group">
        <label htmlFor="tsnPortsString">TSN capable Ports:</label>
        <input
          id="tsnPortsString"
          type="string"
          value={switchInfo.tsnPortsString}
          onChange={(e) =>
            setSwitchInfo({ ...switchInfo, tsnPortsString: e.target.value })
          }
        />
      </div>
      {inputErrors.tsnPortsListError && (
        <div className="error">{inputErrors.tsnPortsListError}</div>
      )}
      <div className="switch-form-button-group">
        <button className="switch-form-button" onClick={handleSave}>
          Save
        </button>
        <button className="switch-form-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default NewSwitchForm;
