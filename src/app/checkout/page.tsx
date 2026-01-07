'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './checkout.css';

export default function CheckoutPage() {
    return <div>Checkout</div>;
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   // Get booking details from URL params
//   const name = searchParams.get('name') || '';
//   const email = searchParams.get('email') || '';
//   const service = searchParams.get('service') || '';
//   const message = searchParams.get('message') || '';

//   useEffect(() => {
//     if (!email) {
//       setError('Missing booking information. Please fill out the booking form first.');
//       return;
//     }

    

//     createCheckoutSession();
//   }, [name, email, service, message]);

//   if (error) {
//     return (
//       <div className="checkout-page">
//         <div className="checkout-page__container">
//           <div className="checkout-page__error">
//             <div className="checkout-page__icon checkout-page__icon--error">✕</div>
//             <h1>Oops!</h1>
//             <p>{error}</p>
//             <button className="button button--primary" onClick={() => router.push('/quote-form')}>
//               Back to Booking Form
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-page">
//       <div className="checkout-page__container">
//         <div className="checkout-page__loading">
//           <div className="checkout-page__spinner" />
//           <h2>Preparing your checkout...</h2>
//           <p>You&apos;ll be redirected to our secure payment page.</p>
//         </div>
//       </div>
//     </div>
//   );
}

