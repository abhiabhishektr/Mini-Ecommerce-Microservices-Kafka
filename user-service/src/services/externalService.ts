import axios from "axios";
import { injectable } from "inversify";
import { env } from "../config/env";

@injectable()
export class ExternalService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = env.EXTERNAL_API_URL || "http://default-url.com/api"; 
        if (!env.EXTERNAL_API_URL) {
            console.warn("EXTERNAL_API_URL is not set, using default URL");
        }
    }

    async getData(endpoint: string): Promise<any> {
        try {
            const response = await axios.get(`${this.apiUrl}/${endpoint}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching data from ${endpoint}: ${error.message}`);
        }
    }

    async postData(endpoint: string, data: any): Promise<any> {
        try {
            const response = await axios.post(`${this.apiUrl}/${endpoint}`, data);
            return response.data;
        } catch (error) {
            throw new Error(`Error posting data to ${endpoint}: ${error.message}`);
        }
    }
}
