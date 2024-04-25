import { useEffect, useState } from "react";
import SwitchComponent from "./SwitchComponent";
import Login from "./Login";
import PortConfig from "./PortConfig";
import "./App.css";
import { SwitchData, Port, SwitchInfo } from "./types";
import axios from "axios";
import NewSwitchForm from "./NewSwitchForm";
import Spinner from "./Spinner";
import NetworkVisualization from "./NetworkVisualization";

axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_ADDRESS}:${
  import.meta.env.VITE_BACKEND_PORT
}`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPort, setCurrentPort] = useState<Port | null>(null);
  const [currentSwitchId, setCurrentSwitchId] = useState<string | null>(null);
  const [switches, setSwitches] = useState<SwitchData[]>([]);
  const [password, setPassword] = useState("");
  const [showNewSwitchForm, setShowNewSwitchForm] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showVis, setShowVis] = useState(false);

  //fetch switch data from backend
  const fetchSwitchData = () => {
    const config = {
      headers: {
        webcncpassword: password,
      },
    };
    setShowSpinner(true);
    axios
      .get("/webcnc/api/getswitches", config)
      .then((response) => {
        console.log("Switch data received:", response.data);
        setSwitches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching switch data:", error);
        if (error.response && error.response.data) {
          alert(error.response.data);
        } else {
          alert("Failed to fetch switch data");
        }
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  //verify password with backend, update authentication and password state
  const handleLogin = (enteredPassword: string) => {
    setShowSpinner(true);
    axios
      .post("/webcnc/api/validatepassword", enteredPassword)
      .then((response) => {
        setPassword(enteredPassword);
        setIsAuthenticated(true);
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert("Incorrect password");
        } else {
          console.error("An error occurred", error);
        }
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  //fetch switch data after login has updated state
  useEffect(() => {
    if (isAuthenticated && password) {
      fetchSwitchData();
    }
  }, [isAuthenticated, password]);

  const openPortConfig = (port: Port, switchId: string) => {
    setCurrentPort(port);
    setCurrentSwitchId(switchId);
  };

  const closePortConfig = () => {
    setCurrentPort(null);
    setCurrentSwitchId(null);
  };

  //save new port config to backend and update frontend state
  const savePortConfig = (updatedPort: Port) => {
    if (currentSwitchId) {
      //prepare header with password for authentication
      const config = {
        headers: {
          webcncpassword: password,
        },
      };
      setShowSpinner(true);
      axios
        .post(`/webcnc/api/saveport`, updatedPort, config)
        .then(() => {
          // Backend processing successful
          const updatedSwitches = switches.map((switchData) =>
            switchData.switchIdentifier === currentSwitchId
              ? {
                  ...switchData,
                  tsnPorts: switchData.tsnPorts.map((p) =>
                    p.portNumber === updatedPort.portNumber ? updatedPort : p
                  ),
                }
              : switchData
          );
          setSwitches(updatedSwitches);
          closePortConfig();
          alert("Port configuration saved successfully.");
        })
        .catch((error) => {
          // Backend processing failed
          if (error.response && error.response.data) {
            if (typeof error.response.data === "string") {
              alert(error.response.data);
            } else {
              alert(
                "Failed to save port configuration due to an unknown error."
              );
            }
          } else {
            alert("Failed to save port configuration.");
          }
        })
        .finally(() => {
          setShowSpinner(false);
        });
    }
  };
  //remove switch from backen, update frontend state
  const handleRemoveSwitch = (removeSwitch: SwitchData) => {
    const config = {
      headers: {
        webcncpassword: password,
        removeswitch: removeSwitch.switchIdentifier,
      },
    };
    setShowSpinner(true);
    axios
      .delete(`/webcnc/api/removeswitch`, config)
      .then(() => {
        setSwitches((currentSwitches) =>
          currentSwitches.filter(
            (switchItem) =>
              switchItem.switchIdentifier !== removeSwitch.switchIdentifier
          )
        );
        alert("Switch deleted successfully.");
      })
      .catch((error) => {
        console.error("Error during delete request:", error);
        alert("Failed to delete switch: " + error.message);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const openNewSwitchForm = () => {
    setShowNewSwitchForm(true);
  };

  const closeNewSwitchForm = () => {
    setShowNewSwitchForm(false);
  };

  const saveNewSwitchForm = (newSwitchInfo: SwitchInfo) => {
    const config = {
      headers: {
        webcncpassword: password,
      },
    };
    setShowSpinner(true);
    axios
      .put(`/webcnc/api/addswitch`, newSwitchInfo, config)
      .then((response) => {
        setSwitches((currentSwitches) => [...currentSwitches, response.data]);
        alert("Switch added successfully.");
        closeNewSwitchForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          if (typeof error.response.data === "string") {
            alert(error.response.data);
          } else {
            alert("Failed to add new switch");
          }
        } else {
          alert("Failed to add new switch");
        }
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const reloadBackend = () => {
    const config = {
      headers: {
        webcncpassword: password,
      },
    };
    setShowSpinner(true);
    axios
      .post(`/webcnc/api/reloadbackend`, {}, config)
      .then(() => {
        alert("Backend reloaded successfully.");
        fetchSwitchData();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          if (typeof error.response.data === "string") {
            alert(error.response.data);
          } else {
            alert("Failed to reload backend");
          }
        } else {
          alert("Failed to reload backend");
        }
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const openVis = () => {
    setShowVis(true);
  };

  const closeVis = () => {
    setShowVis(false);
  };

  return (
    <div className={!isAuthenticated ? "App" : "AppLoggedIn"}>
      {showSpinner && <Spinner />}
      {!isAuthenticated ? (
        <div className="login-container">
          <Login onLogin={handleLogin} />
        </div>
      ) : currentPort && currentSwitchId ? (
        <PortConfig
          port={currentPort}
          onClose={closePortConfig}
          onSave={savePortConfig}
        />
      ) : showNewSwitchForm ? (
        <div className="switch-info-container-app">
          <NewSwitchForm
            onClose={closeNewSwitchForm}
            onSave={saveNewSwitchForm}
            switches={switches}
          />
        </div>
      ) : showVis ? (
        <div>
          <div className="grid-container-vis">
            <div className="grid-item-vis">
              <button className="app-nav-button" onClick={closeVis}>
                Back to Switches
              </button>
            </div>
            <div className="grid-item-vis">
              <p>
                Unidentified devices that don´t advertise their system name via
                LLDP may appear once per connected switch
              </p>
            </div>
            <div className="grid-item-vis"></div>
          </div>
          <NetworkVisualization switches={switches} />
        </div>
      ) : (
        <div>
          <div>
            <button className="app-nav-button" onClick={openVis}>
              Network Visualization
            </button>
            <button className="app-nav-button" onClick={openNewSwitchForm}>
              Add New Switch
            </button>
            <button className="app-nav-button" onClick={reloadBackend}>
              Reload backend
            </button>
          </div>
          <div className="grid-container">
            {switches.map((switchData) => (
              <div
                className={
                  switchData.reachable ? "grid-item" : "grid-item-unreachable"
                }
                key={switchData.switchIdentifier}
              >
                <SwitchComponent
                  switchData={switchData}
                  onOpenPortConfig={openPortConfig}
                  onRemoveSwitch={handleRemoveSwitch}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
