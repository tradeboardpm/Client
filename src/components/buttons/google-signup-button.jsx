import React, { useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleSignUpButton = ({
  onSuccess,
  onError,
  disabled,
  text,
  className = "",
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const iframe = entry.target.querySelector("iframe");
        if (iframe) {
          iframe.style.width = `${width}px`;
        }
      }
    });

    if (buttonRef.current) {
      resizeObserver.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        resizeObserver.unobserve(buttonRef.current);
      }
    };
  }, []);

  return (
    <div ref={buttonRef} className="relative w-full h-[44px]">
      {/* Visible button that matches other buttons */}
      <button
        type="button"
        disabled={disabled}
        className="absolute inset-0 w-full h-full bg-[#F3F6F8] dark:bg-[#434445] justify-center border dark:border-[#303031] border-[#E7E7EA] font-medium text-[0.875rem] shadow-[0px_6px_16px_rgba(0,0,0,0.04)] py-2.5 flex items-center rounded-md pointer-events-none"
      >
        <img src="/images/google.svg" alt="google img" className="h-5 mr-2" />
        {text}
      </button>

      {/* Invisible Google Login button that covers entire area */}
      <div className="absolute inset-0 w-full h-full overflow-hidden opacity-0">
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
      </div>
    </div>
  );
};

export default GoogleSignUpButton;
