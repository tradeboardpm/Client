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
  const handleClick = (event) => {
    // Find and trigger the Google Login button
    const googleLoginButton = event.currentTarget.querySelector(
      ".google-login-trigger"
    );
    if (googleLoginButton) {
      googleLoginButton.querySelector('div[role="button"]')?.click();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <Button
        variant="ghost"
        className="w-full bg-[#F3F6F8] justify-center border border-[#E7E7EA]  font-medium text-[0.875rem] shadow-[0px_6px_16px_rgba(0,0,0,0.04)] py-[20px]"
        onClick={handleClick}
        disabled={disabled}
      >
        <img src="/images/google.svg" alt="google img" className="h-5 mr-2" />

        {text}
      </Button>
      {/* Hidden Google Login component */}
      <div className="google-login-trigger absolute top-0 left-0 w-full h-full opacity-0">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default GoogleSignUpButton;