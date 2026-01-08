import { NextRequest, NextResponse } from 'next/server';

// Environment variables needed:
// DHL_API_KEY - Get from https://developer.dhl.com
// SPEEDY_USERNAME - Speedy account username
// SPEEDY_PASSWORD - Speedy account password

type SpeedyOffice = {
  id: number;
  name: string;
  address: {
    fullAddressString: string;
    siteName: string;
    streetName: string;
    streetNo: string;
  };
};

type SpeedyResponse = {
  offices: SpeedyOffice[];
};

type DHLLocation = {
  url: string;
  location: {
    ids: { locationId: string }[];
    keyword: string;
    keywordId: string;
    type: string;
  };
  name: string;
  place: {
    address: {
      countryCode: string;
      postalCode: string;
      addressLocality: string;
      streetAddress: string;
    };
  };
};

type DHLResponse = {
  locations: DHLLocation[];
};

// Country code mapping for DHL API
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

async function fetchSpeedyOffices(city: string): Promise<Array<{ id: string; name: string; address: string }>> {
  const username = process.env.SPEEDY_USERNAME;
  const password = process.env.SPEEDY_PASSWORD;

  if (!username || !password) {
    console.error('Speedy API credentials not configured');
    throw new Error('Speedy API not configured');
  }

  try {
    // Speedy API uses JSON-RPC style requests
    const response = await fetch('https://api.speedy.bg/v1/location/office/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: username,
        password: password,
        language: 'EN',
        countryId: 100, // Bulgaria country ID in Speedy system
      }),
    });

    if (!response.ok) {
      throw new Error(`Speedy API error: ${response.status}`);
    }

    const data: SpeedyResponse = await response.json();

    // Filter offices by city name (case-insensitive match)
    const cityLower = city.toLowerCase();
    const filteredOffices = data.offices.filter(office => {
      const officeSite = office.address.siteName?.toLowerCase() || '';
      const officeAddress = office.address.fullAddressString?.toLowerCase() || '';
      return officeSite.includes(cityLower) || officeAddress.includes(cityLower);
    });

    return filteredOffices.map(office => ({
      id: `speedy-${office.id}`,
      name: office.name,
      address: office.address.fullAddressString || 
        `${office.address.streetName} ${office.address.streetNo}, ${office.address.siteName}`,
    }));
  } catch (error) {
    console.error('Failed to fetch Speedy offices:', error);
    throw error;
  }
}

async function fetchDHLServicePoints(countryCode: string, city: string, streetAddress?: string): Promise<Array<{ id: string; name: string; address: string }>> {
  const apiKey = process.env.DHL_API_KEY;

  if (!apiKey) {
    console.error('DHL API key not configured');
    throw new Error('DHL API not configured');
  }

  try {
    // DHL Location Finder API
    // Documentation: https://developer.dhl.com/api-reference/location-finder-unified
    const url = new URL('https://api.dhl.com/location-finder/v1/find-by-address');
    url.searchParams.set('countryCode', countryCode);
    url.searchParams.set('addressLocality', city); // Filter by city
    if (streetAddress) {
      url.searchParams.set('streetAddress', city + ' ' +streetAddress);
    }
    // url.searchParams.set('locationType', 'servicepoint'); // Service points only
    url.searchParams.set('limit', '50');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'DHL-API-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('DHL API error:', await response.text());
      throw new Error(`DHL API error: ${response.status}`);
    }

    const data: DHLResponse = await response.json();

    if (!data.locations || data.locations.length === 0) {
      return [];
    }

    console.log(data.locations.length);

    return data.locations.map(location => ({
      id: `dhl-${location.location.ids?.[0]?.locationId || location.location.keywordId || Math.random().toString(36).slice(2)}`,
      name: location.name,
      address: [
        location.place.address.streetAddress,
        location.place.address.postalCode,
        location.place.address.addressLocality
      ].filter(Boolean).join(', '),
    }));
  } catch (error) {
    console.error('Failed to fetch DHL service points:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const city = searchParams.get('city');
  const search = searchParams.get('search') || ''; // Street address search

  if (!country) {
    return NextResponse.json({ error: 'Country is required' }, { status: 400 });
  }

  if (!city) {
    return NextResponse.json({ error: 'City is required' }, { status: 400 });
  }

  try {
    // Bulgaria uses Speedy
    // if (country === 'Bulgaria') {
    //   const offices = await fetchSpeedyOffices(city);
    //   return NextResponse.json({
    //     courier: 'Speedy',
    //     offices,
    //   });
    // }

    // All other countries use DHL
    const countryCode = countryCodeMap[country];
    if (!countryCode) {
      return NextResponse.json({ 
        error: `Country ${country} is not supported` 
      }, { status: 400 });
    }

    const offices = await fetchDHLServicePoints(countryCode, city, search);
    return NextResponse.json({
      courier: 'DHL',
      offices,
    });
  } catch (error) {
    console.error('Failed to fetch courier offices:', error);
    
    // Return empty array with error message - let frontend handle gracefully
    return NextResponse.json({
      courier: country === 'Bulgaria' ? 'Speedy' : 'DHL',
      offices: [],
      error: 'Failed to fetch offices. Please try again later.',
    });
  }
}
