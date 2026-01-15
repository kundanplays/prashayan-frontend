import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

const socialLinks = [
    { name: "Instagram", href: "https://www.instagram.com/prashayanwellness", icon: Instagram },
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "X", href: "#", icon: Twitter },
];

const footerLinks = [
    {
        title: "Company",
        links: [
            { name: "About Us", href: "/about" },
            { name: "Ayurveda", href: "/ayurveda" },
            { name: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "/privacy-policy" },
            { name: "Terms & Conditions", href: "/terms" },
            { name: "Shipping Policy", href: "/shipping" },
            { name: "Returns & Refund", href: "/returns" },
        ],
    },
    {
        title: "Support",
        links: [
            { name: "FAQ", href: "/faq" },
            { name: "Track Order", href: "/track-order" },
            { name: "Customer Care", href: "/contact" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="bg-primary text-secondary pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="font-serif text-3xl font-bold tracking-wide block">
                            Prashayan
                            <span className="text-tertiary">.</span>
                        </Link>
                        <p className="text-secondary/80 text-sm leading-relaxed max-w-xs">
                            Discover the ancient wisdom of Ayurveda with our premium, high-purity herbal formulations designed for modern wellness.
                        </p>

                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center transition-all duration-300 ${social.name === 'Instagram' ? 'hover:bg-[#E4405F] hover:text-white' :
                                        social.name === 'Facebook' ? 'hover:bg-[#1877F2] hover:text-white' :
                                            'hover:bg-black hover:text-white'
                                        } text-secondary/70`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-serif text-lg font-semibold mb-6">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-secondary/70 hover:text-tertiary transition-colors text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Column */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6">Get in Touch</h3>
                        <ul className="space-y-4 text-sm text-secondary/70">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">
                                    <span className="block whitespace-nowrap">Vikas Nagar, Gali no 2, Sonipat</span>
                                    <span>Haryana, India - 131001</span>
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 shrink-0" />
                                <span>+91 85868 38934</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 shrink-0" />
                                <span>hello@prashayan.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-primary/10">
                    <p className="text-secondary/60 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Prashayan. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <img src="/payment-razorpay.png" alt="Razorpay" className="h-28 w-auto object-contain opacity-90 transition-all" />
                        <img src="/payment-upi.png" alt="UPI" className="h-7 w-auto object-contain opacity-90 transition-all" />
                        <img src="/payment-visa.png" alt="Visa" className="h-7 w-auto object-contain opacity-90 transition-all" />
                        <img src="/payment-mastercard.png" alt="Mastercard" className="h-7 w-auto object-contain opacity-90 transition-all" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
