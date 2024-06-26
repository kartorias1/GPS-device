import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getLocationInfo } from './locationInfo.service';
import { DeviceContext } from '../device/device.context';
import notifee from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';

const displayWarning = async () => {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'Warning',
    name: 'Warning channel',
  });

  await notifee.displayNotification({
    title: 'Device is out of range',
    body: 'Your tracking device has gone out of the defined area boundary',
    android: {
      channelId,
      pressAction: {
        id: 'Warning',
      },
    },
  });
};

export const LocationInfoContext = createContext({});

export const LocationInfoContextProvider = ({ children }: any) => {
  const navigation = useNavigation();
  const { deviceId }: any = useContext(DeviceContext);

  const [location, setLocation] = useState({
    longitude: 108.1533,
    latitude: 16.0758,
  });

  const isSendedWarning = useRef(false);

  const onGetLocationInfo = () => {
    getLocationInfo(deviceId)
      .then((result: any) => {
        location.longitude = result.longitude;
        location.latitude = result.latitude;
        if (result) {
          setLocation({
            longitude: parseFloat(result.longitude),
            latitude: parseFloat(result.latitude),
          });
          console.log('Updated location info');
          console.log(location);
          console.log(isSendedWarning.current);
          if (result.isOutOfBound && !isSendedWarning.current) {
            isSendedWarning.current = true;
            displayWarning();
            navigation.navigate('WarningScreen' as never);
          } else if (!result.isOutOfBound){
            isSendedWarning.current = false;
          }
        } else {
          console.log('Invalid device');
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  useEffect(() => {
    console.log('The on get location info get called');
    const interval = setInterval(() => onGetLocationInfo(), 10000);
    return () => clearInterval(interval);
  }, [deviceId]);
  return (
    <LocationInfoContext.Provider value={{ location }}>
      {children}
    </LocationInfoContext.Provider>
  );
};
