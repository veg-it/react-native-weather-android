import * as React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import styles from '../styles/TemperatureTableStyles';

export default function TemperatureTable({ time, sendApi }) {
  if (!sendApi) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      {time.length > 0 ? (
      <FlatList
        // отключить полосы прокрутки
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={time}
        renderItem={({ item }) => (
          <View style={styles.weatherLine}>
            <View style={styles.weatherLine__time}>
              {/* вывод времени */}
              <Text style={styles.weatherLine__time_text}>{item.time}</Text>
            </View>
            <View style={styles.weatherLine__temp}>
              {/* если облачность больше 70% сменить иконку */}
              <Image
                source={
                  item.cloud > 70
                    ? require('../img/cloud.png')
                    : require('../img/weather.png')
                }
                style={styles.weatherLine__temp_image}
              />
              {/* вывод температуры в это время */}
              <Text style={styles.weatherLine__temp_text}>{item.temp}°C</Text>
            </View>
          </View>
        )}
      />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
