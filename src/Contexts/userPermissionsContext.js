import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { fetchAction } from "../fetchAction";
import { getCookies } from "../utils";

const APP_BASE_URL = process.env.REACT_APP_BASE_URL_2;

export const UserPermissionsContext = createContext();

export const UserPermissionsProvider = ({ children }) => {
  const [screenStatus, setScreenStatus] = useState(null);

  useEffect(() => {
    if (getCookies("userId")) {
      fetchAction({
        verb:"GET",
        endpoint: `${APP_BASE_URL}/Permission/GetScreenStatus?userid=${getCookies(
          "userId"
        )}`,
      }).then((res) => {
        setScreenStatus(res.screenstatus);
      });
    }


    var config = {
      method: 'get',
      url: 'https://2expertcrmapi.findanexpert.net/api/Permission/GetScreenStatus?userid=17618',
      headers: { 
        'Authorization': 'Bearer XzUzTFQzUS5AUEkudkAyX9Bsk5fSzA3FyIdApae1IAM='
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data),  'lllll');
    })
    .catch(function (error) {
      console.log(error);
    });

    
    
  }, []);

  const getUserPermissions = ({ userId, callback }) => {
    fetchAction({
      verb:"GET",
      endpoint: `${APP_BASE_URL}/Permission/GetScreenStatus?userid=${userId}`,
    }).then((res) => {
      setScreenStatus(res.screenstatus);
      callback(res.screenstatus);
    });
  };

  return (
    <UserPermissionsContext.Provider
      value={{ screenStatus, setScreenStatus, getUserPermissions }}
    >
      {children}
    </UserPermissionsContext.Provider>
  );
};
