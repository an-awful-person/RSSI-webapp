export type NetworkPing = {
    ssid: string,
    bssid:string,
    rssi:number
}

export type NetworkModule = {
    macAddress:string,
    scannedNetworks:ScannedNetwork[];
}

export type ScannedNetwork = {
    scanningModuleSSID:string,
    scannedModuleName:string,
    scannedModuleSSID:string,
    rssi:number,
    dateTime:Date
}

export type NetworkRelationship = {
    scanningSSID:string,
    scannedSSID:string,
    rssi:number
}

export type NetworkScan = {
    macAddress:string,
    networkPings:NetworkPing[],
    dateTime:Date
}

export type NetworkHistory = {
    macAddress:string,
    latestRSSI:ScannedNetwork[][];
    averageRSSI:ScannedNetwork[][];
}