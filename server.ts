import express from 'express';
import { Request, Response } from 'express';
import requestIp from 'request-ip';
import axios from 'axios';

const app = express();

app.use(requestIp.mw());

app.get('/api/hello', async (req: Request, res: Response) => {
    const visitorName = req.query.visitor_name as string;
    const clientIp = req.clientIp || 'unknown';

    try {
        // Make a request to the geolocation API
        const response = await axios.get(`http://ip-api.com/json/${clientIp}`);
        const data = response.data;
        const location = data.city || 'unknown';
        const temperature = 11; // Mock temperature data

        const apiResponse = {
            client_ip: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
        };

        res.json(apiResponse);
    } catch (error) {
        console.error('Error fetching location data:', error);
        res.status(500).json({ error: 'Unable to fetch location data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
