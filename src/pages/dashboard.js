import React, { useState, useEffect, useCallback } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, DollarSign, Users, ShoppingBag, AlertCircle, BarChart3, Activity, ChevronDown, RefreshCw, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import Navbar from '../Template/navbar';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('day');
    const [chartData, setChartData] = useState([]);
    const [dayEndData, setDayEndData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Fetch data from API
    const fetchChartData = async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Dashboard/${endpoint}`);
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error(`Error fetching ${endpoint} data:`, error);
            return [];
        }
    };

    const fetchDayEndData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/Dashboard/dayenddata`);
            const data = await response.json();
            return data.data?.[0] || null;
        } catch (error) {
            console.error('Error fetching day end data:', error);
            return null;
        }
    };

    // Load data based on active tab
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [chartResult, dayEndResult] = await Promise.all([
                fetchChartData(activeTab),
                fetchDayEndData()
            ]);

            setChartData(chartResult);
            setDayEndData(dayEndResult);
            setLastUpdated(new Date());
        } catch (err) {
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Format data for different chart types
    const formatDataForChart = (data) => {
        return data.map(item => ({
            ...item,
            period: item.Date || item.WeekYear || item.MonthYear || item.Year,
            TotalBill: Number(item.TotalBill) || 0,
            TotalExpense: Number(item.TotalExpense) || 0,
            DiscountAmount: Number(item.DiscountAmount) || 0,
            BalanceAmount: Number(item.BalanceAmount) || 0
        }));
    };

    // Format data for pie chart
    const formatPieData = (data) => {
        if (!data.length) return [];

        const totals = data.reduce((acc, item) => ({
            totalBill: acc.totalBill + (Number(item.TotalBill) || 0),
            totalExpense: acc.totalExpense + (Number(item.TotalExpense) || 0),
            discountAmount: acc.discountAmount + (Number(item.DiscountAmount) || 0)
        }), { totalBill: 0, totalExpense: 0, discountAmount: 0 });

        return [
            { name: 'Revenue', value: totals.totalBill, color: '#10B981' },
            { name: 'Expenses', value: totals.totalExpense, color: '#EF4444' },
            { name: 'Discounts', value: totals.discountAmount, color: '#F59E0B' }
        ];
    };

    // Calculate metrics
    const calculateMetrics = (data) => {
        if (!data.length) return { revenue: 0, expenses: 0, profit: 0, discounts: 0, avgBill: 0 };

        const totals = data.reduce((acc, item) => ({
            revenue: acc.revenue + (Number(item.TotalBill) || 0),
            expenses: acc.expenses + (Number(item.TotalExpense) || 0),
            discounts: acc.discounts + (Number(item.DiscountAmount) || 0),
            billCount: acc.billCount + (Number(item.No_Of_bill) || 0)
        }), { revenue: 0, expenses: 0, discounts: 0, billCount: 0 });

        return {
            ...totals,
            profit: totals.revenue - totals.expenses,
            avgBill: totals.billCount > 0 ? totals.revenue / totals.billCount : 0
        };
    };

    const formattedChartData = formatDataForChart(chartData);
    const pieData = formatPieData(chartData);
    const metrics = calculateMetrics(chartData);

    // Tab configuration
    const tabs = [
        { id: 'day', label: 'Daily', icon: Calendar },
        { id: 'week', label: 'Weekly', icon: BarChart3 },
        { id: 'month', label: 'Monthly', icon: TrendingUp },
        { id: 'year', label: 'Yearly', icon: Activity }
    ];

    // KPI Card Component
    const KPICard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                        {typeof value === 'number' ? `₹${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : value}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-gray-500">{subtitle}</p>
                    )}
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
        </div>
    );

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                    <p className="font-medium text-gray-900">{label}</p>
                    <div className="mt-2 space-y-1">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                                    <span className="text-sm text-gray-600">{entry.name}:</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">₹{Number(entry.value).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-4 text-gray-600 text-center">Loading your dashboard<br />This will just take a moment</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={loadData}
                        className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Format last updated time
    const formatTime = (date) => {
        if (!date) return '';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-300 to-indigo-100 p-4">
            {/* Header */}
            <>
                {/* Fixed Navbar in top-right corner */}
                <Navbar />

                {/* Main Header */}
                <div className="border-b border-gray-100 shadow-sm pt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-4">
                            {/* Left section - Title and subtitle */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-2 rounded-lg">
                                            <BarChart3 className="text-blue-600" size={24} />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Business Analytics Dashboard</h1>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Monitor your business performance with real-time insights
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status indicator */}
                                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                                        <RefreshCw size={16} className="text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">
                                            Updated: {lastUpdated ?
                                                `${lastUpdated.toLocaleDateString([], { month: 'short', day: 'numeric' })} 
                  at ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                : '--:--'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Refresh button */}
                            <button
                                onClick={loadData}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                            >
                                <RefreshCw size={16} />
                                <span>Refresh Data</span>
                            </button>
                        </div>
                    </div>
                </div>
            </>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Day End Summary */}
                {dayEndData && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Today's Summary</h2>
                            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                View detailed report <ChevronDown size={16} className="ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <KPICard
                                title="Total Bills"
                                value={dayEndData.No_Of_bill || 0}
                                icon={ShoppingBag}
                                color="#3B82F6"
                                trend={5.2}
                            />
                            <KPICard
                                title="Total Revenue"
                                value={Number(dayEndData.total_bill_amount) || 0}
                                icon={DollarSign}
                                color="#10B981"
                                trend={8.7}
                            />
                            <KPICard
                                title="Due Amount"
                                value={Number(dayEndData.due_amount_by_customer) || 0}
                                icon={AlertCircle}
                                color="#F59E0B"
                                trend={-2.1}
                            />
                            <KPICard
                                title="Discounts Given"
                                value={Number(dayEndData.Amount_Spent_On_offers) || 0}
                                icon={Users}
                                color="#8B5CF6"
                                trend={3.4}
                            />
                            <KPICard
                                title="Expenses"
                                value={Number(dayEndData.Expense_Amount) || 0}
                                icon={TrendingUp}
                                color="#EF4444"
                                trend={-1.5}
                            />
                        </div>
                    </div>
                )}

                {/* Time Period Selector */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
                            <p className="text-sm text-gray-500">Track your business metrics over time</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className="border border-gray-200 rounded-lg flex">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 py-2 px-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Cards for Current Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <KPICard
                        title="Total Revenue"
                        value={metrics.revenue}
                        icon={DollarSign}
                        color="#10B981"
                        trend={7.3}
                        subtitle={`${chartData.length} ${activeTab === 'day' ? 'days' : activeTab === 'week' ? 'weeks' : activeTab === 'month' ? 'months' : 'years'}`}
                    />
                    <KPICard
                        title="Net Profit"
                        value={metrics.profit}
                        icon={Activity}
                        color="#3B82F6"
                        trend={12.1}
                        subtitle={`${(metrics.revenue > 0 ? (metrics.profit / metrics.revenue * 100).toFixed(1) : 0)}% margin`}
                    />
                    <KPICard
                        title="Total Expenses"
                        value={metrics.expenses}
                        icon={TrendingUp}
                        color="#EF4444"
                        trend={-3.2}
                        subtitle={`${(metrics.revenue > 0 ? (metrics.expenses / metrics.revenue * 100).toFixed(1) : 0)}% of revenue`}
                    />
                    <KPICard
                        title="Avg. Bill Value"
                        value={metrics.avgBill}
                        icon={ShoppingBag}
                        color="#8B5CF6"
                        trend={4.5}
                        subtitle={`${metrics.billCount} bills processed`}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Revenue vs Expenses Trend */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Revenue vs Expenses Trend</h3>
                                <p className="text-sm text-gray-500">Comparison over time</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={formattedChartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="period"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `₹${value > 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area type="monotone" dataKey="TotalBill" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" strokeWidth={2} />
                                    <Area type="monotone" dataKey="TotalExpense" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Financial Breakdown</h3>
                                <p className="text-sm text-gray-500">Revenue distribution</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                    This Period
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="h-80 flex">
                            <div className="w-1/2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 pl-4 flex flex-col justify-center">
                                <div className="space-y-4">
                                    {pieData.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                                    <span className="text-sm font-medium text-gray-900">₹{item.value.toLocaleString()}</span>
                                                </div>
                                                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className="h-1.5 rounded-full"
                                                        style={{
                                                            width: `${(item.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100}%`,
                                                            backgroundColor: item.color
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comprehensive Overview */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Comprehensive Financial Overview</h3>
                            <p className="text-sm text-gray-500">Detailed breakdown by period</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={formattedChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="period"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value > 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="TotalBill" fill="#10B981" name="Revenue" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="TotalExpense" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="DiscountAmount" fill="#F59E0B" name="Discounts" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="BalanceAmount" fill="#8B5CF6" name="Balance Due" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Insights Panel */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Key Performance Insights</h3>
                            <p className="text-sm text-gray-500">Actionable metrics for your business</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View all insights
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <DollarSign size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-900">Revenue Growth</h4>
                                    <p className="text-2xl font-bold text-blue-700 mt-1">
                                        +7.3%
                                    </p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Compared to previous period
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <Activity size={18} className="text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-900">Profit Margin</h4>
                                    <p className="text-2xl font-bold text-green-700 mt-1">
                                        {metrics.revenue > 0 ? ((metrics.profit / metrics.revenue) * 100).toFixed(1) : 0}%
                                    </p>
                                    <p className="text-xs text-green-700 mt-1">
                                        Increased by 1.2% from last period
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="flex items-start">
                                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                                    <ShoppingBag size={18} className="text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-amber-900">Avg. Bill Value</h4>
                                    <p className="text-2xl font-bold text-amber-700 mt-1">
                                        ₹{metrics.avgBill.toFixed(0)}
                                    </p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        +₹24 from previous period
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-start">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <Users size={18} className="text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-purple-900">Discount Rate</h4>
                                    <p className="text-2xl font-bold text-purple-700 mt-1">
                                        {metrics.revenue > 0 ? ((metrics.discounts / metrics.revenue) * 100).toFixed(1) : 0}%
                                    </p>
                                    <p className="text-xs text-purple-700 mt-1">
                                        Down 0.7% from last period
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 mt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                    Business Analytics Dashboard • Data refreshes automatically every 15 minutes •
                    <span className="mx-2">|</span>
                    Last updated: {lastUpdated ? `${lastUpdated.toLocaleDateString()} at ${formatTime(lastUpdated)}` : '--:--'}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;