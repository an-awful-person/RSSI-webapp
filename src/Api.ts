import { BehaviorSubject } from "rxjs";
import { ScannedNetwork } from "./models/network.models";

export enum API_METHOD {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

export const API_URL = "http://192.168.1.13:5000/api/NetworksScan/";

export class Api {

    public loadingCounter:BehaviorSubject<number> = new BehaviorSubject<number>(0);

    public apiCall<T>(
        endpoint:string,
        options?:{
            formData?:any;
            method?:API_METHOD;
            contentType?:string;
        }
    ) : Promise<T> {
        // this.loadingCounter.next(this.loadingCounter.getValue()+1);

        const formDataString = options?.formData ? JSON.stringify(options.formData) : "";

        const requestOptions = {
            method: options?.method ?? API_METHOD.GET,
            // headers: {
            //     'Content-Type': 'application/json',
            //     body: formDataString
            // }
        }

        return new Promise<T>(async (resolve,reject) => {
            try {
                const response = await fetch(endpoint, requestOptions);
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // this.loadingCounter.next(this.loadingCounter.getValue()-1);
                resolve(data);
            } catch (error) {
                // this.loadingCounter.next(this.loadingCounter.getValue()-1);
                reject(error);
            }
        })
    }

    public getAllNetworkScans(){
        this.apiCall(`${API_URL}network_modules`);
    }

    public getModuleSources(): Promise<string[]>{
        return this.apiCall<string[]>(`${API_URL}sources`);
    }

    public getNetworkScansBetween(module:string, start:Date, end:Date){
        return this.apiCall(`${API_URL}between`,{
            formData:{
                module:module,
                start:start.toString(),
                end:end.toString()
            }
        })
    }

    public getLatestScansFrom(scanningSSID:string, secondsAgo?:number){
        const parameters = secondsAgo !== undefined ? {
            scanningSSID:scanningSSID,
            seconds: secondsAgo
        } : {
            scanningSSID:scanningSSID
        }

        return this.apiCall<ScannedNetwork[]>(`${API_URL}latest_scans_from?${new URLSearchParams(Object.entries(parameters) as string[][]).toString()}`, {
            formData: {
                scanningSSID:scanningSSID,
                seconds:secondsAgo
            }
        })
    }

    public getAverageScansFrom(scanningSSID:string, secondsAgo?:number){
        const parameters = secondsAgo !== undefined ? {
            scanningSSID:scanningSSID,
            seconds: secondsAgo
        } : {
            scanningSSID:scanningSSID
        }

        return this.apiCall<ScannedNetwork[]>(`${API_URL}all_average_RSSI_from?${new URLSearchParams(Object.entries(parameters) as string[][]).toString()}`, {
            formData: {
                scanningSSID:scanningSSID,
                seconds:secondsAgo
            }
        })
    }

}