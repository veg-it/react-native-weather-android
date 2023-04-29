import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator 
} from 'react-native';
import Constants from 'expo-constants';

import { predictWeather } from '../api/apiCalls';
import { cityCoordinates } from '../data/cityCoordinates';

export default function WeatherForecast({ selectedCity }) {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPredictions(selectedCity);
  }, [selectedCity]);

  const loadPredictions = (city) => {
    setIsLoading(true);
    const { l, d } = cityCoordinates[city];
    predictWeather(l, d, 7).then((predictedData) => {
      setPredictions(predictedData);
      setIsLoading(false);
    });
  };

  const renderItem = ({ item, index }) => (
    <View key={index}>
      <Text style={{color: '#5A5C5E', marginBottom: 5}}>Day {index + 1}:</Text>
      <View style={styles.weatherContainer}>
        <Text style={styles.predictionText}>
        Temperature: {Math.round(item.temperature)} °C
        </Text>
        <View style={styles.weatherInfo}>
          <View style={styles.weatherInfoItem}>
            <Image
              source={require('../img/relativehumidity.png')}
              style={styles.weatherInfoIcon}
            />
            <Text style={styles.weatherInfoText}>
              {item.humidity.toFixed(2)} %
            </Text>
          </View>
          <View style={styles.weatherInfoItem}>
            <Image
              source={require('../img/zont.png')}
              style={styles.weatherInfoIcon}
            />
            <Text style={styles.weatherInfoText}>
              {item.precipitation.toFixed(2)} %
            </Text>
          </View>
          <View style={styles.weatherInfoItem}>
            <Image
              source={require('../img/wind.png')}
              style={styles.weatherInfoIcon}
            />
            <Text style={styles.weatherInfoText}>
              {item.windspeed.toFixed(2)} m/s
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : predictions.length > 0 ? (
        <View style={styles.predictionsContainer}>
          <Text style={styles.predictionsTitle}>
            Forecast for the next 7 days:
          </Text>
          <FlatList
            data={predictions}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          />
        </View>
      ) : null}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  predictionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  predictionText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherContainer: {
    backgroundColor: '#213442',
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginRight: 10,
    borderRadius: 5,
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
  },
  weatherInfoItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal:15
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
