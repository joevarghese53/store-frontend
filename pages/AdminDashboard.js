import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import {
    ArrowDown,
    ArrowUp,
    IndianRupee,
    Package,
    ShoppingCart,
    Users
} from 'lucide-react'

import {
    useGetTotalOrdersByDateQuery, useGetTotalSalesByDateQuery, useGetTotalProductsSoldQuery
} from '../redux/api/orderApiSlice'
import { useGetUsersQuery } from '../redux/api/usersApiSlice'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const AdminDashboard = () => {

    const [timeRange, setTimeRange] = useState('7d')

    const { data: totalOrders } = useGetTotalOrdersByDateQuery()
    const { data: totalProductsSold } = useGetTotalProductsSoldQuery()
    const { data: totalSalesByDate } = useGetTotalSalesByDateQuery()
    const { data: totalUsers } = useGetUsersQuery();

    const calculateChange = (current, previous) => {
        if (previous === 0) return 0;
        return (((current - previous) / previous) * 100).toFixed(2);
    }

    const getDateRange = (range) => {
        const today = new Date();
        let startDate;

        switch (range) {
            case '7d':
                startDate = new Date(today.setDate(today.getDate() - 7 + 1));
                break;
            case '30d':
                startDate = new Date(today.setDate(today.getDate() - 30 + 1));
                break;
            case '90d':
                startDate = new Date(today.setDate(today.getDate() - 90 + 1));
                break;
            case '6m':
                startDate = new Date(today.setMonth(today.getMonth() - 6));
                break;
            case '1y':
                startDate = new Date(today.setFullYear(today.getFullYear() - 1));
                break;
            case 'lifetime':
                startDate = new Date(0);  // Very early date (January 1, 1970)
                break;
            default:
                startDate = new Date();
        }

        startDate.setHours(0, 0, 0, 0);
        return startDate;
    }

    const filteredSalesData = totalSalesByDate?.filter(sale => {
        const saleDate = new Date(sale._id);
        const rangeStart = getDateRange(timeRange);
        return saleDate >= rangeStart;
    }) || [];

    const filteredOrdersData = totalOrders?.filter(order => {
        const orderDate = new Date(order._id);
        const rangeStart = getDateRange(timeRange);
        return orderDate >= rangeStart;
    }) || [];

    const filteredUsersData = totalUsers?.filter(user => {
        const userDate = new Date(user.createdAt);
        const rangeStart = getDateRange(timeRange);
        return userDate >= rangeStart;
    }) || [];

    const filteredProductsSoldData = totalProductsSold?.filter(product => {
        const productDate = new Date(product._id);
        const rangeStart = getDateRange(timeRange);
        return productDate >= rangeStart;
    }) || [];


    const getPreviousPeriodData = (data = [], days, key) => {
        const today = new Date();
        const currentPeriodEnd = new Date();
        const currentPeriodStart = new Date(today.setDate(today.getDate() - days));

        currentPeriodStart.setHours(0, 0, 0, 0);
        currentPeriodEnd.setHours(23, 59, 59, 999);

        const previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate());
        const previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - days + 1);

        previousPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodEnd.setHours(23, 59, 59, 999);

        const previousPeriodData = (data || []).filter(item => {
            const itemDate = new Date(item._id);
            return itemDate >= previousPeriodStart && itemDate <= previousPeriodEnd;
        });

        const previousTotal = previousPeriodData.reduce((total, item) => total + item[key], 0);

        return parseFloat(previousTotal.toFixed(2));
    };

    const getPreviousPeriodUsers = (data = [], days) => {
        const today = new Date();
        const currentPeriodEnd = new Date();
        const currentPeriodStart = new Date(today.setDate(today.getDate() - days));

        currentPeriodStart.setHours(0, 0, 0, 0);
        currentPeriodEnd.setHours(23, 59, 59, 999);

        const previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate());
        const previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - days + 1);

        previousPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodEnd.setHours(23, 59, 59, 999);

        const previousPeriodData = (data || []).filter(item => {
            const itemDate = new Date(item.createdAt);
            return itemDate >= previousPeriodStart && itemDate <= previousPeriodEnd;
        });

        const previousTotal = previousPeriodData.length;

        return previousTotal;
    };

    const currentSales = parseFloat(filteredSalesData.reduce((total, sale) => total + sale.totalSales, 0).toFixed(2));
    const previousSales = getPreviousPeriodData(totalSalesByDate, timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 180, 'totalSales');
    const salesChange = calculateChange(currentSales, previousSales);

    const currentOrders = parseFloat(filteredOrdersData.reduce((total, order) => total + order.totalOrders, 0).toFixed(2));
    const previousOrders = getPreviousPeriodData(totalOrders, timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 180, 'totalOrders');
    const ordersChange = calculateChange(currentOrders, previousOrders);

    const currentUsers = filteredUsersData.length;
    const previousUsers = getPreviousPeriodUsers(totalUsers, timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 180);
    const usersChange = calculateChange(currentUsers, previousUsers);

    const currentProductsSold = parseFloat(filteredProductsSoldData.reduce((total, product) => total + product.totalProductsSold, 0).toFixed(2));
    const previousProductsSold = getPreviousPeriodData(totalProductsSold, timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 180, 'totalProductsSold');
    const productsChange = calculateChange(currentProductsSold, previousProductsSold);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales Overview',
            },
        },
    }

    const chartData = {
        labels: filteredSalesData.map(sale => sale._id), // X-axis labels (dates)
        datasets: [
            {
                label: 'Sales',
                data: filteredSalesData.map(sale => sale.totalSales), // Y-axis data (sales amount)
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };


    return (
        <div className='admin-dashboard-dashboard'>
            <div className='admin-dashboard-header'>
                <h1>Dashboard</h1>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className='admin-dashboard-select'
                >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="6m">Last 6 months</option>
                    <option value="1y">Last 1 year</option>
                    <option value="lifetime">Lifetime</option>
                </select>
            </div>

            <div className='admin-dashboard-metricsGrid'>
                <MetricCard
                    title="Total Revenue"
                    value={`₹${currentSales}`}
                    change={`${salesChange}%`}
                    icon={<IndianRupee />}
                    negative={salesChange < 0}
                />
                <MetricCard
                    title="Orders"
                    value={currentOrders}
                    change={`${ordersChange}%`}
                    icon={<ShoppingCart />}
                    negative={ordersChange < 0}
                />
                <MetricCard
                    title="Users"
                    value={currentUsers}
                    change={`${usersChange}%`}
                    icon={<Users />}
                    negative={usersChange < 0}
                />
                <MetricCard
                    title="Products Sold"
                    value={currentProductsSold}
                    change={`${productsChange}%`}
                    icon={<Package />}
                    negative={productsChange < 0}
                />
            </div>
            
            <div className='admin-dashboard-card'>
                <h2>Sales Overview</h2>
                <Bar options={chartOptions} data={chartData} />
            </div>

        </div>
    )
}

function MetricCard({ title, value, change, icon, negative = false }) {
    return (
        <div className='admin-dashboard-metricCard'>
            <div className='admin-dashboard-metricHeader'>
                <span>{title}</span>
                {icon}
            </div>
            <div className='admin-dashboard-metricValue'>{value}</div>
            <p className={negative ? 'admin-dashboard-negative' : 'admin-dashboard-positive'}>
                {negative ? <ArrowDown /> : <ArrowUp />}
                {change}
            </p>
        </div>
    )
}

export default AdminDashboard
