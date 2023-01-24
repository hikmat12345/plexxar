import React, { useEffect, useState } from "react";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import FAEProductCard from "../FAEProductCard/FAEProductCard";
import { useLocation } from "react-router";
import Loader from "../Loader";

//src
import "./ProductPage.scss";
import { getProducts, AddToCartProducts, GetCartDetails } from "./actions";
import history from "../../history";

const ProductPage = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [productQuantity, setProductQuantity] = useState(0);
  const [cart, setCart] = useState(0);
  const cartId = location.state.cartId;
  var serviceId = location.state.serviceId;

  useEffect(() => {
    getProducts({
      serviceId,
      cartId,
      callback: (res) => {
        setLoading(false);
        setProductList(res.result);
      },
    });
    GetCartDetails({
      cartId,
      callback: (res) => {
        res.code === 0 && setCart(res.getCartDetails.length);
      },
    });
  }, [cartId, serviceId]);

  const AddToCart = (id) => {
    var cartId = location.state.cartId;
    AddToCartProducts({
      id,
      cartId,
      productQuantity,
      callback: (res) => {
        GetCartDetails({
          cartId,
          callback: (result) => {
            result.code === 0 && setCart(result.getCartDetails.length);
          },
        });
      },
    });
  };
  console.log(location);
  return (
    <div className="product-main-container">
      {loading && <Loader />}
      <div className="product-list-header">
        <div
          onClick={() =>
            history.push({ pathname: "/product-cart", state: location.state })
          }
        >
          <span>
            <ShoppingCartOutlinedIcon />
          </span>{" "}
          <span>{cart}</span>{" "}
        </div>
      </div>
      {!loading && (
        <ul className="product-list">
          {productList.map((product, index) => (
            <>
              <li key={product.id}>
                <FAEProductCard
                  src={product.imagePath}
                  label={product.name}
                  shortDescription={product.description}
                  discountedPrice={product.flatDiscount}
                  price={product.price}
                  currencySymbol={product.currencySymbol}
                  // noOfProducts={12}
                  primary={product.hasAttributes === true ? false : true}
                  type="img"
                  alt="product image"
                  placeholder="2"
                  textOnImage={
                    product.percentageDiscount !== 0 &&
                    `${product.percentageDiscount}%`
                  }
                  textPosition="np"
                  noOfProductsAdded={product.quantity}
                  onClick={() =>
                    product.hasAttributes
                      ? history.push({
                          pathname: "/product-attributes",
                          state: {
                            productId: product.id,
                            cartId: cartId,
                            bookingId: location.state.bookingId,
                          },
                        })
                      : AddToCart(product.id)
                  } //? goCustomizeProduct(product.id,  getCartid, product.isDeleted)
                  getQuantityOfProducts={(e) => setProductQuantity(e)}
                />
              </li>
            </>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ProductPage;
