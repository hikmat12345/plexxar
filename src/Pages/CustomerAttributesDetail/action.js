import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const GetAppointmentDetails = ({eventId, sessionId, callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Appointments/GetAppointmentDetails/${eventId}/${sessionId}`,
  }).then((res) =>{
    const { code, result } = res;
    code !== 0 ? callback([]) : callback(result);
  });
};
