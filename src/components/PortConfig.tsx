import React, { useState } from "react";
import "./PortConfig.css";
import { Port, GCLEntry } from "./types";

type PortConfigProps = {
  port: Port;
  onClose: () => void;
  onSave: (updatedPort: Port) => void;
};

const PortConfig: React.FC<PortConfigProps> = ({ port, onClose, onSave }) => {
  const [currentPort, setCurrentPort] = useState<Port>({ ...port });
  const [inputErrors, setInputErrors] = useState({
    cycleTimeError: "",
    cycleTimeExtensionError: "",
    startYearError: "",
    startMonthError: "",
    startDayError: "",
    startHourError: "",
    startMinuteError: "",
    startSecondError: "",
    startNanosecondError: "",
    gateControlListTimeError: "",
  });

  const handleGateStateChange = (
    entryIndex: number,
    gateIndex: number,
    gateState: boolean
  ) => {
    const updatedGcl = currentPort.gateControlList.map((entry, index) =>
      index === entryIndex
        ? {
            ...entry,
            gateStates: entry.gateStates.map((gs, gi) =>
              gi === gateIndex ? gateState : gs
            ),
          }
        : entry
    );
    setCurrentPort({ ...currentPort, gateControlList: updatedGcl });
  };

  const handleTimeChange = (entryIndex: number, time: number) => {
    const updatedGcl = currentPort.gateControlList.map((entry, index) =>
      index === entryIndex ? { ...entry, timeInNs: time } : entry
    );
    setCurrentPort({ ...currentPort, gateControlList: updatedGcl });
  };

  const handleAddGclEntry = () => {
    const newEntry: GCLEntry = {
      entryIdentifier: Math.floor(Math.random() * 9007199254740991), //random number
      gateStates: Array(8).fill(false),
      timeInNs: 1000,
    };
    setCurrentPort({
      ...currentPort,
      gateControlList: [...currentPort.gateControlList, newEntry],
    });
  };

  const handleRemoveGclEntry = (entryId: number) => {
    const updatedGcl = currentPort.gateControlList.filter(
      (entry) => entry.entryIdentifier !== entryId
    );
    setCurrentPort({ ...currentPort, gateControlList: updatedGcl });
  };

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const validateInputs = () => {
    let inputsValid = true;
    let newInputErrors = { ...inputErrors };

    //check cycle time
    let number = Number(currentPort.cycleTime);
    if (currentPort.cycleTime < 0 || currentPort.cycleTime > 4294967295) {
      inputsValid = false;
      newInputErrors.cycleTimeError =
        "Cycle time must be between 0 and 4294967295";
    } else if (isNaN(number)) {
      inputsValid = false;
      newInputErrors.cycleTimeError = "Cycle time must be an integer";
    } else if (!isFinite(number)) {
      inputsValid = false;
      newInputErrors.cycleTimeError = "Cycle time must be a finite number";
    } else if (!Number.isSafeInteger(number)) {
      inputsValid = false;
      newInputErrors.cycleTimeError = "Cycle time must be an integer";
    } else {
      newInputErrors.cycleTimeError = "";
    }

    //check cycle time extension
    number = Number(currentPort.cycleTimeExtension);
    if (currentPort.cycleTimeExtension < 0) {
      inputsValid = false;
      newInputErrors.cycleTimeExtensionError =
        "Cycle time extension must be a positive number";
    } else if (isNaN(number)) {
      inputsValid = false;
      newInputErrors.cycleTimeExtensionError =
        "Cycle time extension must be an integer";
    } else if (!isFinite(number)) {
      inputsValid = false;
      newInputErrors.cycleTimeExtensionError =
        "Cycle time extension must be a finite number";
    } else if (!Number.isSafeInteger(number)) {
      inputsValid = false;
      newInputErrors.cycleTimeExtensionError =
        "Cycle time extension must be an integer";
    } else {
      newInputErrors.cycleTimeExtensionError = "";
    }

    //check start year
    number = Number(currentPort.startYear);
    if (currentPort.startYear < 1970 || currentPort.startYear > 8921373) {
      inputsValid = false;
      newInputErrors.startYearError =
        "Start Year must be between 1970 and 8921373";
    } else if (isNaN(number)) {
      inputsValid = false;
      newInputErrors.startYearError = "Start Year must be an integer";
    } else if (!isFinite(number)) {
      inputsValid = false;
      newInputErrors.startYearError = "Start Year must be a finite number";
    } else if (!Number.isSafeInteger(number)) {
      inputsValid = false;
      newInputErrors.startYearError = "Start Year must be an integer";
    } else {
      newInputErrors.startYearError = "";
    }

    // Check start month
    number = Number(currentPort.startMonth);
    if (currentPort.startMonth < 1 || currentPort.startMonth > 12) {
      inputsValid = false;
      newInputErrors.startMonthError = "Start Month must be between 1 and 12";
    } else if (isNaN(number)) {
      inputsValid = false;
      newInputErrors.startMonthError = "Start Month must be an integer";
    } else if (!isFinite(number)) {
      inputsValid = false;
      newInputErrors.startMonthError = "Start Month must be a finite number";
    } else if (!Number.isSafeInteger(number)) {
      inputsValid = false;
      newInputErrors.startMonthError = "Start Month must be an integer";
    } else {
      newInputErrors.startMonthError = "";
    }

    // Check start day
    const month = Number(currentPort.startMonth);
    const day = Number(currentPort.startDay);
    const year = Number(currentPort.startYear);
    const maxDays = [
      //max days per month in year
      31,
      isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

    if (isNaN(day)) {
      inputsValid = false;
      newInputErrors.startDayError = "Start day must be an integer";
    } else if (!isFinite(day)) {
      inputsValid = false;
      newInputErrors.startDayError = "Start day must be a finite number";
    } else if (!Number.isSafeInteger(day)) {
      inputsValid = false;
      newInputErrors.startDayError = "Start Month must be an integer";
    } else if (day < 1 || day > maxDays[month - 1]) {
      inputsValid = false;
      newInputErrors.startDayError = `Start Day must be between 1 and ${
        maxDays[month - 1]
      } for the selected month and year`;
    } else {
      newInputErrors.startDayError = "";
    }

    // Check start hour
    number = Number(currentPort.startHour);
    if (currentPort.startHour < 0 || currentPort.startHour > 23) {
      inputsValid = false;
      newInputErrors.startHourError = "Start Hour must be between 0 and 23";
    } else if (isNaN(number)) {
      inputsValid = false;
      newInputErrors.startHourError = "Start Hour must be an integer";
    } else if (!isFinite(number)) {
      inputsValid = false;
      newInputErrors.startHourError = "Start Hour must be a finite number";
    } else if (!Number.isSafeInteger(number)) {
      inputsValid = false;
      newInputErrors.startHourError = "Start Hour must be an integer";
    } else {
      newInputErrors.startHourError = "";
    }

    // Check start minute
    number = Number(currentPort.startMinute);
    if (currentPort.startMinute < 0 || currentPort.startMinute > 59) {
      inputsValid = false;
      newInputErrors.startMinuteError = "Start Minute must be between 0 and 59";
    } else if (isNaN(number)) {
      inputsValid = false;
      newInputErrors.startMinuteError = "Start Minute must be an integer";
    } else if (!isFinite(number)) {
      inputsValid = false;
      newInputErrors.startMinuteError = "Start Minute must be a finite number";
    } else if (!Number.isSafeInteger(number)) {
      inputsValid = false;
      newInputErrors.startMinuteError = "Start Minute must be an integer";
    } else {
      newInputErrors.startMinuteError = "";
    }

    // Check start second
    number = Number(currentPort.startSecond);
    if (currentPort.startSecond < 0 || currentPort.startSecond > 59) {
      inputsValid = false;
      newInputErrors.startSecondError = "Start Second must be between 0 and 59";
    } else if (isNaN(number)) {
      inputsValid = false;
      newInputErrors.startSecondError = "Start Second must be an integer";
    } else if (!isFinite(number)) {
      inputsValid = false;
      newInputErrors.startSecondError = "Start Second must be a finite number";
    } else if (!Number.isSafeInteger(number)) {
      inputsValid = false;
      newInputErrors.startSecondError = "Start Second must be an integer";
    } else {
      newInputErrors.startSecondError = "";
    }

    // Check start nanosecond
    number = Number(currentPort.startNanosecond);
    if (
      currentPort.startNanosecond < 0 ||
      currentPort.startNanosecond > 999999999
    ) {
      inputsValid = false;
      newInputErrors.startNanosecondError =
        "Start Nanosecond must be between 0 and 999 999 999";
    } else if (isNaN(number)) {
      inputsValid = false;
      newInputErrors.startNanosecondError =
        "Start Nanosecond must be an integer";
    } else if (!isFinite(number)) {
      inputsValid = false;
      newInputErrors.startNanosecondError =
        "Start Nanosecond must be a finite number";
    } else if (!Number.isSafeInteger(number)) {
      inputsValid = false;
      newInputErrors.startNanosecondError =
        "Start Nanosecond must be an integer";
    } else {
      newInputErrors.startNanosecondError = "";
    }

    // Check GCL entries time
    let gclErrorFound = false;
    currentPort.gateControlList.forEach((entry, index) => {
      number = Number(entry.timeInNs);
      if (entry.timeInNs < 0 || entry.timeInNs > 4294967295) {
        inputsValid = false;
        newInputErrors.gateControlListTimeError = `GCL entry ${
          index + 1
        }´s time must be between 0 and 4294967295`;
        gclErrorFound = true;
      } else if (isNaN(number)) {
        inputsValid = false;
        newInputErrors.gateControlListTimeError = `GCL entry ${
          index + 1
        } time must be an integer`;
        gclErrorFound = true;
      } else if (!isFinite(number)) {
        inputsValid = false;
        newInputErrors.gateControlListTimeError = `GCL entry ${
          index + 1
        } time must be a finite number`;
        gclErrorFound = true;
      } else if (!Number.isSafeInteger(number)) {
        inputsValid = false;
        newInputErrors.gateControlListTimeError = `GCL entry ${
          index + 1
        } time must be an integer`;
        gclErrorFound = true;
      }
    });

    if (!gclErrorFound) {
      newInputErrors.gateControlListTimeError = "";
    }

    console.log(newInputErrors);
    setInputErrors(newInputErrors);
    return inputsValid;
  };

  const handleSave = () => {
    if (validateInputs()) {
      onSave(currentPort);
    }
  };

  return (
    <div className="port-config-container">
      <h3>
        Configuring Port {currentPort.portNumber} of{" "}
        {currentPort.switchIdentifier}:
      </h3>
      <div className="input-group">
        <label htmlFor="gateEnabled">TSN enabled on port:</label>
        <input
          type="checkbox"
          checked={currentPort.gateEnabled}
          onChange={(e) =>
            setCurrentPort({
              ...currentPort,
              gateEnabled: Boolean(e.target.checked),
            })
          }
        />
      </div>
      <div className="input-group">
        <label htmlFor="cycleTime">Cycle Time:</label>
        <input
          id="cycleTime"
          type="number"
          value={currentPort.cycleTime}
          onChange={(e) =>
            setCurrentPort({
              ...currentPort,
              cycleTime: Number(e.target.value),
            })
          }
        />
        {inputErrors.cycleTimeError && (
          <div className="error">{inputErrors.cycleTimeError}</div>
        )}
      </div>
      <div className="input-group">
        <label htmlFor="cycleTimeExtension">Cycle Time Extension:</label>
        <input
          id="cycleTimeExtension"
          type="number"
          value={currentPort.cycleTimeExtension}
          onChange={(e) =>
            setCurrentPort({
              ...currentPort,
              cycleTimeExtension: Number(e.target.value),
            })
          }
        />
        {inputErrors.cycleTimeExtensionError && (
          <div className="error">{inputErrors.cycleTimeExtensionError}</div>
        )}
      </div>
      <div className="input-grid-container">
        <div className="input-group">
          <label htmlFor="startYear">Start Year:</label>
          <input
            id="startYear"
            type="number"
            min="1970"
            max="8000"
            value={currentPort.startYear}
            onChange={(e) =>
              setCurrentPort({
                ...currentPort,
                startYear: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="startMonth">Start Month:</label>
          <input
            id="startMonth"
            type="number"
            min="1"
            max="12"
            value={currentPort.startMonth}
            onChange={(e) =>
              setCurrentPort({
                ...currentPort,
                startMonth: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="startDay">Start Day:</label>
          <input
            id="startDay"
            type="number"
            min="1"
            max="31"
            value={currentPort.startDay}
            onChange={(e) =>
              setCurrentPort({
                ...currentPort,
                startDay: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="startHour">Start Hour:</label>
          <input
            id="startHour"
            type="number"
            min="0"
            max="23"
            value={currentPort.startHour}
            onChange={(e) =>
              setCurrentPort({
                ...currentPort,
                startHour: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="startMinute">Start Minute:</label>
          <input
            id="startMinute"
            type="number"
            min="0"
            max="59"
            value={currentPort.startMinute}
            onChange={(e) =>
              setCurrentPort({
                ...currentPort,
                startMinute: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="startSecond">Start Second:</label>
          <input
            id="startSecond"
            type="number"
            min="0"
            max="59"
            value={currentPort.startSecond}
            onChange={(e) =>
              setCurrentPort({
                ...currentPort,
                startSecond: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="startNanosecond">Start Nanosecond:</label>
          <input
            id="startNanosecond"
            type="number"
            min="0"
            max="999999999"
            value={currentPort.startNanosecond}
            onChange={(e) =>
              setCurrentPort({
                ...currentPort,
                startNanosecond: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
      {inputErrors.startYearError && (
        <div className="error">{inputErrors.startYearError}</div>
      )}
      {inputErrors.startMonthError && (
        <div className="error">{inputErrors.startMonthError}</div>
      )}
      {inputErrors.startDayError && (
        <div className="error">{inputErrors.startDayError}</div>
      )}
      {inputErrors.startHourError && (
        <div className="error">{inputErrors.startHourError}</div>
      )}
      {inputErrors.startMinuteError && (
        <div className="error">{inputErrors.startMinuteError}</div>
      )}
      {inputErrors.startSecondError && (
        <div className="error">{inputErrors.startSecondError}</div>
      )}
      {inputErrors.startNanosecondError && (
        <div className="error">{inputErrors.startNanosecondError}</div>
      )}
      <h4>Gate Control List:</h4>
      {inputErrors.gateControlListTimeError && (
        <div className="error">{inputErrors.gateControlListTimeError}</div>
      )}
      {currentPort.gateControlList.map((entry, index) => (
        <div key={entry.entryIdentifier} className="gcl-entry">
          <p>GCL Entry {index + 1}</p>
          <div className="gate-states">
            {entry.gateStates.map((state, gateIndex) => (
              <label key={gateIndex}>
                Gate {7 - gateIndex}:
                <input
                  type="checkbox"
                  checked={state}
                  onChange={(e) =>
                    handleGateStateChange(index, gateIndex, e.target.checked)
                  }
                />
              </label>
            ))}
          </div>
          <div className="input-group">
            <label>Time in ns:</label>
            <input
              type="number"
              min="0"
              value={entry.timeInNs}
              onChange={(e) => handleTimeChange(index, Number(e.target.value))}
            />
          </div>
          <button onClick={() => handleRemoveGclEntry(entry.entryIdentifier)}>
            Remove Entry
          </button>
        </div>
      ))}
      <button className="port-config-button" onClick={handleAddGclEntry}>
        Add GCL Entry
      </button>
      <button className="port-config-button" onClick={handleSave}>
        Save
      </button>
      <button className="port-config-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default PortConfig;
