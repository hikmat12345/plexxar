//libs
/* eslint-disable */
import React, { Suspense, lazy, useContext, useEffect, useState } from "react";
import { Router, Switch } from "react-router-dom";
import { FAEGuardedRoute, FAELoading } from "@plexaar/components";

//src
import history from "./history";
import {
  getCookies,
  getFileSrcFromPublicFolder,
  getUserScreePermission,
  hasCookie,
} from "./utils";
import { UserContext } from "./Contexts/userContext";
import Layout from "./Pages/Layout";
import { UserPermissionsContext } from "./Contexts/userPermissionsContext";

//scss
import "./App.scss";
// import ConsentForm from "./Pages/AppointmentDetailPage/ConsentForm/ConsentForm";
import { SocketService } from "./Services/SocketService";
import { useDispatch } from "react-redux";
import { Offline, Online } from "react-detect-offline";
import OfflinePage from "./Pages/OfflinePage";

//components-importing
const SignInPage = lazy(() => import("./Pages/SignInPage"));
const SignUpPage = lazy(() => import("./Pages/SignUpPage"));
const NotFound = lazy(() => import("./Pages/NotFound"));
// const OfflinePage = lazy(() => import("./Pages/OfflinePage"));
const CodeVerificationPage = lazy(() => import("./Pages/CodeVerificationPage"));
const UserStatusPage = lazy(() => import("./Pages/UserStatusPage"));
const UserStatusStaff = lazy(() => import("./Pages/UserStatusStaff"));
const UserStatusInnerStaff = lazy(() => import("./Pages/UserStatusInnerStaff"));
const UpdateProfilePage = lazy(() => import("./Pages/UpdateProfilePage"));
const QuestionsAnswers = lazy(() => import("./Pages/QuestionsAnswers"));
const StaffQuestionsAnswers = lazy(() =>
  import("./Pages/QuestionsAnswersStaff")
);
const ConsentForm = lazy(() => import("./Pages/ConsentForm"));
const WelcomePage = lazy(() => import("./Pages/WelcomePage"));
const SchedulePage = lazy(() => import("./Pages/SchedulePage"));
const StaffSchedulePage = lazy(() =>
  import("./Pages/StaffPofile/StaffSchedulePage")
);
const WorkingAddresses = lazy(() => import("./Pages/WorkingAddresses"));
const StaffWorkingAddresses = lazy(() =>
  import("./Pages/StaffPofile/StaffAddresses")
);

