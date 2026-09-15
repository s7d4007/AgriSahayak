import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calculator,
  Download,
  Sparkles,
  Droplets,
  Tractor,
  Leaf,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  BarChart3,
  Sprout,
  Landmark,
} from 'lucide-react';
import { getAllStates, getDistrictsForState } from '../utils/statesDistricts';

type UnitKey = 'acres' | 'hectares' | 'squareMeters' | 'squareFeet' | 'bigha' | 'guntha' | 'kanal' | 'cent' | 'decimal';
type IrrigationType = 'rainfed' | 'irrigated';
type Season = 'kharif' | 'rabi' | 'summer';

type CropProfile = {
  id: string;
  name: string;
  nameKey: string;
  baseYieldPerAcre: number;
  seedRateKgPerAcre: number;
  ureaKgPerAcre: number;
  dapKgPerAcre: number;
  mopKgPerAcre: number;
  organicKgPerAcre: number;
  waterLitersPerAcre: number;
  pesticideLitersPerAcre: number;
  labourHoursPerAcre: number;
  machineryHoursPerAcre: number;
  seedCostPerKg: number;
  ureaCostPerKg: number;
  dapCostPerKg: number;
  mopCostPerKg: number;
  organicCostPerKg: number;
  pesticideCostPerLiter: number;
  irrigationCostPerAcre: number;
  labourCostPerHour: number;
  machineryCostPerHour: number;
  transportCostPerAcre: number;
  miscCostPerAcre: number;
  mspPricePerQuintal: number;
  localMarketPricePerQuintal: number;
};

type InsightLevel = 'good' | 'moderate' | 'attention';

const cropProfiles: CropProfile[] = [
  {
    id: 'rice',
    name: 'Rice',
    nameKey: 'farmPlanner.crops.rice',
    baseYieldPerAcre: 28,
    seedRateKgPerAcre: 25,
    ureaKgPerAcre: 90,
    dapKgPerAcre: 45,
    mopKgPerAcre: 25,
    organicKgPerAcre: 400,
    waterLitersPerAcre: 650000,
    pesticideLitersPerAcre: 1.2,
    labourHoursPerAcre: 28,
    machineryHoursPerAcre: 6,
    seedCostPerKg: 70,
    ureaCostPerKg: 7.5,
    dapCostPerKg: 28,
    mopCostPerKg: 24,
    organicCostPerKg: 1.2,
    pesticideCostPerLiter: 480,
    irrigationCostPerAcre: 1800,
    labourCostPerHour: 80,
    machineryCostPerHour: 420,
    transportCostPerAcre: 950,
    miscCostPerAcre: 650,
    mspPricePerQuintal: 2250,
    localMarketPricePerQuintal: 2450,
  },
  {
    id: 'wheat',
    name: 'Wheat',
    nameKey: 'farmPlanner.crops.wheat',
    baseYieldPerAcre: 22,
    seedRateKgPerAcre: 100,
    ureaKgPerAcre: 80,
    dapKgPerAcre: 35,
    mopKgPerAcre: 20,
    organicKgPerAcre: 300,
    waterLitersPerAcre: 420000,
    pesticideLitersPerAcre: 0.8,
    labourHoursPerAcre: 22,
    machineryHoursPerAcre: 5,
    seedCostPerKg: 42,
    ureaCostPerKg: 7.2,
    dapCostPerKg: 26,
    mopCostPerKg: 22,
    organicCostPerKg: 1.1,
    pesticideCostPerLiter: 420,
    irrigationCostPerAcre: 1400,
    labourCostPerHour: 78,
    machineryCostPerHour: 390,
    transportCostPerAcre: 750,
    miscCostPerAcre: 500,
    mspPricePerQuintal: 2275,
    localMarketPricePerQuintal: 2350,
  },
  {
    id: 'maize',
    name: 'Maize',
    nameKey: 'farmPlanner.crops.maize',
    baseYieldPerAcre: 24,
    seedRateKgPerAcre: 20,
    ureaKgPerAcre: 70,
    dapKgPerAcre: 30,
    mopKgPerAcre: 18,
    organicKgPerAcre: 320,
    waterLitersPerAcre: 360000,
    pesticideLitersPerAcre: 0.9,
    labourHoursPerAcre: 20,
    machineryHoursPerAcre: 4,
    seedCostPerKg: 55,
    ureaCostPerKg: 6.8,
    dapCostPerKg: 24,
    mopCostPerKg: 21,
    organicCostPerKg: 1.0,
    pesticideCostPerLiter: 390,
    irrigationCostPerAcre: 1200,
    labourCostPerHour: 74,
    machineryCostPerHour: 360,
    transportCostPerAcre: 640,
    miscCostPerAcre: 430,
    mspPricePerQuintal: 1970,
    localMarketPricePerQuintal: 2080,
  },
  {
    id: 'cotton',
    name: 'Cotton',
    nameKey: 'farmPlanner.crops.cotton',
    baseYieldPerAcre: 16,
    seedRateKgPerAcre: 8,
    ureaKgPerAcre: 60,
    dapKgPerAcre: 25,
    mopKgPerAcre: 16,
    organicKgPerAcre: 280,
    waterLitersPerAcre: 580000,
    pesticideLitersPerAcre: 1.6,
    labourHoursPerAcre: 26,
    machineryHoursPerAcre: 5,
    seedCostPerKg: 110,
    ureaCostPerKg: 7.1,
    dapCostPerKg: 25,
    mopCostPerKg: 22,
    organicCostPerKg: 1.1,
    pesticideCostPerLiter: 520,
    irrigationCostPerAcre: 1700,
    labourCostPerHour: 82,
    machineryCostPerHour: 410,
    transportCostPerAcre: 880,
    miscCostPerAcre: 590,
    mspPricePerQuintal: 6200,
    localMarketPricePerQuintal: 6800,
  },
  {
    id: 'pulses',
    name: 'Pulses',
    nameKey: 'farmPlanner.crops.pulses',
    baseYieldPerAcre: 12,
    seedRateKgPerAcre: 40,
    ureaKgPerAcre: 30,
    dapKgPerAcre: 20,
    mopKgPerAcre: 12,
    organicKgPerAcre: 220,
    waterLitersPerAcre: 300000,
    pesticideLitersPerAcre: 0.6,
    labourHoursPerAcre: 16,
    machineryHoursPerAcre: 3,
    seedCostPerKg: 95,
    ureaCostPerKg: 6.4,
    dapCostPerKg: 24,
    mopCostPerKg: 20,
    organicCostPerKg: 0.9,
    pesticideCostPerLiter: 360,
    irrigationCostPerAcre: 900,
    labourCostPerHour: 70,
    machineryCostPerHour: 340,
    transportCostPerAcre: 500,
    miscCostPerAcre: 360,
    mspPricePerQuintal: 6700,
    localMarketPricePerQuintal: 7100,
  },
];

