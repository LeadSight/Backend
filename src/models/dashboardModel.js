const supabase = require('../helpers/db');

const computePromotionTrend = ({ success, failure, other }) => {
    const total = success + failure + other;

    if (total === 0) {
        return "neutral"; // Avoid division by zero
    }

    const successRate = success / total;
    const failureRate = failure / total;

    if (successRate > failureRate) return "up";
    if (successRate < failureRate) return "down";
    return "neutral";
};

const computePriorityTrend = ({ priority, nonpriority }) => {
    const total = priority + nonpriority;

    if (total === 0) return "neutral";

    const priorityRate = priority / total;
    const nonRate = nonpriority / total;

    if (priorityRate > nonRate) return "up";
    if (priorityRate < nonRate) return "down";
    return "neutral";
};

const computeSuccessfulCreditTrend = ({ success, nonsuccess }) => {
    const total = success + nonsuccess;

    if (total === 0) return "neutral";

    const successRate = success / total;
    const nonRate = nonsuccess / total;

    if (successRate > nonRate) return "up";
    if (successRate < nonRate) return "down";
    return "neutral";
};

const computeBalanceTrend = ({ priorityAvg, nonpriorityAvg }) => {
    if (priorityAvg > nonpriorityAvg) return "up";
    if (priorityAvg < nonpriorityAvg) return "down";
    return "neutral";
}

