//libs
/* eslint-disable */
import React, { useContext } from "react";
import { FAEButton, FAEText } from "@plexaar/components";

//src
import history from "../../history";

//scss
import "./HomePage.scss";
import { getFileSrcFromPublicFolder } from "../../utils";
import { UserContext } from "../../Contexts/userContext";
import { Avatar } from "@mui/material";
import SideNotification from "../MyComponent/SideNotification";

const HomePage = () => {
  const [userId, setUserId] = useContext(UserContext);
  return (
    <div className="home-page-container">
      <SideNotification />  
      {!userId && (
        <div className="home-page-heaader">
          <div className="head-inside">
            <div className="head-left">
              <img src="/img/join.png" className="join-img" />
              <img src="/img/expert.png" className="expert-img" />
            </div>
            <div className="head-right">
              <FAEText
                className="head-right-text"
                onClick={() => history.push("/sign-in")}
              >
                Sign In
              </FAEText>
              <Avatar />
            </div>
          </div>
        </div>
      )}
      <div className="homepage-section-1">
        <div className="homepage-section-1-row-1">
          <FAEText subHeading className="row-1-head">
            become an
          </FAEText>
          <FAEText subHeading bold className="row-1-head">
            Expert Partner
          </FAEText>
        </div>
        <div className="homepage-section-1-row-2">
          <img
            src="img/homepage/professional.png"
            className="professional-img"
          />
          <div className="row-2-text">
            <div className="row-2-text-top">
              <FAEText className="top-text1">Get</FAEText>
              <FAEText className="top-text2" bold>
                Booked Clients
              </FAEText>
              <FAEText className="top-text3">
                directly to your Mobile App
              </FAEText>
              <FAEButton
                className="register-btn"
                onClick={() => history.push("/sign-up")}
              >
                REGISTER TO JOIN
              </FAEButton>
            </div>
            <div className="row-2-text-last">
              <FAEText className="top-text3 top-text4">
                Any <span style={{ fontWeight: "bold" }}>Service</span> , Any
                <span style={{ fontWeight: "bold" }}>Time</span>, Any
                <span style={{ fontWeight: "bold" }}>Where</span>
              </FAEText>
            </div>
          </div>
          <div className="row-2-text-img">
            <img src="img/homepage/row1-group.png" className="laptop-img" />
            {/* <img src="img/homepage/mobile.png" className="mobile-img-mb" /> */}
          </div>
        </div>
        <div className="homepage-section-1-row-3">
          <div className="row-3-left">
            <div>
              <img src="img/homepage/Group-394.png" className="sec-3-icon" />
              <FAEText bold className="font24">
                {" "}
                Signup Now
              </FAEText>
              <FAEText className="font24">to become Expert Partner</FAEText>
            </div>
            <div>
              <img src="img/homepage/Group-395.png" className="sec-3-icon" />
              <FAEText bold className="font24">
                {" "}
                Submit
              </FAEText>
              <FAEText className="font24">
                your documents to get verified
              </FAEText>
            </div>
            <div>
              <img src="img/homepage/Group-396.png" className="sec-3-icon" />
              <FAEText bold className="font24">
                Get Approved
              </FAEText>
              <FAEText className="font24">
                to receive bookings on your mobile
              </FAEText>
            </div>
          </div>
          {/* <div className="row-3-right">
            <img src="img/homepage/mobile.png" />
          </div> */}
        </div>
      </div>
      <img src="img/homepage/line.png" width="100%" height="70px" />
      {/* <div className="home-page-section-1">
        <div className="home-page-section-1-text">
          <FAEText className="home-page-heading">
            Streamline customer journey by{" "}
            <span className="desktop-view">Automating</span>
          </FAEText>
          <FAEText className="home-page-sub-heading">
            <span className="home-page-heading mobile-view">
              your business{" "}
            </span>{" "}
            Process
          </FAEText>
          <FAEText className="home-page-text2">
            An all-in-one solution to manage your sales teams, projects, and
            customer interactions.
          </FAEText>
        </div>
        <img src="img/img1.jpg" alt="HomeImage" height="auto" />
      </div> */}

      <div className="home-page-section-2">
        {/* <img
          className="home-page-section-2-img"
          src="img/side-style 1.png"
          alt="sideImg"
        /> */}

        <div className="top-images">
          <img
            src={getFileSrcFromPublicFolder("plexaar_logo.png")}
            className="top-img-logo"
          />
          <img
            src="img/homepage/calendar-1.png"
            className="top-img-calendar-1"
          />
        </div>
        <div className="home-page-section-2-text">
          <FAEText className="home-page-heading">
            Centralize all your appointments & customer data
            <span className="home-page-sub-heading"> in one place.</span>
            {/* <span className="desktop-view"> </span> */}
          </FAEText>
          {/* <FAEText className="home-page-sub-heading">
            <span className="home-page-heading mobile-view">customer data</span>{" "}
            in one place.
          </FAEText> */}

          <div className="home-page-section-2-text-row">
            <div className="home-page-section-2-text-col">
              <img src="img/1 1.png" alt="icon1-img" className="icon-img" />
              <div>
                <FAEText className="home-page-text-heading">
                  A 360° View of Your Leads
                </FAEText>
                <FAEText className="home-page-text">
                  Increase customer interactions, reduce costs and scale your
                  business with the world's leading CRM. A comprehensive
                  resource that allows you to collect, process, and analyze the
                  leads & sales data.
                </FAEText>
              </div>
            </div>
            <div className="home-page-section-2-text-col">
              <img src="img/2 1.png" alt="icon12img" className="icon-img" />
              <div>
                <FAEText className="home-page-text-heading">
                  Intelligent Scheduling & Time Management
                </FAEText>
                <FAEText className="home-page-text">
                  Use Calendar view to schedule all of your appointments, add
                  reminders and share details with other users. Take advantage
                  of location-based grouping tools to view upcoming appointments
                  by location.
                </FAEText>
              </div>
            </div>

            <div className="home-page-section-2-text-col">
              <img src="img/4 1.png" alt="icon12img" className="icon-img" />
              <div>
                <FAEText className="home-page-text-heading">
                  Measure Your Business KPIs
                </FAEText>
                <FAEText className="home-page-text">
                  Generate tailored reports for key areas of your business,
                  including sales, lead reports, job handling, how your business
                  is performing against KPIs, and so on.
                </FAEText>
              </div>
            </div>
          </div>

          {/* <div className="home-page-section-2-text-row">
            <div className="home-page-section-2-text-col">
              <img src="img/3 1.png" alt="icon1-img" />
              <div>
                <FAEText className="home-page-text-heading">
                  Powerful Workforce Management
                </FAEText>
                <FAEText className="home-page-text">
                  Give your team a collaborative boost with Plexaar. Hand out
                  projects, monitor progress, and cut the stress in half. Get
                  the most out of your team & get more done in less time.
                </FAEText>
              </div>
            </div>
            <div className="home-page-section-2-text-col last-col-background">
              <img src="img/4 1.png" alt="icon12img" />
              <div>
                <FAEText className="home-page-text-heading">
                  Measure Your Business KPIs
                </FAEText>
                <FAEText className="home-page-text">
                  Generate tailored reports for key areas of your business,
                  including sales, lead reports, job handling, how your business
                  is performing against KPIs, and so on.
                </FAEText>
              </div>
            </div>
          </div> */}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <FAEButton
            className="home-page-section-2-btn"
            onClick={() => history.push({ pathname: "/sign-up" })}
          >
            Get Started
          </FAEButton>
        </div>
      </div>

      <div className="home-page-section-3">
        <FAEText className="home-page-heading">Track every detail</FAEText>
        <FAEText className="home-page-sub-heading">
          Every stage of the process in one place
        </FAEText>

        <div className="home-page-section-3-text">
          <div>
            <img src="img/icon1.png" alt="icon1-img" />
            <FAEText className="home-page-text-heading">
              Easy monitoring
            </FAEText>
            <FAEText className="home-page-text">
              Round the clock monitoring and management of everything with
              convenience.
            </FAEText>
          </div>

          <div>
            <img src="img/icon2.png" alt="icon2-img" />
            <FAEText className="home-page-text-heading">
              Complete visibility
            </FAEText>
            <FAEText className="home-page-text">
              Get a 360-degree view of all your business operations to save
              valuable time.
            </FAEText>
          </div>

          <div>
            <img src="img/icon3.png" alt="icon3-img" />
            <FAEText className="home-page-text-heading">
              Anywhere Anytime access
            </FAEText>
            <FAEText className="home-page-text">
              Add projects, make changes, assign tasks, communicate, and a lot
              more anywhere, anytime.
            </FAEText>
          </div>
        </div>
      </div>

      <div className="home-page-section-4">
        <div className="home-page-section-4-text">
          <div className="home-page-section-4-heading">
            <FAEText className="home-page-heading">
              Say goodbye to sluggish
            </FAEText>
            <FAEText className="home-page-sub-heading">manual work</FAEText>
          </div>
          <FAEText className="home-page-text2">
            Plexaar lets you automate all your processes like storage, tracking,
            interacting with clients & a lot more.
          </FAEText>
        </div>

        <img
          className="home-page-section-4-img"
          src="img/homepage/calendar-2.png"
          alt="calendar-img"
        />
      </div>

      <div className="home-page-section-5">
        <img
          src="img/meeting.png"
          alt="meeting-img"
          width="100%"
          height="auto"
        />

        <div className="home-page-section-5-text">
          <FAEText className="home-page-heading">
            Empower your business and bolster{" "}
            <span className="desktop-view"></span>
          </FAEText>
          <FAEText className="home-page-sub-heading">
            <span className="home-page-heading mobile-view">your sales </span>{" "}
            experience.
          </FAEText>

          <FAEText className="home-page-text2 mobile-view-none">
            Having Plexaar by your side, lets you easily view every stage of
            your sales funnel in a lucid and simple interface. By integrating
            this highly customizable CRM into your business, not only are you
            improving your sales but also enhancing your customer support and,
            ultimately, your business.
          </FAEText>
        </div>
      </div>

      <div className="home-page-section-6">
        <div className="home-page-section-6-text">
          <FAEText className="home-page-heading" primary>
            Use Intelligent CRM Made for
          </FAEText>
          <FAEText className="home-page-sub-heading" primary>
            Your Business
          </FAEText>
        </div>
        <FAEText
          className="home-page-text2"
          primary
          style={{ textAlign: "center" }}
        >
          See how Plexaar can uplift your business
        </FAEText>
        <FAEButton
          className="home-page-section-6-btn"
          onClick={() => history.push({ pathname: "/sign-up" })}
        >
          Get Started
        </FAEButton>
      </div>
    </div>
  );
};

export default HomePage;