const AddOrUpdateWorkingAddress = lazy(() =>
  import("./Pages/AddOrUpdateWorkingAddress")
);
const AddOrUpdateResidentialAddress = lazy(() =>
  import("./Pages/AddOrUpdateResidentialAddress")
);
const AddOrUpdateStaffWorkingAddress = lazy(() =>
  import("./Pages/StaffPofile/AddOrUpdateStaffWorkingAddress")
);
const AddOrUpdateStaffResidentialAddress = lazy(() =>
  import("./Pages/StaffPofile/AddOrUpdateStaffResidentialAddress")
);
const IndustryPage = lazy(() => import("./Pages/IndustryPage"));
const SubIndustryPage = lazy(() => import("./Pages/IndustryPageSub"));
const StaffIndustryPage = lazy(() =>
  import("./Pages/StaffPofile/StaffIndustryPage")
);
const AddServicesPage = lazy(() => import("./Pages/AddServicesPage"));
const AddSubServicesPage = lazy(() => import("./Pages/AddSubServicesPage"));
const AddStaffServicesPage = lazy(() =>
  import("./Pages/StaffPofile/AddStaffServicesPage")
);
const AddServiceLocation = lazy(() =>
  import("./Pages/AddServicesPage/ServiceLocation")
);
const AddStaffServiceLocation = lazy(() =>
  import("./Pages/StaffPofile/AddStaffServicesPage/StaffServiceLocation")
);
const UserServicesPage = lazy(() => import("./Pages/UserServicesPage"));
const StaffServicesPage = lazy(() =>
  import("./Pages/StaffPofile/StaffServices")
);
const HomePage = lazy(() => import("./Pages/HomePage"));
const UserAppointmentsCalendar = lazy(() =>
  import("./Pages/UserAppointmentsCalendar")
);
const BusinessStaffPage = lazy(() => import("./Pages/BusinessStaffPage"));
const BussinessStaffPofile = lazy(() => import("./Pages/StaffPofile"));
const AddStaffPage = lazy(() => import("./Pages/AddStaffPage"));
const AddCustomerPage = lazy(() => import("./Pages/AddCustomerPage"));
const CustomerExist = lazy(() =>
  import("./Pages/AddCustomerPage/CustomerExist")
);
const CustomerList = lazy(() => import("./Pages/CustomerList"));
const CustomerBooking = lazy(() => import("./Pages/CustomerBooking"));
const ProviderServices = lazy(() => import("./Pages/ProviderServices"));
const ProviderSubServices = lazy(() => import("./Pages/ProviderSubServices"));
const BookingSession = lazy(() => import("./Pages/BookingSessionPage"));
const ServiceAttribute = lazy(() => import("./Pages/ServiceAttribute"));
const AppointmentPayment = lazy(() => import("./Pages/AppointmentPayment"));
const AddPaymentCard = lazy(() => import("./Pages/AddPaymentCard"));
const CalendarWebView = lazy(() => import("./Pages/CalendarWebView"));
const CalendarWebViewIso = lazy(() => import("./Pages/CalendarWebViewIos"));
const AppointmentDetail = lazy(() => import("./Pages/AppointmentDetailPage"));
const ProfileDetail = lazy(() =>
  import("./Pages/AppointmentDetailPage/Profile/ProfileDetail")
);
const CustomerAttributeDetail = lazy(() =>
  import("./Pages/CustomerAttributesDetail")
);
const CustomerProductsDetail = lazy(() =>
  import("./Pages/CustomerProductsDetail")
);
const CustomerAttributesDetail = lazy(() =>
  import("./Pages/CustomerProductAttributes")
);
const CustomerSessionDetail = lazy(() =>
  import("./Pages/CustomerSessionDetail")
);
const CustomerNotes = lazy(() => import("./Pages/CustomerNotes"));
const ProductPage = lazy(() => import("./Pages/ProductPage"));
const ProductsCartPage = lazy(() => import("./Pages/ProductsCartPage"));
const AppointmentSummary = lazy(() => import("./Pages/AppointmentSummaryPage"));
const ProductAttributes = lazy(() => import("./Pages/ProductAttributesPage"));
const PasswordVerifyCode = lazy(() =>
  import("./Pages/SignInPage/ForgetPasswordCodeVerify")
);
const VerifyCustomer = lazy(() =>
  import("./Pages/AppointmentDetailPage/CodeVerification/VerifyCustomer")
);
const VerifyNewCustomer = lazy(() =>
  import("./Pages/AddCustomerPage/VerifyNewCustomer")
);
const NewPassword = lazy(() => import("./Pages/SignInPage/NewPassword"));
const authRedirectPath = "/sign-in";
const userAlreadyLoggedInRedirect = "/";
const Inbox = lazy(() => import("./Pages/Inbox"));
const SwitchCountry = lazy(() => import("./Pages/SwitchCountry"));
const PaymentMethod = lazy(() => import("./Pages/PaymentMethod"));

