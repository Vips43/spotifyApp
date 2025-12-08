const clientId = `ae099a85abfd490f942ad96cecc1e3fe`;
const clientSecret = `08929370795044bb9726eccb1421c08c`;

async function getAccessToken() {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization":
        "Basic " +
        btoa(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  const data = await result.json();
  return data.access_token;
}

export async function searchSongs(query) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  const data = await res.json();
  // console.log(data);
  return data.tracks.items;
}
export async function getArtistsDetails() {
  const artistsID =
    ["3xjuY3FqcHemteM5aOv1LA", '3ci7qlWeEB4GT6y12tbTNO', '0Zg44YDPe3fBfHoxTA0qpD', '3ZFpN9rFHLxElJpqyABkMt', '73qNxW8UoTSftWynAEiYxA', "2NoJ7NuNs9nyj8Thoh1kbu", "7FmygnepJt3fhiZQDmoC0P", "7uIbLdzzSEqnX0Pkrb56cR", "4PULA4EFzYTrxYvOVlwpiQ"];
  const token = await getAccessToken();
  const ids = artistsID.join(',')

  const res = await fetch(`https://api.spotify.com/v1/artists?ids=${ids}`, {
    main: "GET",
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json();
  let artistsInfo = data.artists.map(d => ({
    id: d.id,
    name: d.name,
    image: d.images[1]?.url || d.images[0]?.url || d.images[2].url,
  }))
  // console.log(artistsInfo);

  return artistsInfo;
}
getArtistsDetails()




function formateDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${minutes}:${seconds}`
}

export async function getArtistsAblum(id) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  const tracks = await res.json();
  const res2 = await fetch(
    `https://api.spotify.com/v1/artists/${id}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  // console.log(tracks);

  const artists = await res2.json();
  let artistsInfo = {
    image: artists.images[0].url,
    name: artists.name,
    followers: artists.followers.total
  }
  let artistsTracks = tracks.tracks.map(track => ({
    name: track.name,
    image: track.album.images[2]?.url || track.album.images[1]?.url || track.album.images[0]?.url,
    song: track.external_urls.spotify,
    duration: formateDuration(track.duration_ms)
  }))
  return { artistsInfo, artistsTracks }
}
getArtistsAblum(`3xjuY3FqcHemteM5aOv1LA`)







export async function dummy() {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  const data = await res.json();
  console.log(data);
  return data.tracks.items;
}
// dummy()