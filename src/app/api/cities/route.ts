import { NextRequest, NextResponse } from 'next/server';

// Country code mapping for GeoNames API
const countryCodeMap: Record<string, string> = {
  'Germany': 'DE',
  'Austria': 'AT',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'France': 'FR',
  'Italy': 'IT',
  'Spain': 'ES',
  'Portugal': 'PT',
  'Poland': 'PL',
  'Romania': 'RO',
  'Greece': 'GR',
  'Hungary': 'HU',
  'Czech Republic': 'CZ',
  'Sweden': 'SE',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Norway': 'NO',
  'Switzerland': 'CH',
  'Ireland': 'IE',
  'Croatia': 'HR',
  'Slovenia': 'SI',
  'Slovakia': 'SK',
  'Serbia': 'RS',
  'North Macedonia': 'MK',
  'Albania': 'AL',
  'Montenegro': 'ME',
  'Bosnia and Herzegovina': 'BA',
  'Kosovo': 'XK',
  'Estonia': 'EE',
  'Latvia': 'LV',
  'Lithuania': 'LT',
  'Cyprus': 'CY',
  'Malta': 'MT',
  'Luxembourg': 'LU',
  'Iceland': 'IS',
  'United Kingdom': 'GB',
  'Bulgaria': 'BG',
};

type GeoNamesCity = {
  geonameId: number;
  name: string;
  population: number;
  adminName1: string; // Region/province name
};

type GeoNamesResponse = {
  geonames: GeoNamesCity[];
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');

  if (!country) {
    return NextResponse.json({ error: 'Country is required' }, { status: 400 });
  }

  const countryCode = countryCodeMap[country];
  if (!countryCode) {
    return NextResponse.json({ error: `Country ${country} is not supported` }, { status: 400 });
  }

  try {
    // GeoNames API - free tier with username
    // Gets cities with population > 5000
    const url = new URL('http://api.geonames.org/searchJSON');
    url.searchParams.set('country', countryCode);
    url.searchParams.set('featureClass', 'P'); // Populated places
    url.searchParams.set('minPopulation', '5000');
    url.searchParams.set('maxRows', '500');
    url.searchParams.set('username', process.env.GEONAMES_USERNAME || 'demo');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`GeoNames API error: ${response.status}`);
    }

    const data: GeoNamesResponse = await response.json();

    // Sort by population (largest first) and map to simpler format
    const cities = data.geonames
      .sort((a, b) => b.population - a.population)
      .map(city => ({
        id: city.geonameId.toString(),
        name: city.name,
        region: city.adminName1,
        population: city.population,
      }));

    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return NextResponse.json({
      cities: [],
      error: 'Failed to fetch cities. Please try again.',
    });
  }
}

