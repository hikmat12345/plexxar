import { fetchAction } from "../../fetchAction";

const APP_BASE_URL_2 = process.env.REACT_APP_BASE_URL_2;

//stripe call /api/Payment/CreatePaymentMethod
export const CreatePaymentMethod = ({
  cardNumber,
  name,
  expMonth,
  expYear,
  cvc,
  address,
  addressLine,
  city,
  country,
  state,
  postCode,
  customerEmail,
  customerName,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Payment/CreatePaymentMethod`,
    verb: "POST",
    payload: JSON.stringify({
      "billingAddress": {
        "city": city,
        "country": country,
        "line1": address,
        "line2": addressLine,
        "postalCode": 'sw1r3',
        "state": state
      },
      "card": {
        "cardHolderName": name,
        "cvc": cvc,
        "expMonth": expMonth,
        "expYear": expYear,
        "number": cardNumber,
        "type": "card"
      },
      "personalInformation": {
        "email": customerEmail,
        "name": customerName,
        "phone": ""
      }
    }),
  }).then((res) => {
    callback(res);
  });
};

// add card  
export const saveCardData = ({
  paymentMethodId,
  customerFirstname,
  customerLastname,
  customerAccount,
  callback,
}) => {
  return fetchAction({
    endpoint: `${APP_BASE_URL_2}/Payment/addpaymentcard`,
    verb: "POST",
    payload: JSON.stringify({
      paymentMethodId: paymentMethodId,
      firstName: customerFirstname,
      surname: customerLastname,
      postalCode: "sw1r3",
      accountNumber: customerAccount
    }),
  }).then((res) => {
    callback(res);
    // const { code, result } = res;
    // code !== 0 ? callback([]) : callback(result);
  });
};


