export const APP_NAME = "Apni Sawari";
export const COUNTRY_CODE = "+92";

export const CANCELLATION_THRESHOLD = 3; // per day
export const CANCELLATION_PENALTY_RATE = 0.2; // 20%
export const SKIP_PENALTY_THRESHOLD = 5;
export const SKIP_PENALTY_AMOUNT = 50; // PKR
export const SKIP_BLOCK_DURATION = 10; // minutes
export const SKIP_RESPONSE_TIME = 20; // seconds
export const SURGE_MULTIPLIER = 2;
export const SURGE_DURATION_HOURS = 2;
export const EXTRA_DISTANCE_THRESHOLD = 500; // meters beyond drop-off
export const PRE_DROP_NOTIFICATION_DISTANCE = 500; // meters
export const PRE_DROP_NOTIFICATION_ETA = 5; // minutes
export const DRIVER_ARRIVED_DISTANCE = 300; // meters
export const MAX_PARCEL_WEIGHT_KG = 40;

export const PAKISTAN_REGION = {
  latitude: 30.3753,
  longitude: 69.3451,
  latitudeDelta: 15,
  longitudeDelta: 15,
};

export const DEFAULT_MAP_DELTA = {
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
