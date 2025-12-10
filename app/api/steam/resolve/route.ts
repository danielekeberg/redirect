import { NextResponse } from "next/server";

function isSteam64Id(value:string) {
    return /^\d{17}$/.test(value);
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if(!id) {
        return NextResponse.json({ error: "Missing 'id' query parameter" }, { status: 400 })
    }
    try {
        const apiKey = process.env.STEAM_API_KEY;
        if(!apiKey) {
            return NextResponse.json({ error: "Missing STEAM_API_KEY env var" }, { status: 500 })
        }

        let steam64id: string;
        if(isSteam64Id(id)) {
            steam64id = id;
        } else {
            const resolveUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${encodeURIComponent(id)}`;
            const res = await fetch(resolveUrl);
            const data = await res.json();
            if(data.response.success !== 1) {
                return NextResponse.json({ error: "Couldnt resolve vanity URL", raw: data.response }, { status: 404 })
            }
            steam64id = data.response.steamid
        }
        const playerUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steam64id}`;
        const playerRes = await fetch(playerUrl);
        const playerData = await playerRes.json();
        const player = playerData.response.players?.[0];
        if(!player) {
            return NextResponse.json({ error: "Couldnt find playerdata for this SteamID" }, { status: 404 })
        }
        return NextResponse.json({ steam64id, player })
    } catch(err) {
        console.error(err);
        return NextResponse.json({ error: "Servererror fetching SteamID"}, { status: 500 })
    }
}