'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import './checkout.css';

// European countries
const europeanCountries = [
  'Albania',
  'Austria',
  'Belgium',
  'Bosnia and Herzegovina',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Kosovo',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Montenegro',
  'Netherlands',
  'North Macedonia',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Serbia',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
  'United Kingdom',
];

type City = {
  id: string;
  name: string;
  region: string;
  population: number;
};

type CourierOffice = {
  id: string;
  name: string;
  address: string;
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice, totalItems } = useCart();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    city: '',
    courierOffice: '',
  });
  
  // Cities state
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  
  // Offices state
  const [courier, setCourier] = useState<string>('');
  const [offices, setOffices] = useState<CourierOffice[]>([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState(false);
  const [officesError, setOfficesError] = useState<string | null>(null);
  const [officeSearch, setOfficeSearch] = useState<string>('');
  const officeSearchRef = useRef<string>(''); // Track latest search value
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayTotal = (totalPrice / 100).toFixed(2);
  
  const cityOptions = cities.map(city => ({ 
    value: city.name, 
    label: city.region ? `${city.name}, ${city.region}` : city.name
  }));
  
  const officeOptions = offices.map(office => ({ 
    value: office.id, 
    label: `${office.name} - ${office.address}` 
  }));

  // Determine courier based on country
  const selectedCourier = formData.country === 'Bulgaria' ? 'Speedy' : formData.country ? 'DHL' : '';

  // Fetch cities when country changes
  useEffect(() => {
    if (!formData.country) {
      setCities([]);
      setCitiesError(null);
      setFormData(prev => ({ ...prev, city: '', courierOffice: '' }));
      setOffices([]);
      setCourier('');
      return;
    }

    async function fetchCities() {
      setIsLoadingCities(true);
      setCities([]);
      setCitiesError(null);
      setFormData(prev => ({ ...prev, city: '', courierOffice: '' }));
      setOffices([]);

      try {
        const response = await fetch(`/api/cities?country=${encodeURIComponent(formData.country)}`);
        const data = await response.json();

        if (data.error) {
          setCitiesError(data.error);
        } else if (data.cities?.length === 0) {
          setCitiesError('No cities found for this country.');
        } else {
          setCities(data.cities || []);
        }
      } catch (err) {
        console.error('Failed to fetch cities:', err);
        setCitiesError('Failed to load cities. Please try again.');
      } finally {
        setIsLoadingCities(false);
      }
    }

    fetchCities();
  }, [formData.country]);

  // Fetch offices function - reusable for initial load and search
  const fetchOffices = useCallback(async (search: string = '') => {
    if (!formData.country || !formData.city) {
      return;
    }

    setIsLoadingOffices(true);
    setOfficesError(null);

    try {
      const params = new URLSearchParams({
        country: formData.country,
        city: formData.city,
      });
      if (search) {
        params.set('search', search);
      }

      const response = await fetch(`/api/courier-offices?${params.toString()}`);
      const data = await response.json();

      // Only update if this is still the latest search
      if (search === officeSearchRef.current) {
        setCourier(data.courier || '');
        setOffices(data.offices || []);
        
        if (data.error) {
          setOfficesError(data.error);
        } else if (data.offices?.length === 0) {
          setOfficesError(search 
            ? `No offices found matching "${search}".`
            : `No ${data.courier || 'courier'} offices found in ${formData.city}.`
          );
        }
      }
    } catch (err) {
      console.error('Failed to fetch offices:', err);
      if (search === officeSearchRef.current) {
        setOfficesError('Failed to load offices. Please try again.');
      }
    } finally {
      if (search === officeSearchRef.current) {
        setIsLoadingOffices(false);
      }
    }
  }, [formData.country, formData.city]);

  // Initial fetch when city changes
  useEffect(() => {
    if (!formData.country || !formData.city) {
      setOffices([]);
      setCourier('');
      setOfficesError(null);
      setOfficeSearch('');
      officeSearchRef.current = '';
      return;
    }

    // Reset and fetch offices for new city
    setFormData(prev => ({ ...prev, courierOffice: '' }));
    setOffices([]);
    setOfficeSearch('');
    officeSearchRef.current = '';
    fetchOffices('');
  }, [formData.country, formData.city, fetchOffices]);

  // Handle office search - called by SearchableDropdown
  const handleOfficeSearch = useCallback((search: string) => {
    setOfficeSearch(search);
    officeSearchRef.current = search;
    fetchOffices(search);
  }, [fetchOffices]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleCityChange(value: string) {
    setFormData(prev => ({ ...prev, city: value, courierOffice: '' }));
  }

  function handleOfficeChange(value: string) {
    setFormData(prev => ({ ...prev, courierOffice: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user?.email || !user?.sub) {
      setError('Please sign in to complete your order.');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!formData.courierOffice) {
      setError('Please select a delivery office.');
      return;
    }

    const selectedOffice = offices.find(o => o.id === formData.courierOffice);

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          userId: user.sub,
          deliveryInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            country: formData.country,
            city: formData.city,
            courier,
            courierOffice: selectedOffice ? `${selectedOffice.name} - ${selectedOffice.address}` : formData.courierOffice,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  }

  if (!user?.sub) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__container">
          <div className="checkout-page__error">
            <div className="checkout-page__icon checkout-page__icon--error">!</div>
            <h1>Sign In Required</h1>
            <p>Please sign in to complete your purchase.</p>
            <Link href="/cart" className="button button--primary">
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__container">
          <div className="checkout-page__error">
            <div className="checkout-page__icon checkout-page__icon--error">🛒</div>
            <h1>Cart is Empty</h1>
            <p>Add some items to your cart before checking out.</p>
            <Link href="/products" className="button button--primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page checkout-page--form">
      <div className="checkout-page__container checkout-page__container--wide">
        <h1 className="checkout-page__title">Checkout</h1>
        
        <div className="checkout-page__grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Delivery Information</h2>
            
            {error && (
              <div className="checkout-form__error">
                {error}
              </div>
            )}

            <div className="checkout-form__row">
              <div className="checkout-form__field">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                />
              </div>

              <div className="checkout-form__field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="checkout-form__field">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+359 888 123 456"
              />
            </div>

            <div className="checkout-form__field">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Select a country</option>
                {europeanCountries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {selectedCourier && (
              <div className="checkout-form__courier-info">
                Delivery via <strong>{selectedCourier}</strong>
              </div>
            )}

            <div className="checkout-form__field">
              <label htmlFor="city">City</label>
              {isLoadingCities ? (
                <div className="checkout-form__loading">
                  <span className="checkout-form__spinner" />
                  Loading cities...
                </div>
              ) : citiesError ? (
                <div className="checkout-form__offices-error">
                  {citiesError}
                </div>
              ) : (
                <SearchableDropdown
                  id="city"
                  name="city"
                  options={cityOptions}
                  value={formData.city}
                  onChange={handleCityChange}
                  placeholder={formData.country ? 'Search for a city...' : 'Select a country first'}
                  disabled={!formData.country || cities.length === 0}
                  required
                />
              )}
            </div>

            <div className="checkout-form__field">
              <label htmlFor="courierOffice">Pickup Office</label>
              {!formData.city ? (
                <div className="checkout-form__hint">
                  Select a city to see available pickup offices
                </div>
              ) : (
                <SearchableDropdown
                  id="courierOffice"
                  name="courierOffice"
                  options={officeOptions}
                  value={formData.courierOffice}
                  onChange={handleOfficeChange}
                  onSearch={handleOfficeSearch}
                  isLoading={isLoadingOffices}
                  placeholder="Type an address to search offices..."
                  disabled={!formData.city}
                  required
                  debounceMs={400}
                />
              )}
            </div>

            <button 
              type="submit" 
              className="button button--primary checkout-form__submit"
              disabled={isSubmitting || isLoadingCities || isLoadingOffices}
            >
              {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>

          <div className="checkout-page__summary">
            <h2>Order Summary</h2>
            
            <div className="checkout-summary__items">
              {items.map(item => (
                <div key={item.id} className="checkout-summary__item">
                  <img src={item.image_url} alt={item.name} />
                  <div className="checkout-summary__item-details">
                    <span className="checkout-summary__item-name">{item.name}</span>
                    <span className="checkout-summary__item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-summary__item-price">
                    €{((item.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-summary__divider" />

            <div className="checkout-summary__row">
              <span>Subtotal ({totalItems} items)</span>
              <span>€{displayTotal}</span>
            </div>

            <div className="checkout-summary__row">
              <span>Shipping</span>
              <span className="checkout-summary__free">Free</span>
            </div>

            <div className="checkout-summary__divider" />

            <div className="checkout-summary__row checkout-summary__total">
              <span>Total</span>
              <span>€{displayTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
