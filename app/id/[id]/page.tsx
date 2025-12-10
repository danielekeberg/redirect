'use client';
import { useEffect } from "react";
import { useParams } from "next/navigation"

export default function Home() {
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    async function fetchPlayer() {
        try {
            const res = await fetch(`/api/steam/resolve?id=${id}`);
            const data = await res.json();
            console.log(data.steam64id);
            window.location.href = `https://csstatlab.com/player/${data.steam64id}`
        }   catch(err) {
            console.error(err);
        }
    }
    fetchPlayer();
  },[])
  return (
    <div className="h-screen bg-black" />
  );
}
