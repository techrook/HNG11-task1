import express from 'express';
import { Request, Response } from 'express';
import requestIp from 'request-ip';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(requestIp.mw());

const api_key = process.env.OPENWEATHERMAP_API_KEY;

app.get('/api/hello', async (req: Request, res: Response) => {
    const visitorName = req.query.visitor_name as string;
    const clientIp = req.clientIp || 'unknown';

    try {
        console.log(api_key)
        // Make a request to the geolocation API
        const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
        const locationData = locationResponse.data;
        const city = locationData.city || 'unknown';

        console.log(city)
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
        const weatherData = weatherResponse.data;
        const temperature = weatherData.main.temp;

        const apiResponse = {
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
        };

        res.json(apiResponse);
    } catch (error) {
        console.log(clientIp)
        console.error('Error fetching location data:', error);
        res.status(500).json({ error: 'Unable to fetch location data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
