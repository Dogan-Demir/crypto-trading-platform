import React, { useState } from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { Link } from "react-router-dom";

export default function Forum() {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const forumPosts = [
        {
            id: 1,
            title: "Bitcoin Price Analysis - June 2024",
            author: "CryptoAnalyst",
            category: "market-analysis",
            replies: 45,
            views: 1200,
            lastActivity: "2 hours ago"
        },
        {
            id: 2,
            title: "Best Security Practices for New Traders",
            author: "SecurityExpert",
            category: "security",
            replies: 32,
            views: 890,
            lastActivity: "5 hours ago"
        },
        {
            id: 3,
            title: "Understanding DeFi Protocols",
            author: "DeFiMaster",
            category: "education",
            replies: 67,
            views: 1500,
            lastActivity: "1 day ago"
        },
        {
            id: 4,
            title: "Technical Analysis Fundamentals",
            author: "TradingPro",
            category: "trading",
            replies: 89,
            views: 2100,
            lastActivity: "3 hours ago"
        },
        {
            id: 5,
            title: "New Cryptocurrency Regulations Update",
            author: "CryptoLawyer",
            category: "news",
            replies: 56,
            views: 1800,
            lastActivity: "6 hours ago"
        }
    ];

    const categories = [
        { id: 'all', name: 'All Topics' },
        { id: 'market-analysis', name: 'Market Analysis' },
        { id: 'trading', name: 'Trading' },
        { id: 'security', name: 'Security' },
        { id: 'education', name: 'Education' },
        { id: 'news', name: 'News' }
    ];

    const filteredPosts = selectedCategory === 'all' 
        ? forumPosts 
        : forumPosts.filter(post => post.category === selectedCategory);

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
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-[40px]">Forum</h1>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                New Post
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                    }`}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Forum Posts */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
                            <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-6 py-3 bg-gray-700/50 text-sm font-medium">
                                <div>Topic</div>
                                <div>Replies</div>
                                <div>Views</div>
                                <div>Last Activity</div>
                            </div>
                            
                            {filteredPosts.map(post => (
                                <div 
                                    key={post.id}
                                    className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-6 py-4 border-t border-gray-700/50 hover:bg-gray-700/30"
                                >
                                    <div>
                                        <h3 className="font-medium mb-1">
                                            <Link to={`/forum/post/${post.id}`} className="hover:text-blue-400">
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <p className="text-sm text-gray-400">by {post.author}</p>
                                    </div>
                                    <div className="text-center">{post.replies}</div>
                                    <div className="text-center">{post.views}</div>
                                    <div className="text-sm text-gray-400">{post.lastActivity}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}