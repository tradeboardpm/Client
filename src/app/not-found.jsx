import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Card className="flex flex-col p-4">
          404 not Not Found
          <Link
            className="text-pretty text-primary hover:bg-accent flex gap-2 items-center border justify-center rounded"
            href={"/dashboard"}
                >
                    <Home size={16}/>
            Home
          </Link>
        </Card>
      </div>
    );
}

export default NotFound
