import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function SlowLoad() {
  await delay(2000)
  
  return (
    <Link href={`./game`} >Play hexagon</Link>
  )
}

function Loading() {
  return (
    <div>Loading...</div>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">

        <div className="flex h-48 w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Suspense fallback={<Loading />}>
            <SlowLoad />
          </Suspense>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {`The Devil's Plan`}
      </div>
    </main>
  )
}
