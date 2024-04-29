import chartJs from 'chart.js';
const api = "/api/explore/v2.1/catalog/datasets/windmessung-bahnhofplatz-stadt-stgallen/records?limit=20"

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten von der API:', error);
        return null;
    }
}

async function displayData(url) {
    const data = await fetchData(url);
    if (data) {
        data.forEach(item => {
            console.log(item);
        });
    }
}


displayData(api);