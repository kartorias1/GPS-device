import React, { createContext, useEffect, useState } from 'react';
import { getLocationInfo } from './device.service';

export const DeviceContext = createContext({});

export const DeviceContextProvider = ({ children }: any) => {
  const [deviceId, setDeviceId] = useState('');
  const [isValidDevice, setIsValidDevice] = useState(true);

  const onCheckDeviceExist = () => {
    console.log("This get called");
    getLocationInfo(deviceId)
      .then((result: any) => {
        if (result.status == "200"){
         setIsValidDevice(true);
        console.log("Valid device");
        }
        else {
         setIsValidDevice(false);
        console.log("Invalid device");

        }

      })
      .catch((error: any) => {
        setIsValidDevice(false);
        console.log(error);
      });
  };

  useEffect(() => {
    onCheckDeviceExist();
  }, [deviceId]);

  return (
    <DeviceContext.Provider
      value={{ deviceId, setDeviceId, isValidDevice, setIsValidDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};