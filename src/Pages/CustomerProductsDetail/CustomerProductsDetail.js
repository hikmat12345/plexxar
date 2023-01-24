/* eslint-disable */
import React, { useEffect, useState } from "react";
import FAEProductCard from "../FAEProductCard/FAEProductCard";
//src
import "./CustomerProductsDetail.scss";
import { GetCartDetails } from "./actions";
import { useLocation } from "react-router-dom";
import PlexaarContainer from "../PlexaarContainer";
import Loader from "../Loader";
import history from "../../history";

const CustomerProductsDetail = () => {
  const location = useLocation();
  const cartId = location.state;
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    GetCartDetails({
      cartId,
      callback: (res) => {
        setCart(res.getCartDetails);
        setSummary(res.summary);
        setCurrencySymbol(res.currencySymbol);
        setLoading(false);
      },
    });
  }, []);
  console.log(location);
  return (
    <div className="customer-cart-detail">
      {loading && <Loader />}
      {!loading && cart
        ? cart.map((product, index) => (
            <div
              onClick={() =>
                product.hasAttributes &&
                history.push({
                  pathname: "products-detail/attributes",
                  state: product.id,
                })
              }
            >
              <FAEProductCard
                src={product.image}
                label={product.name}
                shortDescription={product.productDescription}
                discountedPrice={product.flatDiscount}
                price={product.price}
                currencySymbol={product.currencySymbol}
                primary={false}
                noOfProductsAdded={product.items}
              />
            </div>
          ))
        : "No Cart"}
    </div>
  );
};
export default PlexaarContainer(CustomerProductsDetail);
