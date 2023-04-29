import * as tf from '@tensorflow/tfjs';

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const HISTORICAL_API_URL = 'https://archive-api.open-meteo.com/v1/archive';

export const getTemperature = async (l, d) => {
  const response = await fetch(
    `${API_BASE_URL}?latitude=${l}&longitude=${d}&hourly=temperature_2m`
  );
  const data = await response.json();
  return data.hourly.temperature_2m;
};

export const getPrecipitation = async (l, d) => {
  const response = await fetch(
    `${API_BASE_URL}?latitude=${l}&longitude=${d}&hourly=precipitation`
  );
  const data = await response.json();
  return data.hourly.precipitation;
};

export const getWindspeed_10m = async (l, d) => {
  const response = await fetch(
    `${API_BASE_URL}?latitude=${l}&longitude=${d}&hourly=windspeed_10m`
  );
  const data = await response.json();
  return data.hourly.windspeed_10m;
};

export const getRelativehumidity_2m = async (l, d) => {
  const response = await fetch(
    `${API_BASE_URL}?latitude=${l}&longitude=${d}&hourly=relativehumidity_2m`
  );
  const data = await response.json();
  return data.hourly.relativehumidity_2m;
};

export const getCloudcover = async (l, d) => {
  const response = await fetch(
    `${API_BASE_URL}?latitude=${l}&longitude=${d}&hourly=cloudcover`
  );
  const data = await response.json();
  return data.hourly.cloudcover;
};

export const getHistoricalData = async (
  latitude,
  longitude,
  dates,
  parameter
) => {
  const data = await Promise.all(
    dates.map(async (date) => {
      const response = await fetch(
        `${HISTORICAL_API_URL}?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&hourly=${parameter}`
      );
      const result = await response.json();
      return result.hourly[parameter][0];
    })
  );
  return data;
};

const getDatesForNextDays = (days) => {
  const now = new Date();
  return Array.from({ length: days }, (_, dayIndex) => {
    const nextDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + dayIndex + 1
    );
    const dates = Array.from({ length: 7 }, (_, i) => {
      const pastDate = new Date(
        nextDay.getFullYear() - i - 1,
        nextDay.getMonth(),
        nextDay.getDate()
      );
      return pastDate.toISOString().slice(0, 10);
    });
    return dates;
  });
};

const trainAndPredict = (historicalData, days) => {
  const lastDaysData = historicalData.slice(-days);
  const predictedValue = lastDaysData.reduce((acc, cur) => acc + cur, 0) / days;

  return predictedValue;
};

export const predictWeather = async (latitude, longitude, days) => {
  const datesForNextDays = getDatesForNextDays(days);

  const predictions = await Promise.all(
    datesForNextDays.map(async (dates) => {
      const historicalTemperature = await getHistoricalData(
        latitude,
        longitude,
        dates,
        'temperature_2m'
      );
      const historicalHumidity = await getHistoricalData(
        latitude,
        longitude,
        dates,
        'relativehumidity_2m'
      );
      const historicalPrecipitation = await getHistoricalData(
        latitude,
        longitude,
        dates,
        'precipitation'
      );
      const historicalWindspeed = await getHistoricalData(
        latitude,
        longitude,
        dates,
        'windspeed_10m'
      );

      const predictedTemperature = trainAndPredict(historicalTemperature, days);
      const predictedHumidity = trainAndPredict(historicalHumidity, days);
      const predictedPrecipitation = trainAndPredict(
        historicalPrecipitation,
        days
      );
      const predictedWindspeed = trainAndPredict(historicalWindspeed, days);

      return {
        temperature: predictedTemperature,
        humidity: predictedHumidity,
        precipitation: predictedPrecipitation,
        windspeed: predictedWindspeed,
      };
    })
  );

  return predictions;
};
