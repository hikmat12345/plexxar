import { fetchAction } from "../../fetchAction";

const APP_BASE_URL   = process.env.REACT_APP_BASE_URL;
const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const getProviderServices = ({userId, callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Appointments/GetServiceHierarchy/${userId}`,
  }).then((res) =>{
    const { code, result } = res;
    code !== 0 ? callback([]) : callback(result);
  });
};

export const getServiceAttributes = ({serviceId, callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL}/ServiceAttribute/${serviceId}`,
  }).then((res) =>{
    callback(res.attributesList);
  });
};

export const addAppointment = ({
  custID,
  providerId,
  providerEmail,
  bookingdate,
  isfreeConsultation,
  serviceId,
  duration,
  price,
  flatDiscount,
  enddate,
  notes,
  userId,
  noOfSession,
  form,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Appointments/addappointment_new`,
    verb: "POST",
    payload: JSON.stringify({
      "customerid": custID,
      "providerid": providerId,
      "provideremail": providerEmail,
      "addressid": 0,
      "bookingdate": bookingdate,
      "genderpreference": "both",
      "notes": notes,
      "isfreeconsultation": isfreeConsultation,
      "deviceplatform": "web",
      "devicename": "web",
      "adminid": parseInt(userId),
      "serviceids": serviceId.toString(),
      "numberofsessions": noOfSession,
      "services": [
        {
          "id": serviceId,
          "duration": duration,
          "price": price,
          "discountedprice": flatDiscount,
          "starttime": bookingdate,
          "endtime": enddate,
          "discounttype": "",
          "attributes": form
        }
      ]
    }),
  }).then((res) => {
    console.log("result:",res)
    callback(res)
    // const { code, result } = res;
    // code !== 0 ? callback([]) : callback(result);
  });
};

//sessionbooking 
export const SessionBooking = ({
  cartId,
  noOfSession
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/BookingAttachments/SaveSessionBookings`,
    verb: "POST",
    payload: JSON.stringify({
      cartId: cartId,
      numberOfSessions: noOfSession,
    }),
  });
}

