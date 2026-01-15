import React from 'react';

export default function ReturnsPolicy() {
    return (
        <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
            <h1 className="font-serif text-4xl text-primary font-bold mb-8">Returns & Refund Policy</h1>

            <div className="space-y-6 text-primary/80 leading-relaxed font-sans">
                <p>
                    We want you to be completely satisfied with your Prashayan experience. Please read our returns policy carefully.
                </p>

                <h2 className="font-serif text-2xl text-primary font-semibold mt-8 mb-4">Return Eligibility</h2>
                <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 mb-6">
                    <strong>Important:</strong> Due to the nature of our Ayurvedic and personal care products, we cannot accept returns once the box or product seal has been opened, for hygiene and safety reasons.
                </div>

                <p>
                    You are eligible for a return only if:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>The product is in its original, unopened packaging with the seal intact.</li>
                    <li>The return request is raised within 7 days of delivery.</li>
                    <li>The product received was incorrect or damaged during transit (see Shipping Policy).</li>
                </ul>

                <h2 className="font-serif text-2xl text-primary font-semibold mt-8 mb-4">Refund Process</h2>
                <p>
                    Once your return is received and inspected (for sealed condition):
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>We will notify you of the approval or rejection of your refund.</li>
                    <li>If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</li>
                </ul>

                <h2 className="font-serif text-2xl text-primary font-semibold mt-8 mb-4">Contact Us</h2>
                <p>
                    To initiate a return or for any questions, please contact us at <strong>hello@prashayan.com</strong>.
                </p>
            </div>
        </div>
    );
}