const App = () => {
  const [failedStatusPath, setFailedStatusPath] = useState("");
  const [userId] = useContext(UserContext);
  const { screenStatus } = useContext(UserPermissionsContext);
  const [online, setOnline] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    if (hasCookie("customer_details")) {
      SocketService.init(dispatch);
      window.initScript(getCookies("customer_details"));
    }
  }, []);

  useEffect(() => {
    setFailedStatusPath(getUserScreePermission(screenStatus));
    if (userId && window.location.pathname === "/") {
      history.push({
        pathname: getUserScreePermission(screenStatus),
        state: { userId, next: "/user-status1" },
      });
    }
  }, [screenStatus]);
  window.addEventListener("online", () => {
    setOnline(true);
  });
  window.addEventListener("offline", () => {
    setOnline(false);
  });
  return (
    <>
      {/* <Online> */}
      {/* {online ? ( */}
      <Layout>
        <Router history={history}>
          <Suspense
            fallback={
              <FAELoading
                loaderImage={getFileSrcFromPublicFolder("loader2.webm")}
                type="video"
              />
            }
          >
            {failedStatusPath !== "" ? (
              <Switch>
                <FAEGuardedRoute
                  path="/"
                  component={HomePage}
                  exact
                  auth={true}
                  status={true}
                  redirectPath={userAlreadyLoggedInRedirect}
                  failedStatusPath={userAlreadyLoggedInRedirect}
                />
                <FAEGuardedRoute
                  path="/update-profile"
                  component={UpdateProfilePage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 0 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/user-status"
                  component={UserStatusPage}
                  exact
                  auth={userId && true}
                  status={screenStatus === 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-user-status"
                  component={UserStatusStaff}
                  exact
                  auth={userId && true}
                  status={screenStatus === 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-onboard"
                  component={UserStatusInnerStaff}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/questions-answers/:id"
                  component={QuestionsAnswers}
                  exact
                  auth={userId && true}
                  status={screenStatus === 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-questions-answers/:id"
                  component={StaffQuestionsAnswers}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/welcome-onboard"
                  component={WelcomePage}
                  exact
                  auth={userId && true}
                  status={screenStatus === 2 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/your-schedule"
                  component={SchedulePage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-schedule"
                  component={StaffSchedulePage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/product-page"
                  component={ProductPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 2 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/product-cart"
                  component={ProductsCartPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 2 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/appointment-summary"
                  component={AppointmentSummary}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 2 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/payment-method"
                  component={PaymentMethod}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 2 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/product-attributes"
                  component={ProductAttributes}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 2 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/your-working-addresses"
                  component={WorkingAddresses}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-working-addresses"
                  component={StaffWorkingAddresses}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/your-working-addresses/:action"
                  component={AddOrUpdateWorkingAddress}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/your-residential-addresses/:action"
                  component={AddOrUpdateResidentialAddress}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-working-addresses/:action"
                  component={AddOrUpdateStaffWorkingAddress}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-residential-addresses/:action"
                  component={AddOrUpdateStaffResidentialAddress}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/your-services"
                  component={UserServicesPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-services"
                  component={StaffServicesPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/industry"
                  component={IndustryPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/:industry/sub-industry"
                  component={SubIndustryPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-industry"
                  component={StaffIndustryPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/add-services"
                  component={AddServicesPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath8={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/add-sub-services"
                  component={AddSubServicesPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath8={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/add-staff-services"
                  component={AddStaffServicesPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/add-services-location"
                  component={AddServiceLocation}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/add-staff-services-location"
                  component={AddStaffServiceLocation}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/user-appointments"
                  component={UserAppointmentsCalendar}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/your-staff"
                  component={BusinessStaffPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/staff-profile"
                  component={BussinessStaffPofile}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/add-staff"
                  component={AddStaffPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 1 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />

                <FAEGuardedRoute
                  path="/add-client"
                  component={AddCustomerPage}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/customer-exist"
                  component={CustomerExist}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/customer-list"
                  component={CustomerList}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/customer-booking"
                  component={CustomerBooking}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />

                <FAEGuardedRoute
                  path="/provider-services"
                  component={ProviderServices}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/sub-services"
                  component={ProviderSubServices}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/booking-session"
                  component={BookingSession}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/service-attribute"
                  component={ServiceAttribute}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/appointment-payment"
                  component={AppointmentPayment}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/appointment-payment/add-card"
                  component={AddPaymentCard}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/appointment-detail"
                  component={AppointmentDetail}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/appointment-profile"
                  component={ProfileDetail}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />

                <FAEGuardedRoute
                  path="/consent-form"
                  component={ConsentForm}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/products-detail"
                  component={CustomerProductsDetail}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/products-detail/attributes"
                  component={CustomerAttributesDetail}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/attributes-details"
                  component={CustomerAttributeDetail}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/session-details"
                  component={CustomerSessionDetail}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/verify-customer"
                  component={VerifyCustomer}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/verify-new-customer"
                  component={VerifyNewCustomer}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/customer-notes"
                  component={CustomerNotes}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/inbox"
                  component={Inbox}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute
                  path="/switch-country"
                  component={SwitchCountry}
                  exact
                  auth={userId && true}
                  status={screenStatus >= 3 ? true : false}
                  redirectPath={authRedirectPath}
                  failedStatusPath={failedStatusPath}
                />
                <FAEGuardedRoute path="*" render={() => <NotFound />} />
              </Switch>
            ) : (
              <Switch>
                <FAEGuardedRoute
                  path="/"
                  component={HomePage}
                  // component={OfflinePage}
                  exact
                  auth={true}
                  status={true}
                  redirectPath={userAlreadyLoggedInRedirect}
                  failedStatusPath={userAlreadyLoggedInRedirect}
                />
                <FAEGuardedRoute
                  path="/sign-up"
                  component={SignUpPage}
                  exact
                  auth={userId ? false : true}
                  status={true}
                  redirectPath={userAlreadyLoggedInRedirect}
                  failedStatusPath={userAlreadyLoggedInRedirect}
                />
                <FAEGuardedRoute
                  path="/sign-in"
                  component={SignInPage}
                  exact
                  auth={userId ? false : true}
                  status={true}
                  failedStatusPath={userAlreadyLoggedInRedirect}
                  redirectPath={userAlreadyLoggedInRedirect}
                />
                <FAEGuardedRoute
                  path="/code-verification"
                  component={PasswordVerifyCode}
                  exact
                  auth={userId ? false : true}
                  status={true}
                  failedStatusPath={userAlreadyLoggedInRedirect}
                  redirectPath={userAlreadyLoggedInRedirect}
                />
                <FAEGuardedRoute
                  path="/reset-password"
                  component={NewPassword}
                  exact
                  auth={userId ? false : true}
                  status={true}
                  failedStatusPath={userAlreadyLoggedInRedirect}
                  redirectPath={userAlreadyLoggedInRedirect}
                />
                <FAEGuardedRoute
                  path="/verify-account"
                  component={CodeVerificationPage}
                  exact
                  auth={userId ? false : true}
                  status={true}
                  failedStatusPath={userAlreadyLoggedInRedirect}
                  redirectPath={userAlreadyLoggedInRedirect}
                />
                <FAEGuardedRoute
                  path="/calendar-webview"
                  component={CalendarWebView}
                  exact
                  auth={userId ? false : true}
                  status={true}
                  failedStatusPath={userAlreadyLoggedInRedirect}
                  redirectPath={userAlreadyLoggedInRedirect}
                />
                <FAEGuardedRoute
                  path="/calendar-webview-ios"
                  component={CalendarWebViewIso}
                  exact
                  auth={userId ? false : true}
                  status={true}
                  failedStatusPath={userAlreadyLoggedInRedirect}
                  redirectPath={userAlreadyLoggedInRedirect}
                />
                {!userId && (
                  <FAEGuardedRoute
                    path="/user-appointments"
                    component={UserAppointmentsCalendar}
                    exact
                    auth={userId && true}
                    status={screenStatus >= 3 ? true : false}
                    redirectPath={"/sign-in"}
                    failedStatusPath={"/sign-in"}
                  />
                )}
                {!userId && (
                  <FAEGuardedRoute path="*" render={() => <NotFound />} />
                )}
              </Switch>
            )}
          </Suspense>
        </Router>
      </Layout>
      {/* // ) : ( // <OfflinePage /> */}
      {/* // )} */}
      {/* </Online> */}
      {/* <Offline>
        <OfflinePage />
      </Offline> */}
    </>
  );
};

export default App;
