"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Image, PlusCircle } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <MainLayout>
      <div className="flex h-full">
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Welcome back, Json Taylor!</h2>
            <p className="text-xl">3:15 PM</p>
          </div>

          <Card className="bg-transparent border-none shadow-none mb-6">
            <CardHeader className="bg-gradient-to-b from-primary to-[#7886DD] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div className="bg-accent/40 text-xl text-background px-2 py-1 rounded-lg">
                  <p>Monday, 31 May 2024</p>
                </div>
                <p className="text-background text-lg">Capital: ₹ 00</p>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-transparent mt-4">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Today's Journal */}
                <Card className="flex-1">
                  <CardHeader className="px-5 py-4">
                    <CardTitle className="text-lg font-semibold">
                      Today's Journal{" "}
                      <span className="text-sm font-light">(Saving)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Type your notes here..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="mistakes">Mistake</Label>
                      <Textarea
                        id="mistakes"
                        placeholder="Type your mistakes here..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="lessons">Lesson</Label>
                      <Textarea
                        id="lessons"
                        placeholder="Type your lessons here..."
                      />
                    </div>
                    <div className="flex w-full justify-end">
                      <Button variant="outline" className="text-primary">
                        <Image className="mr-2 h-4 w-4" />
                        Attach
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {/* Rules */}
                <Card className="flex-1">
                  <CardHeader className="px-5 py-4">
                    <CardTitle className="text-lg font-semibold">
                      Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <h4 className="text-xl font-semibold mb-2">
                        Get Started!
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Please click below to add your trading rules
                      </p>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Rules
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trade Log</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Get Started!</h3>
              <p className="text-gray-600 mb-4">
                Please add your trades here or import them automatically using
                your tradebook
              </p>
              <div className="space-x-4">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Trade
                </Button>
                <Button variant="outline">Import Trade</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        {!isMobile && (
          <div className="w-80 bg-white p-6 space-y-6 border-l">
            {/* <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">May 2024</h3>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div> */}
            <Calendar />
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">No data</h3>
                <p className="text-gray-600">
                  Please start journaling daily to see your performance here
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