const UNIT_TO_ACRES: Record<UnitKey, number> = {
  acres: 1,
  hectares: 2.47105,
  squareMeters: 0.000247105,
  squareFeet: 0.0000229568,
  bigha: 0.25,
  guntha: 0.025,
  kanal: 0.125,
  cent: 0.01,
  decimal: 0.01,
};

const BIGHA_BY_STATE: Record<string, number> = {
  maharashtra: 0.25,
  karnataka: 0.25,
  'tamil-nadu': 0.25,
  'uttar-pradesh': 0.25,
  punjab: 0.25,
  haryana: 0.25,
  'madhya-pradesh': 0.25,
  bihar: 0.25,
  'west-bengal': 0.25,
  telangana: 0.25,
  'andhra-pradesh': 0.25,
  odisha: 0.25,
  rajasthan: 0.25,
  assam: 0.25,
  'himachal-pradesh': 0.25,
  gujarat: 0.25,
  kerala: 0.25,
  jharkhand: 0.25,
  chhattisgarh: 0.25,
  uttarakhand: 0.25,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0, style: 'currency', currency: 'INR' }).format(value);

const formatNumber = (value: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);

const getInitialPlannerState = () => {
  if (typeof window === 'undefined') {
    return {
      areaValue: 5,
      landUnit: 'acres' as UnitKey,
      cropId: 'rice',
      cropVariety: 'Hybrid',
      season: 'kharif' as Season,
      state: 'maharashtra',
      district: 'Pune',
      irrigationType: 'rainfed' as IrrigationType,
      comparedCropIds: ['rice'] as string[],
    };
  }

  const stored = window.localStorage.getItem('agrisahayak-farm-planner');
  if (!stored) {
    return {
      areaValue: 5,
      landUnit: 'acres' as UnitKey,
      cropId: 'rice',
      cropVariety: 'Hybrid',
      season: 'kharif' as Season,
      state: 'maharashtra',
      district: 'Pune',
      irrigationType: 'rainfed' as IrrigationType,
      comparedCropIds: ['rice'] as string[],
    };
  }

  try {
    const parsed = JSON.parse(stored);
    return {
      areaValue: typeof parsed.areaValue === 'number' ? parsed.areaValue : 5,
      landUnit: typeof parsed.landUnit === 'string' ? (parsed.landUnit as UnitKey) : 'acres',
      cropId: typeof parsed.cropId === 'string' ? parsed.cropId : 'rice',
      cropVariety: typeof parsed.cropVariety === 'string' ? parsed.cropVariety : 'Hybrid',
      season: typeof parsed.season === 'string' ? (parsed.season as Season) : 'kharif',
      state: typeof parsed.state === 'string' ? parsed.state : 'maharashtra',
      district: typeof parsed.district === 'string' ? parsed.district : 'Pune',
      irrigationType: typeof parsed.irrigationType === 'string' ? (parsed.irrigationType as IrrigationType) : 'rainfed',
      comparedCropIds: Array.isArray(parsed.comparedCropIds) ? parsed.comparedCropIds : ['rice'],
    };
  } catch {
    return {
      areaValue: 5,
      landUnit: 'acres' as UnitKey,
      cropId: 'rice',
      cropVariety: 'Hybrid',
      season: 'kharif' as Season,
      state: 'maharashtra',
      district: 'Pune',
      irrigationType: 'rainfed' as IrrigationType,
      comparedCropIds: ['rice'] as string[],
    };
  }
};

