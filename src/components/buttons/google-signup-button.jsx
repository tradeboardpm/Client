import React from "react";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@react-oauth/google";

const GoogleSignUpButton = ({
  onSuccess,
  onError,
  disabled,
  text,
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Button
        variant="ghost"
        className="w-full bg-[#F3F6F8] justify-center border border-[#E7E7EA] font-medium text-[0.875rem] shadow-[0px_6px_16px_rgba(0,0,0,0.04)] py-[20px]"
        disabled={disabled}
        style={{ pointerEvents: "none" }}
      >
        <img src="/images/google.svg" alt="google img" className="h-5 mr-2" />
        {text}
      </Button>
      <div className="absolute inset-0 opacity-0">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap
          disabled={disabled}
          type="standard"
          theme="outline"
          size="large"
          width="100%"
        />
      </div>
    </div>
  );
};

export default GoogleSignUpButton;
