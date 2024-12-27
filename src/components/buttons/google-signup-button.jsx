import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleSignUpButton = ({
  onSuccess,
  onError,
  disabled,
  text,
  className = "",
}) => {
  return (

        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap
          disabled={disabled}
          type="standard"
          theme="outline"
          size="large"
          width="100%"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
  );
};

export default GoogleSignUpButton;
