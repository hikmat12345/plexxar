/* eslint-disable */
import React, { useEffect, useState, useContext } from "react";
import {
  FAEText,
  FAEButton,
  FAEDialogueBox,
  FAERadioGroup,
} from "@plexaar/components";
import FAEProductCard from "../FAEProductCard/FAEProductCard";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
//src
import "./ProductCart.scss";
import {
  AddCartItem,
  RemoveCartItem,
  GetCartDetails,
  DeleteCart,
} from "./actions";
import { useLocation } from "react-router-dom";
import PlexaarContainer from "../PlexaarContainer";
import Loader from "../Loader";
import history from "../../history";

const ProductCart = () => {
  const location = useLocation();
  const cartId = location.state.cartId;
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [loading, setLoading] = useState(false);

  const getCartInfo = () => {
    GetCartDetails({
      cartId,
      callback: (res) => {
        setCart(res.getCartDetails);
        setSummary(res.summary);
        setCurrencySymbol(res.currencySymbol);
      },
    });
  };
  useEffect(() => {
    getCartInfo();
  }, []);
  const handleDeleteCart = (id, productId) => {
    DeleteCart({
      id,
      productId,
      cartId,
      callback: (res) => getCartInfo(),
    });
  };
  console.log(location);
  return (
    <div className="cart-detail">
      {loading && <Loader />}
      <FAEButton
        className="checkout-btn"
        onClick={() =>
          history.push({
            pathname: "/appointment-summary",
            state: location.state,
          })
        }
      >
        Checkout
      </FAEButton>
      {!loading && cart
        ? cart.map((product, index) => (
            <>
              <FAEProductCard
                src={product.image}
                label={product.name}
                shortDescription={product.productDescription}
                discountedPrice={product.flatDiscount}
                price={product.price}
                currencySymbol={product.currencySymbol}
                // noOfProducts={12}
                primary={product.hasAttributes === true ? false : true}
                type="img"
                alt="product image"
                placeholder="2"
                textOnImage=""
                textPosition=""
                noOfProductsAdded={product.items}
                getQuantityOfProducts={(e) => {
                  if (e > product.items) {
                    var id = product.id;
                    setLoading(true);
                    AddCartItem({ id, cartId });
                    getCartInfo();
                    setLoading(false);
                  } else {
                    var id = product.id;
                    setLoading(true);
                    RemoveCartItem({ id, cartId });
                    getCartInfo();
                    setLoading(false);
                  }
                }}
              />
              <FAEButton
                className="fae-cart-del-btn"
                onClick={() => handleDeleteCart(product.id, product.productId)}
              >
                <DeleteOutlineIcon />
              </FAEButton>
            </>
          ))
        : "No Cart"}
    </div>
  );
};
export default PlexaarContainer(ProductCart);
