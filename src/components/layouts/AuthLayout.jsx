import ImageCarousel from "../cards/ImageCarousel";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({children}) {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex items-center justify-center">
        {children} <Toaster />
      </div>
      <div className="hidden md:flex md:w-1/2 bg-primary py-12 px-6 rounded-l-[4rem]">
        <ImageCarousel />
      </div>
    </div>
  );
}
