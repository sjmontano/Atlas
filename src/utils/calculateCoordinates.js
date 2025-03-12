const calculateCoordinates = ({ initialCoordinates, width, height, scaleX, scaleY }) => {
  return [
    initialCoordinates[0] + scaleX * width,
    initialCoordinates[1] + scaleY * height,
  ];
};

export default calculateCoordinates;
