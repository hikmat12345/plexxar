import { useEffect, useState } from "react";
import { FAETextField } from "@plexaar/components";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

//src
import { GetBookedProductAttributes } from "./action";
import PlexaarContainer from "../PlexaarContainer";
import "./CustomerAttributesDetail.scss";
import Loader from "../Loader";

const CustomerAttributesDetail = () => {
  const location = useLocation();
  const itemId = location.state;
  const [notes, setNotes] = useState("");
  const [attributeList, setAttributeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetBookedProductAttributes({
      itemId,
      callback: (res) => {
        setAttributeList(res.attributes);
        setNotes(res.notes);
        setLoading(false);
      },
    });
  }, [itemId]);

  console.log(location);
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="product-attributes-main-container">
          <center>
            <h1>Product Attributes</h1>
          </center>
          <div className="product-attributes-list-container">
            <FAETextField label="Notes" value={notes} disabled={true} />
            <br />
            {attributeList &&
              attributeList.map((obj) => (
                <FAETextField
                  label={obj.attributeKey}
                  value={obj.attributeValue}
                  disabled={true}
                  className="products-attributes-field"
                />
              ))}
            <br />
          </div>
        </div>
      )}
    </>
  );
};

export default PlexaarContainer(CustomerAttributesDetail);
