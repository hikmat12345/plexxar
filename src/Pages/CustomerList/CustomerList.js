//libs
/* eslint-disable*/
import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FAEText, FAEButton, FAETextField } from "@plexaar/components";

//srcq
import { getCustomerByBusinessId } from "./actions";
import Loader from "../Loader";
import { getCookies, getUniqueData } from "../../utils";
import history from "../../history";
import "./CustomerList.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const columns = [
  // {
  //   field: "accountNumber",
  //   headerName: "Account #",
  //   sortable: true,
  //   width: 230,
  //   renderCell: (field) => {
  //     return <FAEText className="pointer">{field.formattedValue}</FAEText>;
  //   },
  // },
  // {
  //   field: "fullName",
  //   headerName: "Name",
  //   sortable: false,
  //   width: 230,
  //   valueGetter: (params) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
  {
    field: "firstName",
    headerName: "First Name",
    sortable: true,
    width: 200,
    renderCell: (field) => {
      return <FAEText className="pointer">{field.formattedValue}</FAEText>;
    },
  },
  {
    field: "lastName",
    headerName: "Last Name",
    sortable: true,
    width: 200,
    renderCell: (field) => {
      return <FAEText className="pointer">{field.formattedValue}</FAEText>;
    },
  },
  {
    field: "mobile",
    headerName: "Mobile no",
    sortable: false,
    width: 200,
    disableClickEventBubbling: true,
    renderCell: (field) => {
      return <FAEText className="pointer">{field.formattedValue}</FAEText>;
    },
  },
  {
    field: "email",
    headerName: "Email",
    sortable: true,
    width: 230,
    renderCell: (field) => {
      return <FAEText className="pointer">{field.formattedValue}</FAEText>;
    },
  },
  {
    field: "Created Off",
    headerName: "Profile",
    sortable: false,
    width: 120,
    disableClickEventBubbling: true,
    renderCell: (field) => {
      return (
        <FAEText
          className="pointer"
          onClick={() =>
            history.push({
              pathname: "/appointment-detail",
              state: {
                customerId: field.id,
                list: true,
              },
            })
          }
        >
          Profile
        </FAEText>
      );
    },
  },
  {
    field: "Created On",
    headerName: "detail",
    sortable: false,
    width: 120,
    disableClickEventBubbling: true,
    renderCell: (field) => {
      return (
        <FAEText
          className="pointer"
          onClick={() =>
            history.push({
              pathname: "/appointment-detail",
              state: {
                customerId: field.id,
                list: true,
              },
            })
          }
        >
          Booking details
        </FAEText>
      );
    },
  },
];

const CustomerList = () => {
  const userId = getCookies("userId");
  const userCountryId = getCookies("countryId");
  const [loading, setLoading] = useState(true);
  const [customerListdata, setcustomerListData] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState([]);
  const [customers, setCustomer] = useState([]);
  useEffect(() => {
    getCustomerByBusinessId({
      userId,
      userCountryId,
      callback: (res) => {
        if (res && !res?.error) {
          setcustomerListData(res?.customers);
          setCustomer(res?.customers);

          setLoading(false);
        } else {
          setLoading(false);
        }
      },
    });
  }, [userId]);

  const [value, setValue] = useState("");

  const filterItems = (queryText, customerArray) => {
    var query = queryText.toLowerCase();

    let listitems = [];

    // For First Name
    const FistName = customerArray.filter((item) => {
      return (
        item.firstName !== null &&
        item.firstName.toLowerCase().lastIndexOf(query, 0) >= 0
      );
    });

    if (FistName.length > 0) {
      listitems = listitems.concat(FistName);
    }
    // For Last Name
    const LastName = customerArray.filter((item) => {
      return (
        item.lastName !== null &&
        item.lastName.toLowerCase().lastIndexOf(query, 0) >= 0
      );
    });
    if (LastName.length > 0) {
      listitems = listitems.concat(LastName);
    }

    // For Email
    const Email = customerArray.filter((item) => {
      return (
        item.email !== null &&
        item.email.toLowerCase().lastIndexOf(query, 0) >= 0
      );
    });
    if (Email.length > 0) {
      listitems = listitems.concat(Email);
    }

    // For AccountNo
    const Account = customerArray.filter((item) => {
      return (
        item.accountNumber !== null &&
        item.accountNumber.toLowerCase().lastIndexOf(query, 0) >= 0
      );
    });
    if (Account.length > 0) {
      listitems = listitems.concat(Account);
    }

    // let x = "0042";
    query = query.replace(/^0+/, "");

    // For mobile
    const Mobile = customerArray.filter((item) => {
      return (
        item.mobile !== null &&
        item.mobile.toLowerCase().lastIndexOf(query, 4) >= 0
      );
    });
    if (Mobile.length > 0) {
      listitems = listitems.concat(Mobile);
    }

    // console.log(getUniqueData(listitems, "id"));
    return getUniqueData(listitems, "id");
  };

  const filterFun = (text) => {
    setValue(text);
    if (text !== "") {
      const result = filterItems(text, customerListdata);
      console.log(customerListdata.length, result.length);
      setSearchCustomer(result);
    } else {
      setSearchCustomer([]);
    }
  };

  useEffect(() => {
    if (searchCustomer != undefined) {
      if (searchCustomer.length > 0) {
        setCustomer(searchCustomer);
      } else {
        if (value.length > 0) {
          setCustomer(searchCustomer);
        } else {
          setCustomer(customerListdata);
        }
      }
    } else {
      setSearchCustomer([]);
    }
  }, [searchCustomer]);

  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <div className="costomerContainer">
          <div className="customerHeader">
            <div className="heading">
              <h4>Customers</h4>
            </div>
            <div className="search">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={value}
                id="search"
                onChange={(e) => filterFun(e.target.value)}
              />
              <label htmlFor="search">
                <SearchOutlinedIcon />
              </label>
            </div>
          </div>
          <div className="customerList">
            <div style={{ height: "400px", width: "100%" }}>
              <DataGrid
                rows={customers.length > 0 ? customers : []}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerList;
