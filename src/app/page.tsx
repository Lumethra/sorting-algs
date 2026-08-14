'use client'
// https://threejsresources.com/frameworks/three-js-nextjs

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })

export default function Home() {
  return <Scene />
}