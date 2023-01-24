import Cookies from "universal-cookie";
import history from "./history";
const cookies = new Cookies();

//empty-object
export const objectIsEmpty = (obj) => {
  return Object.keys(obj).length === 0 ? true : false;
};

export const getLongCustomerId = () => {
  const { id, firstName, lastName } = getCookies("customer_details");
  return `${firstName}-${lastName}-${id}`;
};
export const getCustomerId = () => {
  const { id } = getCookies("customer_details");
  return id ?? 0;
};

export const getProviders = () => {
  const { id, isBusiness } = getCookies("customer_details");
  if (!isBusiness) return [id];
  let providers = getCookies("providers");
  if (!providers) return [];
  return providers.providers;
};
export const getCustomerName = () => {
  const { firstName, lastName } = getCookies("customer_details");
  return `${firstName}-${lastName}`;
};
export const hasCookie = (name) => {
  return !!getCookies(name);
};

//set-cookie
export const setCookies = (name, value, expires) => {
  var date = new Date();
  date.setTime(date.getTime() + expires * 10000);
  cookies.set(name, value, {
    path: "/",
    expires: date,
  });
};

//get-cookie
export const getCookies = (name) => {
  return cookies.get(name);
};

//remove-cookies
export const removeCookies = (name) => {
  cookies.remove(name, { path: "/" });
};

//setLocalStorageStringified
export const setLocalStorageStringified = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

//getLocalStorageParsed
export const getLocalStorageParsed = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

//setSessionStorageStringified
export const setSessionStorageStringified = (name, value) => {
  sessionStorage.setItem(name, JSON.stringify(value));
};

//getSessionStorageParsed
export const getSessionStorageParsed = (name) => {
  return JSON.parse(sessionStorage.getItem(name));
};

//setLocalStorage
export const setLocalStorage = (name, value) => {
  localStorage.setItem(name, value);
};

//getLocalStorage
export const getLocalStorage = (name) => {
  return localStorage.getItem(name);
};

//setSessionStorage
export const setSessionStorage = (name, value) => {
  sessionStorage.setItem(name, value);
};

//getSessionStorage
export const getSessionStorage = (name) => {
  return sessionStorage.getItem(name);
};

//getImageOrVideoFromPublicFolder
export const getFileSrcFromPublicFolder = (name) => {
  return `${process.env.PUBLIC_URL}/assets/images/${name}`;
};

//validate-input
export const validateInput = (regex, value) => {
  return new RegExp(regex).test(value);
};

//get-unique-data-array
export const getUniqueData = (array, key) => {
  if (typeof key !== "function") {
    const property = key;
    key = function (item) {
      return item[property];
    };
  }

  return Array.from(
    array
      .reduce(function (map, item) {
        const k = key(item);
        if (!map.has(k)) map.set(k, item);
        return map;
      }, new Map())
      .values()
  );
};

//replace spaces
export const replaceSpaces = (string, value) => {
  return string.replaceAll(" ", value);
};

//add spaces
export const addSpaces = (string, value) => {
  return string.replaceAll(value, " ");
};

//18 years back date
export const eighteenYearsBackDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  let eighteenYearsBack = yyyy - 18;
  eighteenYearsBack = {
    day: parseInt(dd),
    month: parseInt(mm),
    year: eighteenYearsBack,
  };

  return eighteenYearsBack;
};

//user-scr  een-permissions
export const getUserScreePermission = (status) => {
  return status === 0
    ? "/update-profile"
    : status === 1
    ? "/user-status"
    : status === 2
    ? "/user-status"
    : status === 3
    ? "/user-appointments"
    : "";
};

//getFullAddress
export const getFullAddress = (line1, line2, city) => {
  return line1
    .concat(line2 !== "" ? `,${line2}` : "")
    .concat(city !== "" ? `,${city}` : "");
};

//time to am pm

export const To12Hours = (time) => {
  var d = time.split(":")[0];
  var mins = time.split(":")[1];
  var extra = d % 12;
  var hour = extra === 0 ? 12 : extra;
  var am = d >= 12 ? "PM" : "AM";
  var final = hour + ":" + mins + " " + am;
  return final;
};

//industries-parser
export const faeIndustriesParser = (industryList, userId, isBusiness, next) => {
  const parsedData = industryList.map(
    ({ imagePath, industryId, industryName, hasChilds, childs }) => ({
      id: industryId,
      src: imagePath,
      alt: industryName,
      label: industryName,
      onClick: () =>
        hasChilds === true
          ? history.push({
              pathname: `/${replaceSpaces(industryName, "-")}/sub-industry`,
              state: { industryId, childs, userId, next },
            })
          : history.push({
              pathname: "/add-services",
              state: { industryId, userId, isBusiness, next },
            }),
    })
  );
  return parsedData;
};

//sub-industries-parser
export const faeSubIndustriesParser = (
  subIndustries,
  userId,
  isBusiness,
  next
) => {
  const parsedData = subIndustries.map(
    ({ imagePath, industryId, industryName, hasChilds, childs }) => ({
      id: industryId,
      src: imagePath,
      alt: industryName,
      label: industryName,
      onClick: () =>
        hasChilds === true
          ? history.push({
              pathname: `/${replaceSpaces(industryName, "-")}/sub-industry`,
              state: { industryId, childs, userId, next },
            })
          : history.push({
              pathname: "/add-services",
              state: { industryId, userId, isBusiness, next },
            }),
      // history.push(`/${replaceSpaces(industryName, "-")}/services`),
    })
  );

  return parsedData;
};