const DashboardModel = {
    getDashboardData: async() => {
        // get total customer
        const totalCustomer = await DashboardModel.getTotalCustomer();
        
        // get promotion status
        const promotionStatus = await DashboardModel.getPromotionStatus();
        
        // get total priority customer
        const totalPriorityCustomer = await DashboardModel.getTotalPriorityCustomer();

        // get deposit average
        const depositAverage = await DashboardModel.getDepositAverage();

        // total successful credit
        const successfulCredit = await DashboardModel.getTotalSuccessfulCredit();

        // customer segmentation distribution
        const customerDistribution = await DashboardModel.getCustomerDistribution();

        // campaign rate distribution
        const campaignDistribution = await DashboardModel.getCampaignDistribution();

        // promotion trends
        const promotionTrends = await DashboardModel.getPromotionTrends();

        // credit status distribution
        const creditStatusDistribution = await DashboardModel.getCreditStatusDistribution();

        // deposit by job
        const jobDepositDistribution = await DashboardModel.getJobDepositDistribution();

        // top average balance by job
        const topAverageBalanceByJob = await DashboardModel.getTopAverageBalanceByJob();

        // contact duration
        const contactDuration = await DashboardModel.getAverageContactDuration();

        // contact effectivity
        const contactEffectivity = await DashboardModel.getContactEffectiveness();

        // number of contacts each campaign
        const campaignContactStats = await DashboardModel.getCampaignContactStats();

        // type of contact
        const contactDistribution = await DashboardModel.getContactDistribution();

        return {
            statsData: [
                {
                    id: "totalCustomers",
                    title: "Total Customers",
                    value: totalCustomer,
                    bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
                },
                {
                    id: "goodPromotion",
                    title: "Promotion Status",
                    value: promotionStatus.status,
                    trend: computePromotionTrend(promotionStatus),
                    bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
                },
                {
                    id: "totalPriority",
                    title: "Total Priority Customer",
                    value: totalPriorityCustomer.priority,
                    trend: computePriorityTrend(totalPriorityCustomer),
                    bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
                },
                {
                    id: "balancePriority",
                    title: "Priority Customer Avg. Balance",
                    value: depositAverage.priorityAvg,
                    trend: computeBalanceTrend(depositAverage),
                    bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
                },
                {
                    id: "successfulCredit",
                    title: "Total Successful Credits",
                    value: successfulCredit.success,
                    trend: computeSuccessfulCreditTrend(successfulCredit),
                    bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
                },
            ],
            distData: {
                customerDistribution,
                campaignDistribution,
                promotionTrends,
                creditStatusDistribution,
                jobDepositDistribution,
                topAverageBalanceByJob,
                contactDuration,
                contactEffectivity,
                campaignContactStats,
                contactDistribution,
            }
        }
    },
    getTotalCustomer: async () => {
        const { data, error } = await supabase.rpc('get_total_customers');

        if (error) throw error;
        return Number(data);
    },
    getPromotionStatus: async () => {
        const { data, error } = await supabase.rpc('get_promotion_status');

        if (error) throw error;
        return data[0];
    },
    getTotalPriorityCustomer: async () => {
        const { data, error } = await supabase.rpc('get_priority_counts');

        if (error) throw error;
        return {
            priority: Number(data[0].priority),
            nonpriority: Number(data[0].nonpriority)
        };
    },
    getDepositAverage: async () => {
        const { data, error } = await supabase.rpc('get_deposit_average');

        if (error) throw error;
        return {
            priorityAvg: Number(data[0].priority_avg),
            nonpriorityAvg: Number(data[0].nonpriority_avg)
        };
    },
    getTotalSuccessfulCredit: async () => {
        const { data, error } = await supabase.rpc('get_credit_status');

        if (error) throw error;
        return {
            success: Number(data[0].success),
            nonsuccess: Number(data[0].nonsuccess)
        };
    },
    getCustomerDistribution: async () => {
        const { data, error } = await supabase.rpc('get_customer_distribution');

        if (error) throw error;

        return data;
    },
    getCampaignDistribution: async () => {
        const { data, error } = await supabase.rpc('get_campaign_distribution');

        if (error) throw error;
    
        const distribution = {};
        for (const row of data) {
            distribution[row.campaign] = Number(row.value);
        }

        return distribution;
    },
    getPromotionTrends: async () => {
        const [dailyResult, monthlyResult] = await Promise.all([
            supabase.rpc("get_daily_trends"),
            supabase.rpc("get_monthly_trends")
        ]);

        const dayOrder = ['mon','tue','wed','thu','fri'];
        const monthOrder = [
            'jan','feb','mar','apr','may','jun',
            'jul','aug','sep','oct','nov','dec'
        ];

        // sort daily and monthly results
        const daily = dailyResult.data.map(r => ({
            day: r.day,
            total_contacted: Number(r.total_contacted),
            subscribed: Number(r.subscribed),
            success_rate_pct: Number(r.success_rate_pct)
            }))
            .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

        const monthly = monthlyResult.data.map(r => ({
            month: r.month,
            total_contacted: Number(r.total_contacted),
            subscribed: Number(r.subscribed),
            success_rate_pct: Number(r.success_rate_pct)
            }))
            .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

        return { daily, monthly };
    },
    getCreditStatusDistribution: async () => {
        const { data, error } = await supabase.rpc('get_credit_status_distribution');

        if (error) throw error;

        return data.map(r => ({
            name: r.name,
            macet: Number(r.macet),
            lancar: Number(r.lancar),
        }));
    },
    getJobDepositDistribution: async () => {
        const { data, error } = await supabase.rpc('get_job_deposit_distribution');

        if (error) throw error;

        return data.map(r => ({
            job: r.job,
            total_deposit_subscribers: Number(r.total_deposit_subscribers)
        }));
    },
    getTopAverageBalanceByJob: async () => {
        const { data, error } = await supabase.rpc('get_top_avg_balance_by_job');

        if (error) throw error;

        return data.map(r => ({
            job: r.job,
            avg_deposit_balance: Number(r.avg_deposit_balance)
        }));
    },
    getAverageContactDuration: async () => {
        const { data, error } = await supabase.rpc('get_avg_contact_duration');

        if (error) throw error;

        return data.map(r => ({
            contact_type: r.contact_type,
            avg_duration: Number(r.avg_duration),
            customer_rank: r.customer_rank,
            duration_bucket: r.duration_bucket
        }));
    },
    getContactEffectiveness: async () => {
        const { data, error } = await supabase.rpc('get_contact_effectiveness');

        if (error) throw error;

        return data.map(r => ({
            contact: r.contact,
            poutcome: r.poutcome,
            total_nasabah: Number(r.total_nasabah),
            deposit_success: Number(r.deposit_success),
            success_rate_percent: Number(r.success_rate_percent)
        }));
    },
    getCampaignContactStats: async () => {
        const { data, error } = await supabase.rpc('get_campaign_contact_stats');

        if (error) throw error;

        return data.map(r => ({
            number_of_contacts: Number(r.number_of_contacts),
            total_customers: Number(r.total_customers),
            success_count: Number(r.success_count),
            success_rate_percent: Number(r.success_rate_percent)
        }));
    },
    getContactDistribution: async () => {
        const { data, error } = await supabase.rpc('get_contact_distribution');

        if (error) throw error;

        return data.map(r => ({
            contact: r.contact,
            total_contacted: Number(r.total_contacted),
            total_success: Number(r.total_success),
            success_rate_percent: Number(r.success_rate_percent),
        }));
    }
};

module.exports = DashboardModel;