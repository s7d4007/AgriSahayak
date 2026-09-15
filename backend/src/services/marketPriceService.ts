const MARKET_PRICES = [
  { commodity: 'Rice', variety: 'Basmati', mspPrice: 2875, marketPrice: 3100, trend: 'up', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Wheat', variety: 'HD-2967', mspPrice: 2015, marketPrice: 2050, trend: 'stable', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Maize', variety: 'Hybrid', mspPrice: 1848, marketPrice: 1750, trend: 'down', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Chickpea', variety: 'Desi', mspPrice: 5100, marketPrice: 5300, trend: 'up', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Lentil', variety: 'Masoor', mspPrice: 6425, marketPrice: 6800, trend: 'up', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Soybean', variety: 'JS-335', mspPrice: 4600, marketPrice: 4400, trend: 'down', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Cotton', variety: 'Long Staple', mspPrice: 6620, marketPrice: 6900, trend: 'up', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Sugarcane', variety: 'Co-0238', mspPrice: 315, marketPrice: 315, trend: 'stable', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Sunflower', variety: 'KBSH-44', mspPrice: 6760, marketPrice: 6200, trend: 'down', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Mustard', variety: 'Pusa Bold', mspPrice: 5650, marketPrice: 5900, trend: 'up', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Groundnut', variety: 'TMV-2', mspPrice: 6377, marketPrice: 6500, trend: 'stable', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
  { commodity: 'Turmeric', variety: 'Nizamabad', mspPrice: 7000, marketPrice: 9500, trend: 'up', unit: '₹/quintal', market: 'National Average', lastUpdated: new Date().toISOString() },
];

export const getMarketPrices = (commodity?: string, market?: string) => {
  let prices = MARKET_PRICES;

  if (commodity) {
    const q = commodity.toLowerCase();
    prices = prices.filter(
      (p) =>
        p.commodity.toLowerCase().includes(q) ||
        p.variety.toLowerCase().includes(q)
    );
  }

  if (market) {
    const q = market.toLowerCase();
    prices = prices.filter((p) => p.market.toLowerCase().includes(q));
  }

  return { success: true, data: prices, count: prices.length };
};
