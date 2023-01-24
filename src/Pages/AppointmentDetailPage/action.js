import { fetchAction } from "../../fetchAction";
import jsonToFormData from "json-form-data";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;
const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const GetAppointmentDetails = ({ bookingId, sessionId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Appointments/GetAppointmentDetails/${bookingId}/${sessionId}`,
  }).then((res) => {
    const { code, result } = res;
    code !== 0 ? callback([]) : callback(result);
  });
};

// customer booking history
export const GetAppointmentHistory = ({
  bookingId,
  customerId,
  ProviderId,
  isBusiness,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Appointments/GetAppointmentHistory?CustomerId=${customerId}&BookingId=${bookingId}&UserId=${ProviderId}&IsBusiness=${isBusiness}&pagenumber=1&pagesize=100`,
  }).then((res) => {
    const { code, customerBookingDetails } = res;
    code !== 0 ? callback([]) : callback(customerBookingDetails);
  });
};

//customer upcoming bookings Customer/UpComingBookings
export const GetUpComingBookings = ({
  bookingId,
  customerId,
  ProviderId,
  isBusiness,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Customer/UpComingBookings?CustomerId=${customerId}&BookingId=${bookingId}&UserId=${ProviderId}&IsBusiness=${isBusiness}&pagenumber=1&pagesize=100`,
  }).then((res) => {
    const { code, customerBookingDetails } = res;
    code !== 0 ? callback([]) : callback(customerBookingDetails);
  });
};

// history booking
export const getBookingByCustomerId = ({ customerId, userId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Customer/GetCustomerBookings?customerId=${customerId}&businessId=${userId}`,
    verb: "GET",
  }).then((res) => callback(res));
};

//check in
export const CheckIn = ({
  bookingid,
  providerId,
  sessionId,
  time,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/JobAllocator/ProviderCheckin`,
    verb: "PUT",
    payload: JSON.stringify({
      bookingid: bookingid,
      providerid: providerId,
      sessionId: sessionId,
      time: time,
    }),
  }).then((res) => {
    callback(res);
  });
};

//startjob
export const JobStart = ({
  bookingid,
  providerId,
  sessionId,
  time,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Providers/JobStart`,
    verb: "POST",
    payload: JSON.stringify({
      providerId: providerId,
      bookingid: bookingid,
      sessionId: sessionId,
      jobStartTime: time,
    }),
  }).then((res) => {
    callback(res);
  });
};

// complete job
export const CompleteBooking = ({
  bookingid,
  providerId,
  customerId,
  sessionId,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Booking/CompleteBooking`,
    verb: "POST",
    payload: JSON.stringify({
      providerId: providerId,
      bookingid: bookingid,
      pgCustomerId: customerId,
      sessionId: sessionId,
    }),
  }).then((res) => {
    callback(res);
  });
};

// upload consent form
export const UploadConsentForm = (eventId, file, response) => {
  const formData = {
    bookingid: eventId,
    filetoupload: file,
  };

  let url = APP_BASE_URL_2 + "/ConsentForm/UploadConsentForm";

  const requestOptions = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_Bearer}`,
    },
    method: "POST",
    body: jsonToFormData(formData),
  };
  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((res) => response(res))
    .catch((err) => alert(err));
};

export const SendEditBookingOTP = ({ customerId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/BookingAttachments/SendEditBookingOTP?CustomerId=${customerId}`,
  }).then((res) => {
    callback(res);
  });
};

export const VerifyEditBookingOTP = ({ customerId, code, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/BookingAttachments/verifyEditBookingOTP`,
    verb: "POST",
    payload: JSON.stringify({
      customerId: customerId,
      paymentOTP: code,
    }),
  }).then((res) => callback(res));
};

export const CancelBooking = ({ reason, bookingId, customerId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/Booking/CancelBooking`,
    verb: "POST",
    payload: JSON.stringify({
      userId: customerId,
      bookingId: bookingId,
      notes: reason,
    }),
  }).then((res) => callback(res));
};
