import places from "./lugares";
import markerPositions from "./markerPositions";

const placesWithMarkers = places.map((place) => {
  const position = markerPositions.find((m) => m.id === place.id);
  return position ? { ...place, ...position } : place;
});

export default placesWithMarkers;
