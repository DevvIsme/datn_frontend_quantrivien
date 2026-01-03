import React from 'react';

const SummaryCards = ({ summary }: any) => {
    if (!summary) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const cards = [
        {
            title: 'Tổng Học Viên',
            value: summary.totalStudents,
            color: 'bg-gradient-to-r from-blue-500 to-blue-600',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            title: 'Tổng Khóa Học',
            value: summary.totalCourses,
            color: 'bg-gradient-to-r from-green-500 to-green-600',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            title: 'Tổng Doanh Thu',
            value: formatCurrency(summary.totalRevenue),
            color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <div key={index} className={`${card.color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90 uppercase font-bold tracking-wider">{card.title}</p>
                            <p className="text-2xl font-bold mt-2">{card.value}</p>
                        </div>
                        <div className="p-3 bg-white bg-opacity-20 rounded-full">
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;