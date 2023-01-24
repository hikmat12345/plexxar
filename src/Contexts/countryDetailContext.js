import { createContext, useEffect, useState } from "react";
import { fetchAction } from "../fetchAction";
import { getCookies } from "../utils";

const GEO_LOCATION_API_KEY = process.env.REACT_APP_GEO_LOCATION_API_KEY;
const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const CountryDetailContext = createContext();

export const CountryDetailProvider = ({ children }) => {
  const [userCountry, setUserCountry] = useState("");
  const [userCountryId, setUserCountryId] = useState("");
  const [userLat, setUserLat] = useState(0);
  const [userLng, setUserLng] = useState(0);

  useEffect(() => {
    fetchAction({
      endpoint: `https://api.ipgeolocation.io/ipgeo?apiKey=${GEO_LOCATION_API_KEY}`,
    }).then((res) => {
      setUserCountry(res.country_code2);
      setUserLat(res.latitude);
      setUserLng(res.longitude);
    });
  }, []);

  useEffect(() => {
    if (userCountry !== "") {
      fetchAction({
        endpoint: `${APP_BASE_URL}/Country/GetCountryDetail/${userCountry}/0`,
      }).then((res) =>
        setUserCountryId(
          getCookies("countryId") === undefined
            ? res.countryDetail.id
            : getCookies("countryId")
        )
      ); //res.countryDetail.id for uk 1
    }
  }, [userCountry]);
  return (
    <CountryDetailContext.Provider
      value={{ userCountry, userCountryId, setUserCountryId, userLat, userLng }}
    >
      {children}
    </CountryDetailContext.Provider>
  );
};
