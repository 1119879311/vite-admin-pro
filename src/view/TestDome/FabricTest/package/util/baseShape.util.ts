export const pointerTolineDistance = (statPos, lostPos) => {
  return {
    width: Math.abs(lostPos.x - statPos.x),
    height: Math.abs(lostPos.y - statPos.y),
  };
};
