'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.href = 'https://www.csstatlab.com';
  });
  return <div className="h-screen bg-zinc-950" />;
}
