import { useEffect, useState } from "react";
import {
  FAESelect,
  FAEButton,
  FAETextField,
  FAERadioGroup,
  FAECheckBoxGroup,
} from "@plexaar/components";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

//src
import { GetProductAttributes, SaveProductBookingAttributes } from "./action";
import PlexaarContainer from "../PlexaarContainer";
import "./ProductAttributes.scss";
import Loader from "../Loader";
import { getUniqueData } from "../../utils";
import history from "../../history";

const ProductAttributes = () => {
  const location = useLocation();
  const productId = location.state.productId;
  const [attributeList, setAttributeList] = useState([]);
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetProductAttributes({
      productId,
      callback: (res) => {
        setAttributeList(res);
        setLoading(false);
      },
    });
  }, [productId]);

  const handleForm = (e) => {
    e.preventDefault();
    var bookingId = location.state.bookingId;
    var cartId = location.state.cartId;
    var productId = location.state.productId;
    // let data = []
    // let attribute = []
    // let checkboxList = checkboxItems.length != 0 ? {
    //     id: checkboxItems.id,
    //     value: checkboxItems.value.toString()
    // }
    //     : ''
    // data.push( checkboxList, selectedItems, radioItems)
    // data.filter((ob) => { return ob.length != 0 && attribute.push(ob) })
    console.log("form ", form);
    SaveProductBookingAttributes({
      bookingId,
      cartId,
      productId,
      form,
      callback: (res) => {
        alert(res.message);
        history.goBack();
      },
    });
  };
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
            {attributeList &&
              attributeList.map((obj) => (
                <div>
                  {obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                    "TEXTBOX" && (
                    <FAETextField
                      label={obj.attributeKey}
                      placeholder="Type your answer here..."
                      getValue={(value) => {
                        // setTextValue({ "id": obj.attributeID, "value": value });
                        setForm(
                          getUniqueData(
                            [{ id: obj.attributeID, value: value }, ...form],
                            "id"
                          )
                        );
                      }}
                      // value={textValue.value}
                      primary
                    />
                  )}
                  {(obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                    "SELECT" ||
                    obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                      "PROFESSION") && (
                    <FAESelect
                      label={obj.attributeKey}
                      values={[
                        { label: "None", value: "" },
                        ...obj.options.map((option) => {
                          return { label: option.value, value: option.value };
                        }),
                      ]}
                      getSelectedValue={
                        (value) => {
                          setForm(
                            getUniqueData(
                              [{ id: obj.attributeID, value: value }, ...form],
                              "id"
                            )
                          );
                        }
                        //setSelectedItems({ "id": obj.attributeID, "value": value })
                      }
                      primary
                    />
                    // <SelectQuestions
                    //   question={obj}
                    //   // callback={(answer) => setAnswers([answer, ...answers])}
                    //   // subQuestionsAnswers={(answers) =>
                    //   //   setSubAnswers([answers, ...subAnswers])
                    //   // }
                    // />
                  )}
                  {obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                    "RADIOBUTTON" && (
                    <FAERadioGroup
                      label={obj.attributeKey}
                      values={[
                        { label: "None", value: "" },
                        ...obj.options.map((option) => {
                          return { label: option.value, value: option.value };
                        }),
                      ]}
                      getSelectedValue={
                        (value) => {
                          setForm(
                            getUniqueData(
                              [{ id: obj.attributeID, value: value }, ...form],
                              "id"
                            )
                          );
                        }
                        //setRadioItems({ "id": obj.attributeID, "value": value })
                      }
                      primary
                    />
                  )}
                  {obj.attributeTypeName.replace(/\s/g, "").toUpperCase() ===
                    "CHECKBOX" && (
                    <FAECheckBoxGroup
                      label={obj.attributeKey}
                      values={[
                        ...obj.options.map((option) => {
                          return { label: option.value, value: option.value };
                        }),
                      ]}
                      getSelectedValues={
                        (value) => {
                          setForm(
                            getUniqueData(
                              [
                                {
                                  id: obj.attributeID,
                                  value: value.toString(),
                                },
                                ...form,
                              ],
                              "id"
                            )
                          );
                        }
                        //setCheckboxItems({ "id": obj.attributeID, "value": value.toString() })
                      }
                      primary
                    />
                  )}
                </div>
              ))}
            <br />
            <FAEButton onClick={handleForm}>Save</FAEButton>
          </div>
        </div>
      )}
    </>
  );
};

export default PlexaarContainer(ProductAttributes);
