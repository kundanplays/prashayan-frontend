import React from 'react';

export default function ShippingPolicy() {
    return (
        <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
            <h1 className="font-serif text-4xl text-primary font-bold mb-8">Shipping Policy</h1>

            <div className="space-y-6 text-primary/80 leading-relaxed font-sans">
                <p>
                    At Prashayan, we are committed to delivering our premium Ayurvedic products safely and efficiently to your doorstep.
                </p>

                <h2 className="font-serif text-2xl text-primary font-semibold mt-8 mb-4">Delivery Timeline</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Orders are typically processed within 1-2 business days.</li>
                    <li>Standard delivery takes 3-5 business days depending on your location.</li>
                    <li>We partner with reliable courier services to ensure timely delivery.</li>
                </ul>

                <h2 className="font-serif text-2xl text-primary font-semibold mt-8 mb-4">Damaged or Spilled Products</h2>
                <p>
                    We take utmost care in packaging our products. However, if you receive a product that has spilled or is damaged during shipment:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Please take clear photographs of the damaged package and the spilled product immediately upon receipt.</li>
                    <li>Contact our customer support team at <strong>hello@prashayan.com</strong> or call <strong>+91 85868 38934</strong> within 24 hours of delivery.</li>
                    <li>We will verify the issue and initiate a replacement or full refund for the damaged item.</li>
                </ul>
            </div>
        </div>
    );
}
