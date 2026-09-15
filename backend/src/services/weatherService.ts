import axios from 'axios';

const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY || '';
const OWM_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  feelsLike: number;
  windSpeed: number;
  pressure: number;
  cloudCover: number;
  description: string;
  rainfall: number;
  latitude: number;
  longitude: number;
  agriculturalTips: string[];
}

/** Generate agricultural tips from weather data */
const getAgriculturalTips = (data: {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  cloudCover: number;
}): string[] => {
  const tips: string[] = [];

  if (data.temperature > 38) {
    tips.push('Extreme heat: Irrigate early morning or evening to reduce evaporation loss.');
    tips.push('Consider shade nets for sensitive crops like vegetables and flowers.');
  } else if (data.temperature > 32) {
    tips.push('High temperature: Increase irrigation frequency and check soil moisture daily.');
  } else if (data.temperature < 10) {
    tips.push('Cold weather: Protect sensitive crops from frost using covers or mulching.');
  }

  if (data.humidity > 80) {
    tips.push('High humidity: Monitor for fungal diseases; ensure good air circulation in crop rows.');
    tips.push('Avoid foliar spray applications – they may encourage disease spread.');
  } else if (data.humidity < 30) {
    tips.push('Low humidity: Increase irrigation frequency; drip irrigation recommended.');
  }

  if (data.rainfall > 10) {
    tips.push('Heavy rainfall expected: Ensure field drainage channels are clear.');
    tips.push('Delay pesticide/fertilizer application until rains subside.');
  } else if (data.rainfall > 0) {
    tips.push('Light rainfall: Good time for transplanting seedlings.');
  }

  if (data.windSpeed > 30) {
    tips.push('Strong winds: Stake tall crops and delay spraying operations.');
  }

  if (tips.length === 0) {
    tips.push('Pleasant weather conditions for most farming activities.');
    tips.push('Good time for land preparation and regular crop monitoring.');
  }

  return tips;
};

export const fetchWeatherData = async (
  lat: number,
  lon: number
): Promise<{ success: boolean; data?: WeatherData; offline?: boolean; error?: string }> => {
  if (!OPENWEATHER_KEY || OPENWEATHER_KEY === 'xxxxxxxxxxxxxxxxxxxx') {
    console.warn('[weatherService] OPENWEATHER_KEY not configured – returning fallback data');
    return {
      success: true,
      offline: true,
      data: {
        location: 'Offline Mode',
        temperature: 28,
        humidity: 65,
        feelsLike: 30,
        windSpeed: 8,
        pressure: 1013,
        cloudCover: 20,
        description: 'Weather data unavailable (API key not set)',
        rainfall: 0,
        latitude: lat,
        longitude: lon,
        agriculturalTips: [
          'Configure OPENWEATHER_KEY in backend .env to get real weather data.',
          'General advice: Monitor local weather through IMD (mausam.imd.gov.in).',
        ],
      },
    };
  }

  try {
    const response = await axios.get(OWM_URL, {
      params: { lat, lon, appid: OPENWEATHER_KEY, units: 'metric' },
      timeout: 10000,
    });

    const d = response.data;
    const rainfall = d.rain?.['1h'] ?? d.rain?.['3h'] ?? 0;
    const weatherData: WeatherData = {
      location: d.name,
      temperature: Math.round(d.main.temp),
      humidity: d.main.humidity,
      feelsLike: Math.round(d.main.feels_like),
      windSpeed: d.wind.speed,
      pressure: d.main.pressure,
      cloudCover: d.clouds.all,
      description: d.weather[0].description,
      rainfall,
      latitude: lat,
      longitude: lon,
      agriculturalTips: getAgriculturalTips({
        temperature: Math.round(d.main.temp),
        humidity: d.main.humidity,
        rainfall,
        windSpeed: d.wind.speed,
        cloudCover: d.clouds.all,
      }),
    };

    return { success: true, data: weatherData };
  } catch (error: unknown) {
    console.error('[weatherService] Error:', error);
    return { success: false, error: 'Failed to fetch weather data' };
  }
};
