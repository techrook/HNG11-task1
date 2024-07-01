import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import requestIp from 'request-ip';

dotenv.config();
const app = express();

const ipinfoToken = process.env.IPINFO_API_TOKEN as string;
const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY as string;

interface IpinfoResponse {
    city?: string;
    // Add more fields as needed based on ipinfo.io response
}

app.use(requestIp.mw());
app.use(express.json());

app.get('/api/hello', async (req: Request, res: Response) => {
    const visitorName = req.query.visitor_name as string;
    const clientIp = req.clientIp || 'unknown';// Express typings already provide req.ip

    try {
        const ipinfoResponse = await axios.get<IpinfoResponse>(`https://ipinfo.io/${clientIp}?token=${ipinfoToken}`);
        const ipinfoData = ipinfoResponse.data;
        const city = ipinfoData.city || 'unknown';

        // Fetch weather data
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}&units=metric`);
        const weatherData = weatherResponse.data;
        const temperature = weatherData.main.temp;

        const apiResponse = {
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
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
