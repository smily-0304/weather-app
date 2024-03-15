const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Update the route to handle weather data to "/weather"
app.post('/weather', (req, res) => {
    const query = req.body.cityName;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=56e3ec93b5e949f3bc4a136dac7702ac&units=metric`;

    https.get(url, (response) => {
        let rawData = '';
        response.on('data', (chunk) => {
            rawData += chunk;
        });

        response.on('end', () => {
            try {
                const weather = JSON.parse(rawData);
                const temp = weather.main.temp;
                res.json({ temp: temp });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ error: 'Failed to fetch weather data' });
            }
        });
    }).on('error', (error) => {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
