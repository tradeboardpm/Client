"use client";

import { useState, useEffect } from "react";
import ImageCarousel from "../cards/ImageCarousel";

export default function AuthLayout({children}) {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex items-center justify-center">{children}</div>
      <div className="hidden md:flex md:w-1/2 bg-primary py-12 px-6 rounded-l-[4rem]">
        <ImageCarousel />
      </div>
    </div>
  );
}
