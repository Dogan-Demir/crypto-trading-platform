import React, { useState } from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";

export default function FAQs() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is cryptocurrency?",
            answer: "Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Unlike traditional currencies, cryptocurrencies are typically decentralized systems based on blockchain technology."
        },
        {
            question: "How do I start trading?",
            answer: "To start trading, first deposit funds into your account. Then, navigate to the Trading page, select the cryptocurrency you want to trade, enter the amount, and choose whether to buy or sell."
        },
        {
            question: "Is my money safe?",
            answer: "We employ industry-standard security measures to protect your funds and personal information. This includes encryption, secure servers, and regular security audits. However, it's important to also follow good security practices like using strong passwords and enabling two-factor authentication."
        },
        {
            question: "What are the trading fees?",
            answer: "Trading fees vary depending on the type of transaction and volume. Generally, our fees are competitive with industry standards. Please refer to our fee schedule for detailed information."
        },
        {
            question: "How do I deposit/withdraw funds?",
            answer: "You can deposit funds through bank transfer or other supported payment methods. For withdrawals, navigate to the Deposit page and select the withdrawal option. Processing times may vary depending on the method chosen."
        },
        {
            question: "What cryptocurrencies can I trade?",
            answer: "We offer a wide range of popular cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), and others. The full list of available cryptocurrencies can be found on the Trading page."
        },
        {
            question: "How do I secure my account?",
            answer: "We recommend enabling two-factor authentication (2FA), using a strong unique password, and regularly monitoring your account activity. You can manage security settings in your Account page."
        },
        {
            question: "What happens if I forget my password?",
            answer: "If you forget your password, use the 'Forgot Password' option on the login page. You'll receive instructions to reset your password via your registered email address."
        }
    ];

    return (
        <div className="flex min-h-screen bg-[#0F1429]">
            <NavBar2 />
            <main className="flex-1 ml-[398px]">
                <div className="min-h-screen text-white bg-no-repeat bg-cover relative"
                     style={{ 
                         background: `url(${bgImage})`,
                         backgroundPosition: 'center',
                         backgroundSize: 'cover'
                     }}>
                    <div className="p-8">
                        <h1 className="text-[40px] mb-6">Frequently Asked Questions</h1>
                        
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div 
                                    key={index} 
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden"
                                >
                                    <button
                                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700/50"
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    >
                                        <span className="text-lg font-medium">{faq.question}</span>
                                        <span className="ml-6">
                                            {openIndex === index ? '−' : '+'}
                                        </span>
                                    </button>
                                    
                                    {openIndex === index && (
                                        <div className="px-6 py-4 border-t border-gray-700/50">
                                            <p className="text-gray-300">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Still have questions?</h2>
                            <p className="text-gray-300">
                                If you couldn't find the answer you were looking for, please visit our Forum page or contact our support team.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}