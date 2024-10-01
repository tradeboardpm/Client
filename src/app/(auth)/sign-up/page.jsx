"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const carouselImages = [
    "/Images/Dashboard.png",
    "/Images/Dashboard.png",
    "/Images/Dashboard.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex items-center justify-center px-6 py-2">
        <Card className="w-full max-w-lg bg-transparent shadow-none">
          <CardContent className="px-2 py-3">
            <h1 className="text-3xl font-bold mb-2">Sign up</h1>
            <p className="text-gray-300 mb-6">Please create an account</p>

            <Button variant="outline" className="w-full mb-4 bg-accent/50 h-10 shadow-lg border border-ring/25">
              <Image
                src="/google-logo.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign up with Google
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-gray-500">OR</span>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input className=" text-base h-10" id="fullName" placeholder="Full name" />
              </div>
              <div>
                <Label htmlFor="email">Email ID</Label>
                <Input className=" text-base h-10" id="email" type="email" placeholder="Email ID" />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input className=" text-base h-10" id="mobile" type="tel" placeholder="Mobile number" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input className=" text-base h-10"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input className=" text-base h-10"
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </div>
              <Button className="w-full text-background">Sign up</Button>
            </form>

            <p className="text-center mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 rounded-l-[3.5rem]">
        <div className="max-w-2xl">
          <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
            {carouselImages.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Carousel image ${index + 1}`}
                layout="fill"
                objectFit="contain"
                className={`transition-opacity duration-500 ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Tradeboard! 👋
            </h2>
            <p className="text-xl">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