const FarmPlanner: React.FC = () => {
  const { t, i18n } = useTranslation();
  const initialState = useMemo(() => getInitialPlannerState(), []);
  const [areaValue, setAreaValue] = useState(initialState.areaValue);
  const [landUnit, setLandUnit] = useState<UnitKey>(initialState.landUnit);
  const [cropId, setCropId] = useState(initialState.cropId);
  const [cropVariety, setCropVariety] = useState(initialState.cropVariety);
  const [season, setSeason] = useState<Season>(initialState.season);
  const [state, setState] = useState(initialState.state);
  const [district, setDistrict] = useState(initialState.district);
  const [irrigationType, setIrrigationType] = useState<IrrigationType>(initialState.irrigationType);
  const [comparedCropIds, setComparedCropIds] = useState<string[]>(initialState.comparedCropIds);

  useEffect(() => {
    localStorage.setItem(
      'agrisahayak-farm-planner',
      JSON.stringify({ areaValue, landUnit, cropId, cropVariety, season, state, district, irrigationType, comparedCropIds })
    );
  }, [areaValue, landUnit, cropId, cropVariety, season, state, district, irrigationType, comparedCropIds]);

  const selectedCrop = cropProfiles.find((crop) => crop.id === cropId) ?? cropProfiles[0];
  const selectedCropName = t(selectedCrop.nameKey);
  const districts = useMemo(() => getDistrictsForState(state), [state]);

  const areaInAcres = useMemo(() => {
    const unitFactor = landUnit === 'bigha' ? BIGHA_BY_STATE[state.toLowerCase()] ?? UNIT_TO_ACRES.bigha : UNIT_TO_ACRES[landUnit];
    return areaValue * unitFactor;
  }, [areaValue, landUnit, state]);

  const areaInHectares = areaInAcres * 0.404686;
  const areaInSquareMeters = areaInAcres * 4046.85642;

  const yieldMultiplier = irrigationType === 'irrigated' ? 1.08 : 0.94;
  const seasonMultiplier = season === 'kharif' ? 1.03 : season === 'rabi' ? 1.01 : 0.97;
  const adjustedYieldPerAcre = selectedCrop.baseYieldPerAcre * yieldMultiplier * seasonMultiplier;
  const expectedProduction = adjustedYieldPerAcre * areaInAcres;
  const minProduction = expectedProduction * 0.9;
  const maxProduction = expectedProduction * 1.15;

  const seedQty = selectedCrop.seedRateKgPerAcre * areaInAcres;
  const ureaQty = selectedCrop.ureaKgPerAcre * areaInAcres;
  const dapQty = selectedCrop.dapKgPerAcre * areaInAcres;
  const mopQty = selectedCrop.mopKgPerAcre * areaInAcres;
  const organicQty = selectedCrop.organicKgPerAcre * areaInAcres;
  const waterQty = selectedCrop.waterLitersPerAcre * areaInAcres;
  const pesticideQty = selectedCrop.pesticideLitersPerAcre * areaInAcres;
  const labourQty = selectedCrop.labourHoursPerAcre * areaInAcres;
  const machineryQty = selectedCrop.machineryHoursPerAcre * areaInAcres;

  const seedCost = seedQty * selectedCrop.seedCostPerKg;
  const ureaCost = ureaQty * selectedCrop.ureaCostPerKg;
  const dapCost = dapQty * selectedCrop.dapCostPerKg;
  const mopCost = mopQty * selectedCrop.mopCostPerKg;
  const organicCost = organicQty * selectedCrop.organicCostPerKg;
  const pesticideCost = pesticideQty * selectedCrop.pesticideCostPerLiter;
  const irrigationCost = selectedCrop.irrigationCostPerAcre * areaInAcres;
  const labourCost = labourQty * selectedCrop.labourCostPerHour;
  const machineryCost = machineryQty * selectedCrop.machineryCostPerHour;
  const transportCost = selectedCrop.transportCostPerAcre * areaInAcres;
  const miscCost = selectedCrop.miscCostPerAcre * areaInAcres;

  const totalCultivationCost = seedCost + ureaCost + dapCost + mopCost + organicCost + pesticideCost + irrigationCost + labourCost + machineryCost + transportCost + miscCost;
  const revenue = expectedProduction * (irrigationType === 'irrigated' ? selectedCrop.localMarketPricePerQuintal : selectedCrop.mspPricePerQuintal);
  const grossProfit = revenue - totalCultivationCost;
  const netProfit = grossProfit;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const roi = totalCultivationCost > 0 ? (netProfit / totalCultivationCost) * 100 : 0;
  const profitPerAcre = areaInAcres > 0 ? netProfit / areaInAcres : 0;
  const profitPerHectare = areaInHectares > 0 ? netProfit / areaInHectares : 0;
  const costPerQuintal = expectedProduction > 0 ? totalCultivationCost / expectedProduction : 0;
  const waterUseEfficiency = expectedProduction > 0 ? (expectedProduction / waterQty) * 1000 : 0;
  const fertilizerUseEfficiency = expectedProduction > 0 ? expectedProduction / (ureaQty + dapQty + mopQty + organicQty) : 0;
  const nitrogenUseEfficiency = expectedProduction > 0 ? expectedProduction / (ureaQty * 0.46 + dapQty * 0.18 + organicQty * 0.02) : 0;
  const yieldPerUnitArea = areaInAcres > 0 ? expectedProduction / areaInAcres : 0;

  const summaryCards = [
    { label: t('farmPlanner.summary.totalCultivationCost'), value: formatCurrency(totalCultivationCost), tone: 'bg-primary-50 text-primary-700' },
    { label: t('farmPlanner.summary.estimatedRevenue'), value: formatCurrency(revenue), tone: 'bg-secondary-50 text-secondary-700' },
    { label: t('farmPlanner.summary.grossProfit'), value: formatCurrency(grossProfit), tone: 'bg-green-50 text-green-700' },
    { label: t('farmPlanner.summary.roi'), value: `${formatNumber(roi)}%`, tone: 'bg-amber-50 text-amber-700' },
  ];

  const comparisonRows = comparedCropIds
    .map((cropIdItem) => {
      const crop = cropProfiles.find((entry) => entry.id === cropIdItem);
      if (!crop) return null;
      const localArea = areaInAcres;
      const localYield = crop.baseYieldPerAcre * (irrigationType === 'irrigated' ? 1.08 : 0.94) * (season === 'kharif' ? 1.03 : season === 'rabi' ? 1.01 : 0.97) * localArea;
      const seed = crop.seedRateKgPerAcre * localArea;
      const cost = (seed * crop.seedCostPerKg) + (crop.ureaKgPerAcre * localArea * crop.ureaCostPerKg) + (crop.dapKgPerAcre * localArea * crop.dapCostPerKg) + (crop.mopKgPerAcre * localArea * crop.mopCostPerKg) + (crop.organicKgPerAcre * localArea * crop.organicCostPerKg) + (crop.pesticideLitersPerAcre * localArea * crop.pesticideCostPerLiter) + (crop.irrigationCostPerAcre * localArea) + (crop.labourHoursPerAcre * localArea * crop.labourCostPerHour) + (crop.machineryHoursPerAcre * localArea * crop.machineryCostPerHour) + (crop.transportCostPerAcre * localArea) + (crop.miscCostPerAcre * localArea);
      const rev = localYield * (irrigationType === 'irrigated' ? crop.localMarketPricePerQuintal : crop.mspPricePerQuintal);
      const profit = rev - cost;
      return { crop, profit, revenue: rev, cost, yield: localYield };
    })
    .filter(Boolean) as Array<{ crop: CropProfile; profit: number; revenue: number; cost: number; yield: number }>;

  const insights = useMemo(() => {
    const items: Array<{ title: string; description: string; level: InsightLevel }> = [];

    if (grossProfit > 0) {
      items.push({
        title: t('farmPlanner.insights.goodProfit'),
        description: t('farmPlanner.insights.goodProfitDesc', { crop: selectedCropName }),
        level: 'good',
      });
    } else {
      items.push({
        title: t('farmPlanner.insights.attentionProfit'),
        description: t('farmPlanner.insights.attentionProfitDesc', { crop: selectedCropName }),
        level: 'attention',
      });
    }

    if (waterUseEfficiency > 0.25) {
      items.push({
        title: t('farmPlanner.insights.waterEfficient'),
        description: t('farmPlanner.insights.waterEfficientDesc'),
        level: 'good',
      });
    } else {
      items.push({
        title: t('farmPlanner.insights.waterAttention'),
        description: t('farmPlanner.insights.waterAttentionDesc'),
        level: 'moderate',
      });
    }

    if (profitMargin > 15) {
      items.push({
        title: t('farmPlanner.insights.fertilizerSavings'),
        description: t('farmPlanner.insights.fertilizerSavingsDesc'),
        level: 'good',
      });
    } else {
      items.push({
        title: t('farmPlanner.insights.costControl'),
        description: t('farmPlanner.insights.costControlDesc'),
        level: 'moderate',
      });
    }

    const bestAlternative = comparisonRows
      .slice()
      .sort((a, b) => b.profit - a.profit)[1];

    if (bestAlternative) {
      items.push({
        title: t('farmPlanner.insights.alternativeCrop'),
        description: t('farmPlanner.insights.alternativeCropDesc', { crop: bestAlternative.crop.name, value: formatCurrency(bestAlternative.profit) }),
        level: bestAlternative.profit > grossProfit ? 'good' : 'moderate',
      });
    }

    return items;
  }, [comparisonRows, grossProfit, profitMargin, selectedCropName, t, waterUseEfficiency]);

  const handleExportPdf = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>AgriSahayak - Farm Planner Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
            h1, h2 { color: #166534; }
            .card { border: 1px solid #d1d5db; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            td, th { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>AgriSahayak Farm Planner Report</h1>
          <p><strong>${t('farmPlanner.report.farmer')}</strong> ${cropVariety || t('farmPlanner.report.notProvided')}</p>
          <p><strong>${t('farmPlanner.report.crop')}</strong> ${selectedCropName}</p>
          <p><strong>${t('farmPlanner.report.area')}</strong> ${formatNumber(areaValue)} ${t(`farmPlanner.units.${landUnit}`)}</p>
          <p><strong>${t('farmPlanner.report.location')}</strong> ${district}, ${state}</p>
          <div class="card">
            <h2>${t('farmPlanner.report.summary')}</h2>
            <p>${t('farmPlanner.report.totalCost')}: ${formatCurrency(totalCultivationCost)}</p>
            <p>${t('farmPlanner.report.revenue')}: ${formatCurrency(revenue)}</p>
            <p>${t('farmPlanner.report.netProfit')}: ${formatCurrency(netProfit)}</p>
            <p>${t('farmPlanner.report.profitMargin')}: ${formatNumber(profitMargin)}%</p>
          </div>
          <div class="card">
            <h2>${t('farmPlanner.report.inputRequirements')}</h2>
            <table>
              <tr><th>${t('farmPlanner.report.item')}</th><th>${t('farmPlanner.report.value')}</th></tr>
              <tr><td>${t('farmPlanner.report.seed')}</td><td>${formatNumber(seedQty)} kg</td></tr>
              <tr><td>${t('farmPlanner.report.water')}</td><td>${formatNumber(waterQty / 1000)} m³</td></tr>
              <tr><td>${t('farmPlanner.report.labour')}</td><td>${formatNumber(labourQty)} hrs</td></tr>
              <tr><td>${t('farmPlanner.report.machinery')}</td><td>${formatNumber(machineryQty)} hrs</td></tr>
            </table>
          </div>
          <div class="card">
            <h2>${t('farmPlanner.report.recommendations')}</h2>
            <ul>${insights.map((item) => `<li><strong>${item.title}</strong> - ${item.description}</li>`).join('')}</ul>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const toggleComparedCrop = (targetId: string) => {
    setComparedCropIds((current) => {
      if (current.includes(targetId)) {
        return current.filter((id) => id !== targetId);
      }
      return [...current, targetId].slice(-3);
    });
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
              <Calculator className="h-4 w-4" />
              {t('farmPlanner.eyebrow')}
            </div>
            <h1 className="mt-4 text-3xl font-bold text-accent-900 sm:text-4xl">{t('farmPlanner.title')}</h1>
            <p className="mt-3 max-w-3xl text-lg text-accent-600">{t('farmPlanner.description')}</p>
          </div>
          <button onClick={handleExportPdf} className="btn-primary flex items-center justify-center gap-2">
            <Download className="h-5 w-5" />
            {t('farmPlanner.exportPdf')}
          </button>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="card space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-accent-900">
              <Sprout className="h-5 w-5 text-primary-600" />
              {t('farmPlanner.formTitle')}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-accent-700">{t('farmPlanner.landArea')}</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={areaValue}
                    onChange={(event) => setAreaValue(Number(event.target.value))}
                    className="input-field"
                  />
                  <select value={landUnit} onChange={(event) => setLandUnit(event.target.value as UnitKey)} className="input-field max-w-[170px]">
                    <option value="acres">{t('farmPlanner.units.acres')}</option>
                    <option value="hectares">{t('farmPlanner.units.hectares')}</option>
                    <option value="squareMeters">{t('farmPlanner.units.squareMeters')}</option>
                    <option value="squareFeet">{t('farmPlanner.units.squareFeet')}</option>
                    <option value="bigha">{t('farmPlanner.units.bigha')}</option>
                    <option value="guntha">{t('farmPlanner.units.guntha')}</option>
                    <option value="kanal">{t('farmPlanner.units.kanal')}</option>
                    <option value="cent">{t('farmPlanner.units.cent')}</option>
                    <option value="decimal">{t('farmPlanner.units.decimal')}</option>
                  </select>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-accent-700">{t('farmPlanner.crop')}</span>
                <select value={cropId} onChange={(event) => setCropId(event.target.value)} className="input-field">
                  {cropProfiles.map((crop) => (
                    <option key={crop.id} value={crop.id}>{t(crop.nameKey)}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-accent-700">{t('farmPlanner.cropVariety')}</span>
                <input value={cropVariety} onChange={(event) => setCropVariety(event.target.value)} className="input-field" placeholder={t('farmPlanner.cropVarietyPlaceholder')} />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-accent-700">{t('farmPlanner.season')}</span>
                <select value={season} onChange={(event) => setSeason(event.target.value as Season)} className="input-field">
                  <option value="kharif">{t('farmPlanner.seasons.kharif')}</option>
                  <option value="rabi">{t('farmPlanner.seasons.rabi')}</option>
                  <option value="summer">{t('farmPlanner.seasons.summer')}</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-accent-700">{t('farmPlanner.state')}</span>
                <select value={state} onChange={(event) => setState(event.target.value)} className="input-field">
                  {getAllStates().map((stateName) => (
                    <option key={stateName} value={stateName}>{i18n.language === 'hi' ? stateName : stateName}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-accent-700">{t('farmPlanner.district')}</span>
                <select value={district} onChange={(event) => setDistrict(event.target.value)} className="input-field">
                  {districts.map((districtName) => (
                    <option key={districtName} value={districtName}>{districtName}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-accent-700">{t('farmPlanner.irrigation')}</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setIrrigationType('rainfed')}
                    className={`rounded-xl border px-4 py-3 text-left ${irrigationType === 'rainfed' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-accent-200 bg-white text-accent-700'}`}
                  >
                    <div className="font-semibold">{t('farmPlanner.irrigationModes.rainfed')}</div>
                    <div className="text-sm">{t('farmPlanner.irrigationModes.rainfedDesc')}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIrrigationType('irrigated')}
                    className={`rounded-xl border px-4 py-3 text-left ${irrigationType === 'irrigated' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-accent-200 bg-white text-accent-700'}`}
                  >
                    <div className="font-semibold">{t('farmPlanner.irrigationModes.irrigated')}</div>
                    <div className="text-sm">{t('farmPlanner.irrigationModes.irrigatedDesc')}</div>
                  </button>
                </div>
              </label>
            </div>
          </div>

          <div className="card space-y-5">
            <div className="flex items-center gap-2 text-lg font-semibold text-accent-900">
              <BarChart3 className="h-5 w-5 text-secondary-600" />
              {t('farmPlanner.quickSummary')}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {summaryCards.map((card) => (
                <div key={card.label} className={`rounded-2xl p-4 ${card.tone}`}>
                  <p className="text-sm font-medium">{card.label}</p>
                  <p className="mt-2 text-xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-accent-200 bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-accent-900">{t('farmPlanner.profile.title')}</p>
                  <p className="mt-1 text-sm text-accent-600">{t('farmPlanner.profile.subtitle', { crop: selectedCropName })}</p>
                </div>
                <div className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  {t('farmPlanner.profile.focus', { value: profitMargin > 15 ? t('farmPlanner.profile.focusHigh') : profitMargin > 8 ? t('farmPlanner.profile.focusModerate') : t('farmPlanner.profile.focusLow') })}
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-accent-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-500">{t('farmPlanner.profile.farmerName')}</p>
                  <p className="mt-1 font-semibold text-accent-900">{cropVariety || t('farmPlanner.report.notProvided')}</p>
                </div>
                <div className="rounded-xl border border-accent-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-500">{t('farmPlanner.profile.location')}</p>
                  <p className="mt-1 font-semibold text-accent-900">{district}, {state}</p>
                </div>
                <div className="rounded-xl border border-accent-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-500">{t('farmPlanner.profile.crop')}</p>
                  <p className="mt-1 font-semibold text-accent-900">{selectedCropName}</p>
                </div>
                <div className="rounded-xl border border-accent-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-500">{t('farmPlanner.profile.season')}</p>
                  <p className="mt-1 font-semibold text-accent-900">{t(`farmPlanner.seasons.${season}`)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent-700">
                <Landmark className="h-4 w-4 text-primary-600" />
                {t('farmPlanner.areaConversion')}
              </div>
              <p className="mt-2 text-sm text-accent-600">
                {t('farmPlanner.areaConversionText', { acres: formatNumber(areaInAcres), hectares: formatNumber(areaInHectares), sqm: formatNumber(areaInSquareMeters) })}
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-accent-200 bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-accent-50 text-left text-accent-700">
                    <tr>
                      <th className="px-3 py-2 font-semibold">{t('farmPlanner.profile.unit')}</th>
                      <th className="px-3 py-2 font-semibold">{t('farmPlanner.profile.value')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[{ label: t('farmPlanner.units.acres'), value: formatNumber(areaInAcres) }, { label: t('farmPlanner.units.hectares'), value: formatNumber(areaInHectares) }, { label: t('farmPlanner.units.squareMeters'), value: formatNumber(areaInSquareMeters) }].map((row) => (
                      <tr key={row.label} className="border-t border-accent-100">
                        <td className="px-3 py-2 text-accent-700">{row.label}</td>
                        <td className="px-3 py-2 font-semibold text-accent-900">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-accent-900">{t('farmPlanner.sections.cropYield')}</h2>
              <div className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">{t('farmPlanner.sections.cropYieldBadge')}</div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-primary-50 p-4">
                <p className="text-sm text-primary-700">{t('farmPlanner.metrics.expectedYieldPerAcre')}</p>
                <p className="mt-2 text-2xl font-bold text-primary-800">{formatNumber(adjustedYieldPerAcre)} {t('farmPlanner.metrics.quintalsPerAcre')}</p>
              </div>
              <div className="rounded-2xl bg-secondary-50 p-4">
                <p className="text-sm text-secondary-700">{t('farmPlanner.metrics.totalProduction')}</p>
                <p className="mt-2 text-2xl font-bold text-secondary-800">{formatNumber(expectedProduction)} {t('farmPlanner.metrics.quintals')}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-sm text-amber-700">{t('farmPlanner.metrics.minAvgMax')}</p>
                <p className="mt-2 text-xl font-bold text-amber-800">{formatNumber(minProduction)} - {formatNumber(maxProduction)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-accent-900">{t('farmPlanner.sections.inputRequirements')}</h2>
              <div className="rounded-full bg-secondary-100 px-3 py-1 text-sm font-semibold text-secondary-700">{t('farmPlanner.sections.inputRequirementsBadge')}</div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[{ label: t('farmPlanner.metrics.seed'), value: `${formatNumber(seedQty)} kg` }, { label: t('farmPlanner.metrics.urea'), value: `${formatNumber(ureaQty)} kg` }, { label: t('farmPlanner.metrics.dap'), value: `${formatNumber(dapQty)} kg` }, { label: t('farmPlanner.metrics.mop'), value: `${formatNumber(mopQty)} kg` }, { label: t('farmPlanner.metrics.organic'), value: `${formatNumber(organicQty)} kg` }, { label: t('farmPlanner.metrics.water'), value: `${formatNumber(waterQty / 1000)} m³` }, { label: t('farmPlanner.metrics.pesticide'), value: `${formatNumber(pesticideQty)} L` }, { label: t('farmPlanner.metrics.labour'), value: `${formatNumber(labourQty)} hrs` }, { label: t('farmPlanner.metrics.machinery'), value: `${formatNumber(machineryQty)} hrs` }].map((item) => (
                <div key={item.label} className="rounded-2xl border border-accent-200 p-4">
                  <p className="text-sm text-accent-600">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-accent-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card">
            <div className="flex items-center gap-2 text-xl font-semibold text-accent-900">
              <TrendingUp className="h-5 w-5 text-green-600" />
              {t('farmPlanner.sections.costAnalysis')}
            </div>
            <div className="mt-5 space-y-3">
              {[
                { label: t('farmPlanner.costSeeds'), value: seedCost },
                { label: t('farmPlanner.costFertilizers'), value: ureaCost + dapCost + mopCost + organicCost },
                { label: t('farmPlanner.costPesticides'), value: pesticideCost },
                { label: t('farmPlanner.costIrrigation'), value: irrigationCost },
                { label: t('farmPlanner.costLabour'), value: labourCost },
                { label: t('farmPlanner.costMachinery'), value: machineryCost },
                { label: t('farmPlanner.costTransport'), value: transportCost },
                { label: t('farmPlanner.costMiscellaneous'), value: miscCost },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-accent-200 px-4 py-3">
                  <span className="text-sm font-medium text-accent-700">{item.label}</span>
                  <span className="text-sm font-semibold text-accent-900">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-primary-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('farmPlanner.costTotal')}</span>
                <span className="text-2xl font-bold">{formatCurrency(totalCultivationCost)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 text-xl font-semibold text-accent-900">
              <Sparkles className="h-5 w-5 text-primary-600" />
              {t('farmPlanner.sections.revenueProfit')}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm text-green-700">{t('farmPlanner.metrics.estimatedRevenue')}</p>
                <p className="mt-2 text-2xl font-bold text-green-800">{formatCurrency(revenue)}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm text-blue-700">{t('farmPlanner.metrics.grossProfit')}</p>
                <p className="mt-2 text-2xl font-bold text-blue-800">{formatCurrency(grossProfit)}</p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-4">
                <p className="text-sm text-violet-700">{t('farmPlanner.metrics.netProfit')}</p>
                <p className="mt-2 text-2xl font-bold text-violet-800">{formatCurrency(netProfit)}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-sm text-amber-700">{t('farmPlanner.metrics.profitMargin')}</p>
                <p className="mt-2 text-2xl font-bold text-amber-800">{formatNumber(profitMargin)}%</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-accent-200 p-4">
              <div className="flex items-center justify-between text-sm text-accent-600">
                <span>{t('farmPlanner.metrics.profitPerAcre')}</span>
                <span className="font-semibold text-accent-900">{formatCurrency(profitPerAcre)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-accent-600">
                <span>{t('farmPlanner.metrics.profitPerHectare')}</span>
                <span className="font-semibold text-accent-900">{formatCurrency(profitPerHectare)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-accent-600">
                <span>{t('farmPlanner.metrics.roi')}</span>
                <span className="font-semibold text-accent-900">{formatNumber(roi)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card">
            <div className="flex items-center gap-2 text-xl font-semibold text-accent-900">
              <Droplets className="h-5 w-5 text-cyan-600" />
              {t('farmPlanner.sections.inputEfficiency')}
            </div>
            <div className="mt-5 space-y-3">
              {[{ label: t('farmPlanner.metrics.waterUseEfficiency'), value: `${formatNumber(waterUseEfficiency)} q/1000L` }, { label: t('farmPlanner.metrics.fertilizerUseEfficiency'), value: `${formatNumber(fertilizerUseEfficiency)} q/kg` }, { label: t('farmPlanner.metrics.nitrogenUseEfficiency'), value: `${formatNumber(nitrogenUseEfficiency)} q/kg` }, { label: t('farmPlanner.metrics.costPerQuintal'), value: formatCurrency(costPerQuintal) }, { label: t('farmPlanner.metrics.yieldPerUnitArea'), value: `${formatNumber(yieldPerUnitArea)} q/ac` }].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-accent-200 px-4 py-3">
                  <span className="text-sm font-medium text-accent-700">{item.label}</span>
                  <span className="text-sm font-semibold text-accent-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 text-xl font-semibold text-accent-900">
              <Leaf className="h-5 w-5 text-green-600" />
              {t('farmPlanner.sections.aiInsights')}
            </div>
            <div className="mt-5 space-y-3">
              {insights.map((item) => (
                <div key={item.title} className={`rounded-2xl border px-4 py-3 ${item.level === 'good' ? 'border-green-200 bg-green-50' : item.level === 'attention' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                  <div className="flex items-start gap-2">
                    {item.level === 'good' ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" /> : item.level === 'attention' ? <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" /> : <Info className="mt-0.5 h-5 w-5 text-amber-600" />}
                    <div>
                      <p className="font-semibold text-accent-900">{item.title}</p>
                      <p className="mt-1 text-sm text-accent-700">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-accent-900">{t('farmPlanner.sections.compareCrops')}</h2>
              <div className="text-sm text-accent-600">{t('farmPlanner.sections.compareCropsHint')}</div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {cropProfiles.map((crop) => {
                const isActive = comparedCropIds.includes(crop.id);
                return (
                  <button key={crop.id} type="button" onClick={() => toggleComparedCrop(crop.id)} className={`rounded-2xl border px-4 py-3 text-left ${isActive ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-accent-200 bg-white text-accent-700'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{t(crop.nameKey)}</span>
                      {isActive ? <CheckCircle2 className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 space-y-3">
              {comparisonRows.map((row) => (
                <div key={row.crop.id} className="rounded-2xl border border-accent-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-accent-900">{t(row.crop.nameKey)}</p>
                      <p className="text-sm text-accent-600">{t('farmPlanner.compare.profitEstimate', { profit: formatCurrency(row.profit) })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-accent-600">{t('farmPlanner.compare.revenue')}</p>
                      <p className="font-semibold text-accent-900">{formatCurrency(row.revenue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 text-xl font-semibold text-accent-900">
              <Tractor className="h-5 w-5 text-secondary-600" />
              {t('farmPlanner.sections.dashboard')}
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-accent-200 p-4">
                <div className="flex items-center justify-between text-sm text-accent-700">
                  <span>{t('farmPlanner.dashboard.costDistribution')}</span>
                  <span className="font-semibold">{formatCurrency(totalCultivationCost)}</span>
                </div>
                <div className="mt-3 h-3 rounded-full bg-accent-100">
                  <div className="h-3 rounded-full bg-primary-600" style={{ width: `${Math.min(100, (totalCultivationCost > 0 ? (seedCost + ureaCost + dapCost + mopCost + organicCost) / totalCultivationCost : 0) * 100)}%` }} />
                </div>
              </div>
              <div className="rounded-2xl border border-accent-200 p-4">
                <div className="flex items-center justify-between text-sm text-accent-700">
                  <span>{t('farmPlanner.dashboard.revenueVsProfit')}</span>
                  <span className="font-semibold">{formatCurrency(revenue)} / {formatCurrency(grossProfit)}</span>
                </div>
                <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-accent-100">
                  <div className="h-3 rounded-full bg-secondary-600" style={{ width: `${Math.min(100, (revenue > 0 ? revenue / (revenue + Math.max(totalCultivationCost, 1)) : 0) * 100)}%` }} />
                  <div className="h-3 rounded-full bg-primary-600" style={{ width: `${Math.min(100, (grossProfit > 0 ? grossProfit / (revenue + Math.max(totalCultivationCost, 1)) : 0) * 100)}%` }} />
                </div>
              </div>
              <div className="rounded-2xl border border-accent-200 p-4">
                <div className="flex items-center justify-between text-sm text-accent-700">
                  <span>{t('farmPlanner.dashboard.yieldSummary')}</span>
                  <span className="font-semibold">{formatNumber(expectedProduction)} q</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="h-2 flex-1 rounded-full bg-green-200" />
                  <div className="h-2 flex-1 rounded-full bg-amber-200" />
                  <div className="h-2 flex-1 rounded-full bg-red-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FarmPlanner;
