import { createContext, useState } from 'react';

export const SelectedCityContext = createContext();

export const SelectedCityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState('Kyiv');
  const [sendApi, setSendApi] = useState(false);

  return (
    <SelectedCityContext.Provider value={{ selectedCity, setSelectedCity, sendApi, setSendApi }}>
      {children}
    </SelectedCityContext.Provider>
  );
};