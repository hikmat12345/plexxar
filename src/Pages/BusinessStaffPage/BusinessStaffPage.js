//libs
import { FAEText, FAEButton } from "@plexaar/components";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CircleIcon from "@mui/icons-material/Circle";
import Switch from "@mui/material/Switch";

//src
import { ActiveInactiveStaff, getBusinessStaff } from "./actions";
import { getCookies, setCookies } from "../../utils";
import Loader from "../Loader";
import history from "../../history";

//scss
import "./BusinessStaffPage.scss";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const BusinessStaffPage = () => {
  const userId = getCookies("userId");
  const location = useLocation();
  const { from } = location.state;
  const [staffList, setStaffList] = useState([]);
  const isBusiness = getCookies("customer_details").isBusiness;
  const authToken = getCookies("customer_details").authToken;
  const columns = [
    {
      field: "accountNumber",
      headerName: "Account No.",
      width: 130,
      sortable: true,
      renderCell: (field) => {
        return (
          <FAEText
            className="pointer"
            onClick={() => {
              console.log(field);
              setCookies("staffAuth", field.row.authToken);
              setCookies("staffDetail", field.row);
              from === "signup"
                ? history.push({
                    pathname: "/staff-user-status",
                    state: {
                      userId: field.id,
                    },
                  })
                : history.push({
                    pathname: "/staff-onboard",
                    state: {
                      userId: field.id,
                    },
                  });
            }}
          >
            {field.formattedValue}
          </FAEText>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      //editable: true,
      width: 180,
      renderCell: (field) => {
        return (
          <FAEText
            className="pointer"
            onClick={() => {
              console.log(field);
              setCookies("staffAuth", field.row.authToken);
              setCookies("staffDetail", field.row);
              from === "signup"
                ? history.push({
                    pathname: "/staff-user-status",
                    state: {
                      userId: field.id,
                    },
                  })
                : history.push({
                    pathname: "/staff-onboard",
                    state: {
                      userId: field.id,
                    },
                  });
            }}
          >
            {field.formattedValue}
          </FAEText>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      //editable: true,
      width: 230,
      renderCell: (field) => {
        return (
          <FAEText
            className="pointer"
            onClick={() => {
              console.log(field);
              setCookies("staffAuth", field.row.authToken);
              setCookies("staffDetail", field.row);
              from === "signup"
                ? history.push({
                    pathname: "/staff-user-status",
                    state: {
                      userId: field.id,
                    },
                  })
                : history.push({
                    pathname: "/staff-onboard",
                    state: {
                      userId: field.id,
                    },
                  });
            }}
          >
            {field.formattedValue}
          </FAEText>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      width: 180,
      renderCell: (field) => {
        return (
          <>
            {field.formattedValue ? (
              <CircleIcon sx={{ color: "green" }} />
            ) : (
              <CircleIcon sx={{ color: "red" }} />
            )}
            <FAEText
              className="pointer"
              onClick={() => {
                setCookies("staffAuth", field.row.authToken);
                setCookies("staffDetail", field.row);
                from === "signup"
                  ? history.push({
                      pathname: "/staff-user-status",
                      state: {
                        userId: field.id,
                      },
                    })
                  : history.push({
                      pathname: "/staff-onboard",
                      state: {
                        userId: field.id,
                      },
                    });
              }}
            >
              {field.formattedValue ? "Complete" : "Incomplete"}
            </FAEText>
          </>
        );
      },
    },
    {
      field: "isApproved",
      headerName: "Approved",
      sortable: false,
      width: 130,
      disableClickEventBubbling: true,
      renderCell: (field) => {
        return (
          <>
            {/* {field.formattedValue ? (
              <CircleIcon sx={{ color: "green" }} />
            ) : (
              <CircleIcon sx={{ color: "yellow" }} />
            )} */}
            <FAEText
              className="pointer"
              onClick={() => {
                setCookies("staffAuth", field.row.authToken);
                setCookies("staffDetail", field.row);
                from === "signup"
                  ? history.push({
                      pathname: "/staff-user-status",
                      state: {
                        userId: field.id,
                      },
                    })
                  : history.push({
                      pathname: "/staff-onboard",
                      state: {
                        userId: field.id,
                      },
                    });
              }}
            >
              {field.formattedValue ? "Yes" : "No"}
            </FAEText>
          </>
        );
      },
    },
    {
      field: "isActive",
      headerName: "Active",
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (field) => {
        return (
          <>
            <Switch
              disabled={!field.row.isApproved}
              defaultChecked={field.row.isActive}
              onChange={(e) => {
                ActiveInactiveStaff({
                  businessId: parseInt(userId),
                  authToken,
                  providerId: field.row.id,
                  isActive: e.target.checked,
                  callback: (res) => {
                    if (res.code === 0) {
                      getBusinessStaff({
                        userId,
                        callback: (res) => {
                          setStaffList(
                            res.map((data) => {
                              return {
                                ...data,
                                status:
                                  !data.hasServices ||
                                  !data.hasSchedule ||
                                  !data.hasWorkingAddress
                                    ? false
                                    : true,
                              };
                            })
                          );
                        },
                      });
                    } else {
                      alert(res.message);
                    }
                  },
                });
              }}
            />
          </>
        );
      },
    },
    // {
    //   field: "option",
    //   headerName: "Option",
    //   sortable: false,
    //   width: 140,
    //   disableClickEventBubbling: true,
    //   renderCell: (field) => {
    //     return (
    //       <FAEButton
    //         className="pointer"
    //         onClick={() => {
    //           if (window.confirm("Are you sure you want to delete ?")) {
    //             deleteBusinessStaff({
    //               userId: field.row.id,
    //               callback: (res) => {
    //                 if (res.statusCode === 0) {
    //                   setLoading(true);
    //                   getBusinessStaff({
    //                     userId,
    //                     callback: (res) => {
    //                       setStaffList(res);
    //                       setLoading(false);
    //                     },
    //                   });
    //                 } else {
    //                   alert(res.message);
    //                 }
    //               },
    //             });
    //           }
    //         }}
    //       >
    //         Delete
    //       </FAEButton>
    //     );
    //   },
    // },
  ];
  useEffect(() => {
    getBusinessStaff({
      userId,
      callback: (res) => {
        setStaffList(
          res.map((data) => {
            return {
              ...data,
              status:
                !data.hasServices ||
                !data.hasSchedule ||
                !data.hasWorkingAddress
                  ? false
                  : true,
            };
          })
        );
        // setStaffList(res);
        setLoading(false);
      },
    });
  }, [userId]);
  console.log(staffList);
  const [loading, setLoading] = useState(true);
  if (isBusiness) {
    return (
      <div className="your-staff-main">
        <div className="staff-page-main-container dpt dpb">
          {/* <Title /> */}
          {/* <FAETitle
            logo={getFileSrcFromPublicFolder("/plexaar_logo.png")}
            logoWidth="140px"
          /> */}
          <div className="staff-page-main-wrapper">
            <FAEText subHeading bold>
              Your Staff
            </FAEText>
            <div className="add-staff-button">
              {from === "signup" ? (
                <img
                  src="/onboard/arrow-back.svg"
                  width="40px"
                  alt="back"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    history.push({
                      pathname: `/user-status`,
                    })
                  }
                />
              ) : (
                <div></div>
              )}
              <FAEButton
                onClick={() =>
                  history.push({
                    pathname: "/add-staff",
                    state: { next: history.location.pathname, from },
                  })
                }
              >
                Add Staff
              </FAEButton>
            </div>
            {loading && <Loader />}
            {!loading && (
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={staffList}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Loader />
      </>
    );
  }
};

export default BusinessStaffPage;
