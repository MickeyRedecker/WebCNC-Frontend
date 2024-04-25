export type GCLEntry = {
    entryIdentifier: number;
    gateStates: boolean[];
    timeInNs: number;
};
  
export type Port = {
    switchIdentifier: string;
    portNumber: number;
    cycleTime: number;
    cycleTimeExtension: number;
    startYear: number;
    startMonth: number;
    startDay: number;
    startHour: number;
    startMinute: number;
    startSecond: number;
    startNanosecond: number;
    gateControlList: GCLEntry[];
    gateEnabled: boolean;
};
  
export type SwitchData = {
    switchIdentifier: string;
    sysname: string;
    neighborSysNames: string[];
    neighborPortIds: string[];
    neighborLocalPorts: number[];
    tsnPorts: Port[];
    address: string;
    reachable: boolean;
};

export type SwitchInfo = {
    switchIdentifier: string; 
    address: string; 
    port: number;
    authUserName: string;
    authAlgorithm: string;
    authPassword: string; 
    encryptAlgorithm: string; 
    encryptPassword: string; 
    tsnPortsString: string;
};

export type GraphNode = {
    id: string;
    name: string;
    group: string;  
};
  
export type GraphLink = {
    source: string;
    target: string;
};