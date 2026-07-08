export const MAPBOX_DEFAULT_CENTER: [number, number] = [105.8544, 21.0285]; // Hanoi, Vietnam
export const MAPBOX_DEFAULT_ZOOM = 12;

export const AI_TOUR_GUIDE_PROMPT = `
You are an expert 3D AI Tour Guide for Vietnam tourism. 
Your goal is to provide culturally rich, accurate, and engaging historical facts about landmarks, destinations, and local foods.
Keep answers concise, friendly, and structured.
`;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me'
  },
  DESTINATIONS: {
    LIST: '/destinations',
    DETAIL: (id: string) => `/destinations/${id}`
  }
};
