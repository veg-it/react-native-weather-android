import { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';

import {
  getTemperature,
  getWindspeed_10m,
  getRelativehumidity_2m,
  getPrecipitation,
  getCloudcover,
} from '../api/apiCalls';
import { cityCoordinates } from '../data/cityCoordinates';

import SelectCountry from '../components/SelectCountry';
import WeatherForecast from '../components/WeatherForecast';
import { SelectedCityContext } from '../contexts/SelectedCityContext';

export default function HomeScreen({ navigation }) {
  const [selectedD, setSelectedD] = useState(1);
  const { selectedCity, setSelectedCity } = useContext(SelectedCityContext);

  const [temperature, setTemperature] = useState([]);
  const [windspeed_10m, setWindspeed_10m] = useState([]);
  const [precipitation, setPrecipitation] = useState([]);
  const [relativehumidity_2m, setRelativehumidity_2m] = useState([]);
  const [cloudcover, setCloudcover] = useState([]);
  const [sendApi, setSendApi] = useState(false);

  const getDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    if (!sendApi) {
      const { l, d } = cityCoordinates[selectedCity];
      getCloudcover(l, d).then(setCloudcover);
      getPrecipitation(l, d).then(setPrecipitation);
      getRelativehumidity_2m(l, d).then(setRelativehumidity_2m);
      getWindspeed_10m(l, d).then(setWindspeed_10m);
      getTemperature(l, d).then(setTemperature);
    }
  }, [sendApi, selectedCity]);

  const weatherImage = () => {
    if (relativehumidity_2m > 50) {
      return require('../img/rain.png');
    } else if (cloudcover[0] > 50) {
      return require('../img/cloud.png');
    } else {
      return require('../img/weather.png');
    }
  };

  return (
    <View style={styles.container}>
    <SelectCountry />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          
          <Text style={styles.dateText}>Click to select</Text>
          <Text style={styles.dateText}>{getDate()}</Text>
          <Text style={styles.temperatureText}>
            {Math.round(temperature[selectedD * 23 - 1])}°C
          </Text>
        </View>
        <Image source={weatherImage()} style={styles.weatherIcon} />
      </View>
      <View style={styles.weatherInfo}>
        <View style={styles.weatherInfoItem}>
          <Image
            source={require('../img/relativehumidity.png')}
            style={styles.weatherInfoIcon}
          />
          <Text style={styles.weatherInfoText}>
            {relativehumidity_2m[selectedD * 23 - 1]}%
          </Text>
        </View>
        <View style={styles.weatherInfoItem}>
          <Image
            source={require('../img/zont.png')}
            style={styles.weatherInfoIcon}
          />
          <Text style={styles.weatherInfoText}>
            {precipitation[selectedD * 23 - 1]}%
          </Text>
        </View>
        <View style={styles.weatherInfoItem}>
          <Image
            source={require('../img/wind.png')}
            style={styles.weatherInfoIcon}
          />
          <Text style={styles.weatherInfoText}>
            {windspeed_10m[selectedD * 24 - 1]}km/h
          </Text>
        </View>
      </View>
      <WeatherForecast selectedCity={selectedCity} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#1b1d1f',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerContent: {},
  dateText: {
    color: '#5A5C5E',
  },
  temperatureText: {
    color: '#f3f3f3',
    fontSize: 54,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  weatherInfo: {
    backgroundColor: '#202329',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
  },
  weatherInfoItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherInfoIcon: {
    height: 48,
    width: 48,
  },
  weatherInfoText: {
    color: '#f3f3f3',
    fontWeight: 'bold',
    marginTop: 5,
  },
});
