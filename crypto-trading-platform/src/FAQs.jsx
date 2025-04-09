import React, { useState } from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { useTheme } from './ThemeContext';

export default function FAQs() {
    const { isDarkMode } = useTheme();
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqs = [
        {
            question: "What is cryptocurrency?",
            answer: "Cryptocurrency is a form of digital or virtual currency that uses cryptography for security and operates on a technology called blockchain. Unlike traditional currencies issued by governments (fiat currencies), cryptocurrencies typically operate on decentralized networks based on blockchain technology—a distributed ledger enforced by a disparate network of computers."
        },
        {
            question: "How do I start trading cryptocurrencies?",
            answer: "To start trading cryptocurrencies, you'll need to: 1) Create an account on a cryptocurrency exchange, 2) Verify your identity (KYC process), 3) Connect a payment method, 4) Deposit funds to your account, 5) Start trading by placing buy/sell orders. Our platform provides an intuitive interface for these steps, along with educational resources to help beginners."
        },
        {
            question: "What is blockchain technology?",
            answer: "Blockchain is a specific type of database that stores data in blocks that are then chained together. As new data comes in, it is entered into a fresh block. Once the block is filled with data, it is chained onto the previous block, which makes the data chained together in chronological order. Different types of information can be stored on a blockchain, but the most common use so far has been as a ledger for transactions."
        },
        {
            question: "How secure is cryptocurrency trading?",
            answer: "Cryptocurrency trading security depends on several factors: the exchange's security measures, your personal security practices, and the inherent security of the blockchain. Reputable exchanges implement security features like two-factor authentication, cold storage for assets, and regular security audits. Users should use strong passwords, enable 2FA, use hardware wallets for large amounts, and be vigilant against phishing attempts."
        },
        {
            question: "What factors affect cryptocurrency prices?",
            answer: "Cryptocurrency prices are influenced by: Market supply and demand, Market sentiment and media coverage, Regulatory developments, Technical advancements and upgrades, Macroeconomic factors, Integration and adoption by businesses, Market manipulation, and Mining costs and rewards. Understanding these factors can help traders make more informed decisions."
        },
        {
            question: "How are transactions verified on the blockchain?",
            answer: "Blockchain transactions are verified through a process called consensus. In Bitcoin and many other cryptocurrencies, this happens through mining—computers solving complex mathematical problems. When a problem is solved, the miner or mining pool gets to add the next block to the blockchain and receives a reward. This system is called Proof of Work. Other cryptocurrencies use different consensus mechanisms like Proof of Stake, where validators are chosen based on how many coins they hold and are willing to 'stake' as collateral."
        },
        {
            question: "What are the tax implications of trading cryptocurrency?",
            answer: "Cryptocurrency taxation varies by country, but generally: Cryptocurrency is treated as property rather than currency for tax purposes in many jurisdictions. Trading cryptocurrency for fiat currency, another cryptocurrency, or using it to purchase goods/services are typically taxable events. Mining rewards and staking income are generally taxable upon receipt. Tax obligations might include capital gains tax, income tax, or both. It's recommended to consult with a tax professional and keep detailed records of all cryptocurrency transactions."
        },
        {
            question: "How do I create a secure crypto wallet?",
            answer: "To create a secure crypto wallet: Choose the right type of wallet (hardware wallets are most secure for large holdings). Use wallets from reputable providers. Create strong, unique passwords. Enable two-factor authentication when available. Back up your wallet's recovery phrase/private keys and store them securely offline in multiple locations. Keep your devices malware-free. Consider using a multisignature wallet for extra security. Regularly update your wallet software."
        }
    ];

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-[#0F1429]' : 'bg-gray-100'}`}>
            <NavBar2 />
            <main className="flex-1 ml-[398px]">
                <div className={`min-h-screen ${isDarkMode ? 'text-white' : 'text-gray-900'} bg-no-repeat bg-cover relative`}
                     style={{ 
                         background: isDarkMode ? `url(${bgImage})` : undefined,
                         backgroundPosition: 'center',
                         backgroundSize: 'cover'
                     }}>
                    <div className="p-8">
                        <h1 className="text-[40px] mb-8">Frequently Asked Questions</h1>
                        <div className="max-w-4xl mx-auto">
                            {faqs.map((faq, index) => (
                                <div key={index} className={`mb-4 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white shadow-md'} rounded-lg overflow-hidden`}>
                                    <div 
                                        className={`flex justify-between items-center p-4 cursor-pointer ${openFAQ === index ? (isDarkMode ? 'bg-blue-600/30' : 'bg-blue-50') : ''}`}
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        <h3 className="text-lg font-semibold">{faq.question}</h3>
                                        <svg 
                                            className={`w-6 h-6 transform ${openFAQ === index ? 'rotate-180' : ''} transition-transform duration-200`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24" 
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                    <div 
                                        className={`overflow-hidden transition-all duration-200 ${openFAQ === index ? 'max-h-96' : 'max-h-0'}`}
                                    >
                                        <p className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}