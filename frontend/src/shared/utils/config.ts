export const config = {
  KC_URL: process.env.NEXT_PUBLIC_KC_URL || "http://localhost:8080",
  KC_REALM: process.env.NEXT_PUBLIC_KC_REALM || "boobook",
  KC_CLIENT_ID: process.env.NEXT_PUBLIC_KC_CLIENT_ID || "nextjs",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5112/api/v1",
  OPERATION_API_URL: process.env.NEXT_PUBLIC_OPERATION_API_URL || "http://localhost:5110/api/v1",
  API_V2_URL: process.env.NEXT_PUBLIC_API_V2_URL || "http://localhost:5112/api/v2",
  OPERATION_API_V2_URL: process.env.NEXT_PUBLIC_OPERATION_API_V2_URL || "http://localhost:5110/api/v2",
};

export default config;
