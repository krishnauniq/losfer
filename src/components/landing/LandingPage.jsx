import React, { useState } from 'react';
import InformationModal from '../modals/InformationModal';
import Navbar from './Navbar';
import Hero from './Hero';
import SmartSearch from './SmartSearch';
import CategoryGrid from './CategoryGrid';
import LatestListings from './LatestListings';
import HowItWorks from './HowItWorks';
import logo from '../../assets/logo.png';

const LandingPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");

    const termsContent = `Welcome to LOSFER, a campus-based Lost & Found web platform designed to help students report and recover lost items safely and efficiently.

By accessing or using LOSFER, you agree to the following Terms of Service:

1. Purpose of LOSFER
LOSFER is intended to assist users in:
• Reporting found items
• Searching for lost items
• Facilitating communication between finders and claimants

LOSFER does not guarantee recovery of any item.

2. User Eligibility
You must:
• Be a student, staff, or authorized campus member
• Provide accurate and truthful information
• Be at least 13 years old to use this service

3. User Responsibilities
Users agree to:
• Post only genuine lost or found items
• Avoid false, misleading, or fraudulent claims
• Not misuse the platform for illegal or harmful activities
• Respect other users and their privacy

Any misuse may result in suspension or permanent ban.

4. Item Claims & Returns
LOSFER:
• Does not take responsibility for item ownership disputes
• Encourages secure claim verification (e.g., QR, proof questions)
• Is not liable for failed or disputed returns

All returns are between users.

5. Platform Limitations
LOSFER:
• Does not physically store items
• Is not responsible for lost, damaged, or stolen items
• Acts only as a digital facilitator

6. Account Termination
LOSFER reserves the right to:
• Suspend or terminate accounts violating these terms
• Remove suspicious or harmful listings

7. Changes to Terms
We may update these Terms periodically.
Continued use of LOSFER implies acceptance of any updates.

8. Contact
For issues or questions, contact:
📧 campuslosfer@gmail.com`;

    const privacyContent = `LOSFER respects your privacy and is committed to protecting your personal data.

1. Information We Collect
We may collect:
• Name and email address
• Account login details
• Item listings and uploaded images
• Campus location data (optional)
• Usage activity (for improving services)

2. How We Use Your Information
Your information is used to:
• Provide lost & found services
• Verify user accounts
• Enable communication between users
• Improve system performance and safety

We do NOT sell user data.

3. Data Sharing
We only share data:
• Between finder and claimant for recovery purposes
• With campus administrators (if applicable)
• When legally required

We do not share data with advertisers.

4. Data Storage & Security
LOSFER uses:
• Encrypted databases
• Secure authentication
• Limited-access servers

However, no system is 100% secure.

5. User Control
You may:
• Update your account details
• Request account deletion
• Remove your listings anytime

6. Cookies & Tracking
LOSFER may use cookies to:
• Maintain login sessions
• Improve user experience

We do not use invasive tracking.

7. Third-Party Services
LOSFER may use:
• Firebase (Authentication & Database)
• Cloudinary (Image storage)

These services follow their own privacy standards.

8. Changes to Policy
We may update this policy periodically.
Changes will be reflected on this page.

9. Contact
For privacy-related concerns, contact:
📧 campuslosfer@gmail.com`;

    const handleOpenModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setModalOpen(true);
    };

    const handleContact = (e) => {
        e.preventDefault();
        const contactContent = `For technical support, feedback, or general inquiries, please reach out to us.

📧 Email: campuslosfer@gmail.com

Our support team is available Mon-Fri, 9 AM - 6 PM.`;
        handleOpenModal("Contact Support", contactContent);
    };
    return (
        <div className="min-h-screen bg-surface-50 font-sans text-surface-900">
            <Navbar />

            <main>
                <Hero />
                <SmartSearch />
                <CategoryGrid />
                <LatestListings />
                <HowItWorks />
            </main>

            <footer className="bg-surface-900 text-white py-12 border-t border-surface-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2 group">
                            <img src={logo} alt="Losfer" className="h-10 w-auto group-hover:scale-105 transition-transform drop-shadow-lg" />
                            <span className="text-2xl font-display font-bold tracking-tight text-white">LOSFER</span>
                        </div>

                        <div className="flex gap-8 text-surface-400 text-sm font-medium">
                            <button onClick={() => handleOpenModal("Privacy Policy", privacyContent)} className="hover:text-white transition-colors">Privacy Policy</button>
                            <button onClick={() => handleOpenModal("Terms of Service", termsContent)} className="hover:text-white transition-colors">Terms of Service</button>
                            <button onClick={handleContact} className="hover:text-white transition-colors">Contact Support</button>
                        </div>

                        <p className="text-surface-500 text-sm">© 2026 LOSFER. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <InformationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
                content={modalContent}
            />
        </div>
    );
};

export default LandingPage;
