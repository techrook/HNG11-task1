import express from 'express';
import { Request, Response } from 'express';
import requestIp from 'request-ip';

const app = express();

app.use(requestIp.mw());

app.get('/api/hello', (req: Request, res: Response) => {
    const visitorName = req.query.visitor_name as string;
    const clientIp = req.clientIp || 'unknown';

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
