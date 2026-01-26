import React from 'react';
import { useNavigate } from 'react-router-dom';

const steps = [
    {
        number: '1',
        title: 'Register',
        description: 'Create your account using your official campus email ID.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        color: 'bg-blue-500'
    },
    {
        number: '2',
        title: 'Verify Account',
        description: 'Get verified instantly to ensure trusted and secure listings.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: 'bg-green-500'
    },
    {
        number: '3',
        title: 'Start Reporting',
        description: 'Post lost or found items instantly and help the community.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
        ),
        color: 'bg-orange-500'
    }
];

const HowItWorks = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-surface-50 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-display font-bold text-surface-900 mb-4">How to use LOSFER?</h2>
                    <p className="text-lg text-surface-600">Join our community to make the campus a better place. It's simple, secure, and fast.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-orange-200 -z-10"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className={`relative w-24 h-24 rounded-2xl ${step.color} shadow-lg flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                {step.icon}
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-surface-100 flex items-center justify-center font-bold text-surface-900 shadow-sm">
                                    {step.number}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-surface-900 mb-3">{step.title}</h3>
                            <p className="text-surface-600 leading-relaxed max-w-xs">{step.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-surface-900 text-white rounded-full font-bold shadow-xl hover:bg-black transition-all hover:-translate-y-1"
                    >
                        Get Started Now
                    </button>
                    <p className="mt-4 text-sm text-surface-500">
                        Already have an account? <button onClick={() => navigate('/login')} className="text-primary-600 font-semibold hover:underline">Log in</button>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
