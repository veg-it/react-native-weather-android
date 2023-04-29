import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  weatherLine: {
    backgroundColor: '#213442',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 5,
    marginVertical: 5,
  },
  weatherLine__temp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherLine__time: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherLine__time_text: {
    color: '#f3f3f3',
    fontWeight: 'bold',
    fontSize: 18
  },
  weatherLine__temp_image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  weatherLine__temp_text: {
    color: '#f3f3f3',
    fontWeight: 'bold',
  },
});