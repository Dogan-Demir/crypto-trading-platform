import React, { useState, useEffect } from "react";
import NavBar2 from "./NavBar2";
import bgImage from "./assets/Background-dark.png";
import { useTheme } from './ThemeContext';
// 
export default function SupportTicket() {
    const { isDarkMode } = useTheme();
    const [ticket, setTicket] = useState([]);
    const [subject, setSubject] = useState('');
    const [request, setRequest] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // it gets the tickets from the backend
    useEffect(() => {
        const fetchTickets = async () => {
            const token = localStorage.getItem('token');
            // if theyre not logged in, it doesnt fetch the tickets
            if (!token) return; 

            try {
                const res = await fetch('http://localhost:8000/support/tickets/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                setTicket(data); // it sets the tickets to the data from the backend
            } catch (err) {
                console.error("Error fetching tickets:", err);
            }
        };

        fetchTickets();
    }, []);

    const handleTicket = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError("You must be logged in to submit a ticket.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/support/submit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    subject,
                    message: request  // basically maps the message to request
                }),
            });

            if (response.ok) {
                const resData = await response.json();
                setSuccess("Ticket submitted successfully!");
                setTicket((prev) => [...prev, { subject, request , status: 'open' }]);
                setSubject('');
                setRequest('');
            } else {
                const errData = await response.json();
                setError(errData.error || "Failed to submit ticket.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen bg-lightMode-background dark:bg-[#0F1429]">
            <NavBar2 />
            <main className="flex-1 ml-[398px]">
                <div className="min-h-screen text-lightText-primary dark:text-white bg-no-repeat bg-cover relative transition-colors duration-200"
                     style={{ 
                         background: isDarkMode ? `url(${bgImage})` : 'var(--tw-color-lightMode-background, #ffffff)',
                         backgroundPosition: 'center',
                         backgroundSize: 'cover'
                     }}>
                    <div className="p-8">
                    <h1 className={`text-[40px] mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Support Ticket</h1>

                        {error && <p className="text-red-500 text-lg mb-2">{error}</p>}
                        {success && <p className="text-green-500 text-lg mb-2">{success}</p>}

                        <form onSubmit={handleTicket} className="grid items-center w-[933px] border rounded-lg space-y-4 p-4 bg-white">
                            <div>
                                <label className="block mb-2 ml-2 text-[25px]">Subject</label>
                                <input 
                                    value={subject} 
                                    onChange={(e)=>setSubject(e.target.value)} 
                                    type="text" 
                                    required
                                    className="w-[915px] p-3 rounded-lg border mb-2 ml-2"
                                />

                                <label className="block mb-2 ml-2 text-[25px]">Request</label>
                                <textarea 
                                    value={request} 
                                    onChange={(e)=>setRequest(e.target.value)} 
                                    required
                                    className="w-[915px] p-3 rounded-lg border mb-2 ml-2"
                                />
                            </div>

                            <div className="flex justify-center items-center space-x-4 mb-[20px]">
                                <button type="submit" className="border w-[80px] rounded-lg px-2 py-1">Submit</button>
                                <button 
                                    type="button" 
                                    className="border w-[80px] rounded-lg px-2 py-1"
                                    onClick={() => {
                                        setSubject('');
                                        setRequest('');
                                        setError('');
                                        setSuccess('');
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </form>

                        {/* Display Tickets */}
                        <div className="mt-8 w-[933px]">
                        <h2 className={`text-[40px] mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Submitted Tickets</h2>
                            {ticket.length === 0 ? (
                                <p className="text-gray-500 text-[25px]">No tickets submitted yet</p>
                            ) : (
                                <ul className="space-y-4">
                                    {ticket.map((t, index) => (
                                        <li key={index} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                                            <h3 className="text-[20px] font-bold mb-2">Subject: {t.subject}</h3>
                                            <p className="text-[16px] mb-2">Request: {t.message || t.request}</p>
                                            <p className="text-[16px] mb-2">
                                                <span className="font-semibold">Status:</span> {t.status === 'open' ? (
                                                    <span className="text-green-500">Open</span>
                                                ) : (
                                                    <span className="text-red-500">Closed</span>
                                                )}
                                            </p>
                                            {t.response && (
                                                <p className="text-[16px] text-blue-500 mt-2">
                                                    <span className="font-semibold">Admin Response:</span> {t.response}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
