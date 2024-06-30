import express from 'express';
import { Request, Response } from 'express';

const app = express();

app.get('/api/hello', (req: Request, res: Response) => {
    const visitorName = req.query.visitor_name;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Mock data for the location and temperature (replace with actual API calls in a real application)
    const location = 'New York';
    const temperature = 11;

    const response = {
        client_ip: clientIp,
        location: location,
        greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    };

    res.json(response);
});

const PORT =  3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
