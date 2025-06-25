// src/pages/ContributorsPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // আপনার api.js থেকে api ইনস্ট্যান্স ইমপোর্ট করুন

const ContributorsPage = () => {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getContributors = async () => {
            try {
                // Note: The double slash in the URL is automatically handled by browsers/axios, but it's good practice to have one.
                const response = await api.get('/api/notes/contributors/');

                // পেজিনেটেড এবং নন-পেজিনেটেড উভয় ধরনের রেসপন্স হ্যান্ডেল করার জন্য কোড
                if (response.data && Array.isArray(response.data.results)) {
                    // যদি রেসপন্স পেজিনেটেড হয় (যেমন: { count: N, results: [...] }), তাহলে 'results' অ্যারেটি ব্যবহার করুন
                    setContributors(response.data.results);
                } else if (Array.isArray(response.data)) {
                    // যদি রেসপন্সটি সরাসরি একটি অ্যারে হয়
                    setContributors(response.data);
                } else {
                    // যদি রেসপন্সটি কোনো অ্যারে না হয়, তাহলে একটি এরর সেট করুন
                    console.error("API response is not in the expected format (array or paginated object):", response.data);
                    setError('Received invalid data format from the server.');
                }

            } catch (err) {
                setError('Failed to fetch contributors. Please try again later.');
                console.error('Error fetching contributors:', err);
            } finally {
                setLoading(false);
            }
        };

        getContributors();
    }, []); // dependency array খালি থাকায় এই ইফেক্টটি শুধু একবার রান হবে

    // লোডিং স্পিনার বা মেসেজ (Tailwind দিয়ে স্টাইল করা)
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    // এরর মেসেজ
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 text-center md:p-8">
                <h2 className="text-2xl font-bold text-red-600">{error}</h2>
            </div>
        );
    }
    
    // কন্ট্রিবিউটর না থাকলে মেসেজ
    if (contributors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center md:p-8">
                <h1 className="mb-2 text-3xl font-bold text-gray-800">Contributors</h1>
                <p className="text-lg text-gray-600">No contributors found yet. Be the first one to contribute!</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 pt-24 bg-gray-50 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* পেজের হেডার */}
                <div className="flex flex-col items-center justify-center mt-12 mb-10 text-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            Our Top <span className="text-yellow-500 transition-colors duration-300 hover:text-yellow-400">Contributors</span>
                        </h1>
                      
                    </div>
                    <p className="max-w-2xl mt-4 text-xl leading-relaxed text-gray-600">
                        A big thank you to all our contributors for making this community great!
                    </p>
                </div>


                {/* টেবিলের wrapper, যা মোবাইলে স্ক্রল করা যাবে */}
                <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* টেবিলের হেডার */}
                        <thead className="bg-green-600">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                    Full Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                    Department
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                                    Batch
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-white uppercase">
                                    Notes
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-white uppercase">
                                    Avg. Rating
                                </th>
                            </tr>
                        </thead>
                        {/* টেবিলের বডি */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contributors.map((contributor) => (
                                <tr key={contributor.email} className="transition-colors duration-200 hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{contributor.full_name}</div>
                                                <div className="text-sm text-gray-500">{contributor.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{contributor.department_name || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* ✅ FIX: Updated from contributor.batch to contributor.batch_with_section */}
                                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                            {contributor.batch_with_section || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-center text-gray-700 whitespace-nowrap">
                                        {contributor.note_contribution_count}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <span className="mr-1 font-semibold text-yellow-500">
                                                {/* Check if average_star_rating is a number before calling toFixed */}
                                                {typeof contributor.average_star_rating === 'number' ? contributor.average_star_rating.toFixed(2) : '0.00'}
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContributorsPage;