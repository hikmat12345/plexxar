//address-parser
export const addressSuggestionsParser = (data) => {
  const parsedData =
    data &&
    data.map(({ description, place_id }) => ({
      label: description,
      value: place_id,
    }));
  return parsedData;
};

//return index of day
export const getWeekNumber = (day) => {
  switch (day) {
    case "Monday":
      return 1;
    case "Tuesday":
      return 2;
    case "Wednesday":
      return 3;
    case "Thursday":
      return 4;
    case "Friday":
      return 5;
    case "Saturday":
      return 6;
    case "Sunday":
      return 0;
    default:
      break;
  }
};

//address-parser
export const resourceParser = (data) => {
  const parsedData = data.map(
    ({ id, firstName, lastName, getAvailability, imagePath }, index) => ({
      id: id,
      title: `${firstName ?? ""} ${lastName ?? ""}`,
      businessHours: getAvailability.map(
        ({ day, timefrom, timeto, isavailable }) =>
          isavailable && {
            startTime: timefrom,
            endTime: timeto,
            daysOfWeek: [getWeekNumber(day)],
          }
      ),
    })
  );
  return parsedData;
};

//unavailability parser
export const resourceUnavailablityParser = (data) => {
  let parsedData = [];
  data.map(
    ({ day, isavailable }) =>
      !isavailable && parsedData.push(getWeekNumber(day))
  );
  return parsedData;
};
