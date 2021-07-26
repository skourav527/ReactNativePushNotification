export default class DemoNotificationService {
    constructor(
        readonly apiUrl: string,
        readonly apiKey: string) {

    }

    async registerAsync(request: any): Promise<Response> {
        const method = 'PUT';
        const registerApiUrl = `${this.apiUrl}/installations`;
        console.log(`registerAsync  ${JSON.stringify(request)} registerApiUrl : ${JSON.stringify(registerApiUrl)}`);
        const result = await fetch(registerApiUrl, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        console.log(`registerAsync Response: validateResponse `);
        this.validateResponse(registerApiUrl, method, request, result);
        return result;
    }

    async deregisterAsync(deviceId: string): Promise<Response> {
        const method = 'DELETE';
        const deregisterApiUrl = `${this.apiUrl}/installations/${deviceId}`;
        const result = await fetch(deregisterApiUrl, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });

        this.validateResponse(deregisterApiUrl, method, null, result);
        return result;
    }

    private validateResponse(requestUrl: string, method: string, requestPayload: any, response: Response) {
        console.log(`Request: ${method} ${requestUrl} => ${JSON.stringify(requestPayload)}\nResponse: ${response.status}`);
        if (!response || response.status != 200) {
            throw `HTTP error ${response.status}: ${response.statusText}`;
        }
    }
}