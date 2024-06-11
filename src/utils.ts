const TYPE_COLOR_MAP: Record<number, string> = {
  // normal
  1: "#A8A878",
  // fighting
  2: "#C03028",
  // flying
  3: "linear-gradient(to bottom, #3cc3eb 50%, #b9b9b4 50%)",
  // poison
  4: "#A040A0",
  //ground
  5: "#E0C068",
  // rock
  6: "#B8A038",
  // bug
  7: "#A8B820",
  // ghost
  8: "#705898",
  // steel
  9: "#B8B8D0",
  // fire
  10: "#FA6C6C",

  // water
  11: "#6890F0",
  // grass
  12: "#78C850",
  // electric
  13: "#F8D030",
  //psychic
  14: "#F85888",
  // ice
  15: "#98D8D8",
  // dragon
  16: "#7038F8",
  // dark
  17: "#705848",
  // fairy
  18: "#EE99AC",
  // unknown
  10001: "#68A090",
  // shadow
  10002: "#404040",
};

export function getBgByType(type: number) {
  return TYPE_COLOR_MAP[type];
}
