"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const request_ip_1 = __importDefault(require("request-ip"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const ipinfoToken = "029a3a93101e04";
const openWeatherMapApiKey = "d9c9f84ddd18db1d274e1896a63f79c9";
app.use(request_ip_1.default.mw());
app.use(express_1.default.json());
app.get('/api/hello', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visitorName = req.query.visitor_name;
    const clientIp = req.clientIp || 'unknown'; // Express typings already provide req.ip
    try {
        const ipinfoResponse = yield axios_1.default.get(`https://ipinfo.io/${clientIp}?token=${ipinfoToken}`);
        const ipinfoData = ipinfoResponse.data;
        const city = ipinfoData.city || 'unknown';
        // Fetch weather data
        const weatherResponse = yield axios_1.default.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}&units=metric`);
        const weatherData = weatherResponse.data;
        const temperature = weatherData.main.temp;
        const apiResponse = {
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
        };
        res.json(apiResponse);
    }
    catch (error) {
        console.error('Error fetching location data:', error);
        res.status(500).json({ error: 'Unable to fetch location data' });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
