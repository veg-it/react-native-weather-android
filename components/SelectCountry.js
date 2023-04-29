import React from 'react';
import { useContext } from 'react';
import { View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Icon } from 'react-native-elements';
import styles from '../styles/SelectCountryStyles';
import { cities } from '../data/cities';
import { SelectedCityContext } from '../contexts/SelectedCityContext';

export default function SelectCountry() {
  const { selectedCity, setSelectedCity } = useContext(SelectedCityContext);
  const { setSendApi } = useContext(SelectedCityContext);

  const onSelect = (selectedItem) => {
    setSelectedCity(selectedItem);
    setSendApi(false);
  };

  return (
    <View style={styles.container}>
      <SelectDropdown
        data={cities}
        defaultButtonText={selectedCity}
        search
        renderSearchInputRightIcon={() => (
          <Icon name={'search'} type="font-awesome" size={18} color="#333" />
        )}
        searchInputStyle={styles.searchInputStyle}
        searchInputTxtColor={'#f3f3f3'}
        rowStyle={styles.rowStyle}
        rowTextStyle={styles.rowTextStyle}
        dropdownStyle={styles.dropdownStyle}
        buttonStyle={styles.buttonStyle}
        buttonTextStyle={styles.selectC_buttonTextStyle}
        onSelect={onSelect}
        buttonTextAfterSelection={(selectedItem) => selectedItem}
        rowTextForSelection={(item) => item}
      />
    </View>
  );
}
