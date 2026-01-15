import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
            <h1 className="font-serif text-4xl text-primary font-bold mb-8">Privacy Policy</h1>

            <div className="space-y-6 text-primary/80 leading-relaxed font-sans">
                <p>At Prashayan, we respect your privacy and are committed to protecting the personal information you share with us.</p>

                <h2 className="font-serif text-2xl text-primary font-semibold mt-8 mb-4">Information We Collect</h2>
                <p>We collect information directly from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form. This may include your name, email address, mailing address, phone number, and payment information.</p>

                <h2 className="font-serif text-2xl text-primary font-semibold mt-8 mb-4">How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>To personalize your experience and better respond to your individual needs.</li>
                    <li>To improve our website based on the information and feedback we receive from you.</li>
                    <li>To process transactions quickly and efficiently.</li>
                    <li>To send periodic emails regarding your order or other products and services.</li>
                </ul>

                <h2 className="font-serif text-2xl text-primary font-semibold mt-8 mb-4">Data Protection</h2>
                <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
            </div>
        </div>
    );
}
