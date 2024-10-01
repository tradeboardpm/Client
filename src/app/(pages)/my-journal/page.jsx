import MainLayout from '@/components/layouts/MainLayout'
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import React from 'react'

const page = () => {
  return (
    <MainLayout>
      <main className="p-6">
        <div className="bg-gradient-to-b from-primary to-[#7886DD] rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-background">
              <ChevronsLeft />
              <p className="bg-accent/40 text-xl text-background px-2 py-1 rounded-lg">
                May 2024
              </p>
              <ChevronsRight />
            </div>
            <p className="text-background text-lg">Capital: ₹ 00</p>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}

export default page
