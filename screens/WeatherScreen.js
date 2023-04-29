import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';

import {
  getTemperature,
  getRelativehumidity_2m,
  getCloudcover,
} from '../api/apiCalls';
import { cityCoordinates } from '../data/cityCoordinates';

import TemperatureTable from '../components/TemperatureTable';
import { SelectedCityContext } from '../contexts/SelectedCityContext';

export default function App() {
  const [selectedD, setSelectedD] = useState(1);

  const [temperature, setTemperature] = useState([]);
  const [relativehumidity_2m, setRelativehumidity_2m] = useState([]);
  const [cloudcover, setCloudcover] = useState([]);
  const { sendApi, setSendApi } = useContext(SelectedCityContext);
  const [time, setTime] = useState([]);
  const { selectedCity, setSelectedCity } = useContext(SelectedCityContext);

  const sevendays = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      const dd = String(day.getDate()).padStart(2, '0');
      const mm = String(day.getMonth() + 1).padStart(2, '0');
      return { key: `${dd}.${mm}`, id: i + 1 };
    });
  };

  const createWeatherData = (startIndex) =>
    ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((time, idx) => {
      const index = startIndex + idx * 4;
      return {
        time,
        temp: Math.round(temperature[index]),
        cloud: Math.round(cloudcover[index]),
        relativehumidity: Math.round(relativehumidity_2m[index]),
      };
    });

  const changeDateTemp = (item) => {
    setSelectedD(item);
    const startIndex = (item - 1) * 24;
    setTime(createWeatherData(startIndex));
  };

 useEffect(() => {
  const fetchData = async () => {
    const { l, d } = cityCoordinates[selectedCity];
    try {
      const cloudData = await getCloudcover(l, d);
      const humidityData = await getRelativehumidity_2m(l, d);
      const temperatureData = await getTemperature(l, d);

      setCloudcover(cloudData);
      setRelativehumidity_2m(humidityData);
      setTemperature(temperatureData);
      setSendApi(true); // Измените здесь на false
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  if (!sendApi) {
    fetchData();
  }
}, [sendApi, selectedCity]);

useEffect(() => {
  if (temperature.length > 0) {
    changeDateTemp(selectedD);
  }
}, [temperature, selectedCity]);

  return (
    <View style={styles.container}>
      <View>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            marginTop: 30,
            fontWeight: '700',
          }}>
          Weather from OpenMeteo:
        </Text>
        <FlatList
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
          data={sevendays()}
          keyExtractor={(item, index) => 'key-' + index}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => changeDateTemp(item.id)}>
              <Text
                style={
                  item.id === selectedD
                    ? styles.selectedDateText
                    : styles.dateText
                }>
                {item.key}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <TemperatureTable time={time} sendApi={sendApi} />
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
  dateText: {
    marginHorizontal: 5,
    padding: 7,
    color: '#5A5C5E',
    backgroundColor: '#202329',
  },
  dateList: {
    marginVertical: 30,
  },
  selectedDateText: {
    marginHorizontal: 5,
    padding: 7,
    backgroundColor: '#213442',
    color: '#f3f3f3',
  },
});
