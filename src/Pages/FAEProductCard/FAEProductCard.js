//libs
import React, { useEffect, useState } from "react";

//src
import { 
  FAEText,
  FAEPrice,
  FAELoading,
  FAETextField,
  FAEButton
} from "@plexaar/components"
import FAEImage from "./FAEImage/FAEImage"
import FAEVideo from "./FAEVideo/FAEVideo"

//scss
import "./FAEProductCard.scss";

 const FAEProductCard = ({
  src,
  label,
  price,
  primary,
  discountedPrice,
  currencySymbol,
  className = "",
  type,
  alt,
  loading,
  loaderProps,
  placeholder,
  textOnImage,
  textPosition,
  noOfProductsAdded = 0,
  shortDescription = "asdsadsadad",
  disabled,
  onClick = () => {},
  getQuantityOfProducts = () => {},
  ...rest
}) => {
  const [noOfProducts, setNoOfProducts] = useState(0);

  useEffect(() => {
    setNoOfProducts(noOfProductsAdded);
  }, [noOfProductsAdded]);

  const handleQuantityChanged = (event, quantity) => {
    if (event === "") {
      setNoOfProducts(parseInt(quantity));
      getQuantityOfProducts(parseInt(quantity));
    } else if (event === "add") {
      setNoOfProducts(noOfProducts + 1);
      getQuantityOfProducts(noOfProducts + 1);
    } else {
      setNoOfProducts(noOfProducts - 1);
      getQuantityOfProducts(noOfProducts - 1);
    }
  };

  return (
    <>
      {loading ? (
        <FAELoading {...loaderProps} />
      ) : (
        <div className={`fae--product-card ${className}`}>
          {type !== "video" ? (
            <>
              <FAEImage
                className="fae--product-card-image-or-video"
                src={src}
                alt={alt}
                placeholder={placeholder}
                textOnImage={textOnImage}
                textPosition={textPosition}
                {...rest}
              />
            </>
          ) : (
            <FAEVideo
              className="fae--product-card-image-or-video"
              src={src}
              alt={alt}
              placeholder={placeholder}
              {...rest}
            />
          )}
          <div className={`fae--card-content`}>
            <FAEText className="fae--product-card-text-mobile" light>
              {label}
            </FAEText>
            <FAEText paragraph  tertiary>
              {shortDescription}
            </FAEText>
            <div className="fae--product-card-amount-of-products-action-and-price-wrapper">
              <FAEPrice
                discountedPrice={discountedPrice}
                price={price}
                currencySymbol={currencySymbol}
              />
              {primary ? (
                <div className="fae--product-card-amount-of-products-action-wrapper">
                  {noOfProducts > 0 && (
                    <FAEButton
                      onClick={() => handleQuantityChanged("remove", 0)}
                      className="fae--product-card-action-button"
                    >
                      -
                    </FAEButton>
                  )}
                  <FAETextField
                    type="number"
                    className="fae--product-card-text-field-cotainer"
                    value={noOfProducts}
                    getValue={(value) =>
                      handleQuantityChanged("", value === "" ? 0 : value)
                    }
                  />
                  <FAEButton
                    onClick={() => handleQuantityChanged("add", 0)}
                    className="fae--product-card-action-button"
                  >
                    +
                  </FAEButton>
                </div>
              ) : (
                <div className="fae--product-card-amount-of-products-action-wrapper">
                  <FAEText>Qty: </FAEText>
                  <FAETextField
                    type="number"
                    className="fae--product-card-text-field-cotainer"
                    value={noOfProducts}
                    disabled
                  />
                </div>
              )}
            </div>
            <div className="fae--product-card-add-to-card-button-wrapper">
              <FAEButton
                primary={disabled}
                disabled={disabled}
                onClick={onClick}
              >
                Add To Cart
              </FAEButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default FAEProductCard