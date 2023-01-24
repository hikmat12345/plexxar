import { fetchAction } from "../../fetchAction";
import jsonToFormData from "json-form-data";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

export const GetAppointmentDetails = ({ bookingId, callback }) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/BookingAttachments/GetBookingAttachments?BookingId=${bookingId}`,
  }).then((res) => callback(res));
};

// upload video and image
export const UploadAttachments = (
  bookingId,
  userId,
  filetype,
  file,
  response
) => {
  const formData = {
    bookingid: bookingId,
    userid: userId,
    filetype: filetype,
    filetoupload: file,
  };

  let url = APP_BASE_URL_2 + "/BookingAttachments/UploadAttachments";

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
///api/BookingAttachments/SaveProviderNotes

export const SaveProviderNotes = ({
  bookingId,
  providerId,
  expNotes,
  date,
  time,
  attachmentList,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/BookingAttachments/SaveProviderNotes`,
    verb: "POST",
    payload: JSON.stringify({
      bookingId: bookingId,
      providerId: providerId,
      notes: expNotes,
      date: date,
      time: time,
      attachmentList: attachmentList,
    }),
  }).then((res) => callback(res));
};
