const curationSort = (a, b) => {
  if (a.Score > b.Score) {
    return -1;
  } else if (a.Score < b.Score) {
    return 1;
  }
  return 0;
};

const priceSort = (a, b) => {
  if (a.PricingOptions[0].Price < b.PricingOptions[0].Price) {
    return -1;
  } else if (a.PricingOptions[0].Price > b.PricingOptions[0].Price) {
    return 1;
  }
  return 0;
};

const durationSort = (a, b) => {
  if (a.Duration < b.Duration) {
    return -1;
  } else if (a.Duration > b.Duration) {
    return 1;
  }
  return 0;
};

export default {
  curationSort,
  priceSort,
  durationSort,
};
