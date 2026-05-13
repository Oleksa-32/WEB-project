const STORAGE_KEY = 'railway-bookings-v1';

const initialReservedSeats = {
  'ic-732': {
    1: [2, 5, 9, 14, 23],
    2: [1, 8, 16, 21, 35],
    3: [4, 12, 18, 28, 41],
  },
  'night-091': {
    1: [3, 6, 17, 22],
    2: [8, 9, 15, 31],
    3: [2, 12, 26, 39, 44],
  },
  'regional-806': {
    1: [7, 18, 29, 42],
    2: [4, 13, 22, 50],
  },
  'express-749': {
    1: [1, 10, 11, 24],
    2: [6, 14, 30, 33],
    3: [5, 17, 38, 42],
    4: [3, 9, 15],
  },
  'night-043': {
    1: [4, 19, 25],
    2: [2, 7, 18, 29],
    3: [6, 12, 34, 45],
  },
  'intercity-715': {
    1: [2, 16, 21, 30],
    2: [5, 19, 27, 44],
    3: [9, 10, 33, 37],
  },
};

function readBookings() {
  const rawBookings = localStorage.getItem(STORAGE_KEY);

  if (!rawBookings) {
    return [];
  }

  try {
    const parsedBookings = JSON.parse(rawBookings);
    return Array.isArray(parsedBookings) ? parsedBookings : [];
  } catch {
    return [];
  }
}

function writeBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export const BookingService = {
  getBookings() {
    return readBookings();
  },

  createBooking(payload) {
    const booking = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const nextBookings = [...readBookings(), booking];
    writeBookings(nextBookings);

    return booking;
  },

  getReservedSeats(trainId, wagonId) {
    const seededSeats = initialReservedSeats[trainId]?.[wagonId] ?? [];
    const bookedSeats = readBookings()
      .filter((booking) => booking.trainId === trainId && booking.wagonId === wagonId)
      .flatMap((booking) => booking.seats);

    return [...new Set([...seededSeats, ...bookedSeats])].sort((first, second) => first - second);
  },
};
