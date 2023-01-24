import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;
const APP_BASE_URL_4 = process.env.REACT_APP_BASE_URL_4;

export const GetAppointmentDetails = ({ eventId, sessionId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Appointments/GetAppointmentDetails/${eventId}/${sessionId}`,
  }).then((res) => {
    const { code, result } = res;
    code !== 0 ? callback([]) : callback(result);
  });
};
///Providers/GetProvidersByClinic/2926

export const GetProvidersByClinic = ({ userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/GetProvidersByClinic/${userId}`,
  }).then((res) => {
    callback(res);
  });
};

//get provider availibility
export const GetProviderAvailibility = ({ selectedProvider, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Expert/GetAvailableDays?UserId=${selectedProvider}`,
  }).then((res) => {
    const { code, availableDays } = res;
    code !== 0 ? callback([]) : callback(availableDays);
  });
};

//GetAvailableSlots
// export const GetAvailableSlots = ({
//   selectedProvider,
//   bookingDate,
//   CurrentDateTime,
//   Duration,
//   callback,
// }) => {
//   return fetchAction({
//     endpoint: `${APP_BASE_URL_2}/Expert/GetAvailableSlots?UserId=${selectedProvider}&BookingDate=${bookingDate}&BookingDuration=${Duration}&CurrentDateTime=${CurrentDateTime}`,
//   }).then((res) => {
//     const { code, result } = res;
//     code !== 0 ? callback([]) : callback(result);
//   });
// };

//jds slots
export const GetAvailableSlots = ({
  businessId,
  bookingDate,
  serviceId,
  serviceVenu,
  Duration,
  selectedProvider,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_4}/Clinic/CreateTimeSlotsForBusiness`,
    verb: "POST",
    payload: JSON.stringify({
      businessId,
      bookingDate,
      serviceId,
      serviceVenu,
      Duration,
      providerId: selectedProvider,
    }),
  }).then((res) => {
    callback(res);
  });
};

//update booking
// export const UpdateBooking = ({
//   bookingId,
//   userId,
//   selectedProvider,
//   date,
//   startTime,
//   sessionId,
//   endTime,
//   isUpdated,
//   callback,
// }) => {
//   return fetchAction({
//     endpoint: `${APP_BASE_URL_2}/Expert/UpdateBooking`,
//     verb: "PUT",
//     payload: JSON.stringify({
//       bookingId: bookingId,
//       businessId: parseInt(userId),
//       providerId: parseInt(selectedProvider),
//       sessionId: sessionId,
//       date: date,
//       startTime: startTime,
//       endTime: endTime,
//       isUpdated: isUpdated,
//     }),
//   }).then((res) => callback(res));
// };

export const UpdateBooking = ({
  bookingId,
  customerId,
  date,
  startTime,
  sessionId,
  availableProviders,
  endTime,
  latitude,
  longitude,
  duration,
  serviceVenu,
  serviceId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Booking/UpdateBookingJds`,
    verb: "POST",
    payload: JSON.stringify({
      bookingId,
      sessionId,
      customerId,
      providerIds: availableProviders,
      bookingDate: date,
      startTime,
      endTime,
      distance: 20,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      duration,
      serviceVenu,
      serviceId,
    }),
  }).then((res) => callback(res));
};
