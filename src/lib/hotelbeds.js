// All requests go to our local Express proxy (server.js)
// which adds the Hotelbeds signature server-side — avoiding CORS entirely.
const PROXY = '/api'; // CRA's "proxy" field in package.json forwards this to localhost:4000

export async function searchHotels({
  destinationCode = 'LON',
  checkIn,
  checkOut,
  adults = 2,
  rooms = 1,
  from = 1,
  to = 20,
  minRate,
  maxRate,
  minCategory,
}) {
  const body = {
    stay: { checkIn, checkOut },
    occupancies: [{ rooms, adults, children: 0 }],
    destination: { code: destinationCode },
    filter: {
      ...(minRate     && { minRate }),
      ...(maxRate     && { maxRate }),
      ...(minCategory && { minCategory, maxCategory: 5 }),
    },
    reviews: [{ type: 'HOTELBEDS', maxRate: 5, minReviewCount: 3 }],
  };

  const res = await fetch(`${PROXY}/hotels/search?from=${from}&to=${to}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.error || `API error ${res.status}`);
  }
  return res.json();
}

export async function getHotelContent(hotelCodes = []) {
  const res = await fetch(`${PROXY}/hotels/content?codes=${hotelCodes.join(',')}`);
  if (!res.ok) throw new Error(`Content API error ${res.status}`);
  return res.json();
}

export async function checkApiStatus() {
  const res = await fetch(`${PROXY}/status`);
  return res.json();
}
