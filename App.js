import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from './screens/HomeScreen';
import WeatherScreen from './screens/WeatherScreen';
import { SelectedCityProvider } from './contexts/SelectedCityContext';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <SelectedCityProvider>
      <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarPosition="bottom"
        swipeEnabled={true}
        tabBarOptions={{
          showLabel: false,
          showIcon: false,
          style: { height: 0 },
          indicatorStyle: {
            backgroundColor: 'white',
            height: 10,
          },
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Weather" component={WeatherScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    </SelectedCityProvider>
    
  );
}