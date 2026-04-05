import Mapbox from "@rnmapbox/maps";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

Mapbox.setAccessToken(MAPBOX_TOKEN);

export { MAPBOX_TOKEN };
export default Mapbox;
