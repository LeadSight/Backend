const DashboardModel = {
    getDashboardData: async(customers) => {
        // get total customer
        const totalCustomer = DashboardModel.getTotalCustomer(customers);
        
        // get promotion status
        const promotionStatus = DashboardModel.getPromotionStatus(customers);
        
        // get total priority customer
        const totalPriorityCustomer = DashboardModel.getTotalPriorityCustomer(customers);

        // get deposit average
        const depositAverage = DashboardModel.getDepositAverage(customers);

        // total successful credit
        const successfulCredit = DashboardModel.getTotalSuccessfulCredit(customers);

        // customer segmentation distribution
        const customerDistribution = DashboardModel.getCustomerDistribution(customers);

        // campaign rate distribution
        const campaignDistribution = DashboardModel.getCampaignDistribution(customers);

        // promotion trends
        const promotionTrends = DashboardModel.getPromotionTrends(customers);

        // deposit by credit status
        const defaultDepositDistribution = DashboardModel.getDefaultDistribution(customers);

        // deposit by job
        const jobDepositDistribution = DashboardModel.getJobDepositDistribution(customers);

        // top average balance by job
        const topAverageBalanceByJob = DashboardModel.getTopAverageBalanceByJob(customers);

        // contact duration
        const contactDuration = DashboardModel.getAverageContactDuration(customers);

        // contact effectivity
        const contactEffectivity = DashboardModel.getContactEffectiveness(customers);

        // number of contacts each campaign
        const campaignContactStats = DashboardModel.getCampaignContactStats(customers);

        // type of contact
        const contactDistribution = DashboardModel.getContactDistribution(customers);

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
                    value: promotionStatus,
                    trend: "up",
                    bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
                },
                {
                    id: "totalPriority",
                    title: "Total Priority Customer",
                    value: totalPriorityCustomer,
                    trend: "down",
                    bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
                },
                {
                    id: "balancePriority",
                    title: "Priority Customer Avg. Balance",
                    value: depositAverage,
                    trend: "down",
                    bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
                },
                {
                    id: "successfulCredit",
                    title: "Total Successful Credits",
                    value: successfulCredit,
                    trend: "up",
                    bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
                },
            ],
            distData: {
                customerDistribution,
                campaignDistribution,
                promotionTrends,
                defaultDepositDistribution,
                jobDepositDistribution,
                topAverageBalanceByJob,
                contactDuration,
                contactEffectivity,
                campaignContactStats,
                contactDistribution,
            }
        }
    },
    getTotalCustomer: (customers) => {
        return customers.length;
    },
    getPromotionStatus: (customers) => {
        const counts = {
            success: 0,
            failure: 0,
            other: 0
        };

        for (const customer of customers) {
            if (customer.poutcome === 'success') counts.success++;
            else if (customer.poutcome === 'failure') counts.failure++;
            else counts.other++;
        }

        const maxCount = Math.max(counts.success, counts.failure, counts.other);

        if (maxCount === counts.success) return 'Good';
        if (maxCount === counts.failure) return 'Bad';
        return 'Neutral'; // other has the highest count
    },
    getTotalPriorityCustomer: (customers) => {
        const priorityCustomer = customers.filter((customer) => (customer.y === 'yes'));
        return priorityCustomer.length;
    },
    getDepositAverage: (customers) => {
        const priorityCustomer = customers.filter((customer) => (customer.y === 'yes'));

        if (priorityCustomer.length === 0) return 0; // prevent divide-by-zero

        // sum their balances
        const totalBalance = priorityCustomer.reduce((sum, customer) => sum + customer.balance, 0);

        // compute average
        return totalBalance / priorityCustomer.length;
    },
    getTotalSuccessfulCredit: (customers) => {
        const totalSuccessfulCredit = customers.reduce((sum, customer) => customer.poutcome === 'success' ? sum + 1 : sum, 0);

        return totalSuccessfulCredit;
    },
    getCustomerDistribution: (customers) => {
        const customerDistribution = {
            priority: 0,
            nonPriority: 0,
        };

        for (const customer of customers) {
            if (customer.y === 'yes') customerDistribution.priority++;
            else customerDistribution.nonPriority++;
        }

        return customerDistribution;
    },
    getCampaignDistribution: (customers) => {
        const distribution = {};

        for (const { campaign } of customers) {
            const key = Number(campaign);
            distribution[key] = (distribution[key] || 0) + 1;
        }

        return distribution;
    },
    getPromotionTrends: (customers) => {
        const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri'];

        const monthOrder = [
            'jan','feb','mar','apr','may','jun',
            'jul','aug','sep','oct','nov','dec'
        ];

        const stats = {
            daily: {},
            monthly: {},
        };

        // aggregate counts
        for (const customer of customers) {
            const day = customer.day;
            const month = customer.month;

            if (!stats.daily[day]) {
                stats.daily[day] = {
                    day,
                    total_contacted: 0,
                    subscribed: 0,
                    success_rate_pct: 0
                };
            }

            if (!stats.monthly[month]) {
                stats.monthly[month] = {
                    month,
                    total_contacted: 0,
                    subscribed: 0,
                    success_rate_pct: 0
                };
            }

            stats.daily[day].total_contacted++;
            stats.monthly[month].total_contacted++;

            if (customer.y === "yes") {
                stats.daily[day].subscribed++;
                stats.monthly[month].subscribed++;
            }
        }

        // compute success rates
        for (const d in stats.daily) {
            const entry = stats.daily[d];
            entry.success_rate_pct = Number(
                ((entry.subscribed / entry.total_contacted) * 100).toFixed(2)
            );
        }

        for (const m in stats.monthly) {
            const entry = stats.monthly[m];
            entry.success_rate_pct = Number(
                ((entry.subscribed / entry.total_contacted) * 100).toFixed(2)
            );
        }

        // convert objects into arrays & sort
        const daily = Object.values(stats.daily).sort(
            (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
        );

        const monthly = Object.values(stats.monthly).sort(
            (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
        );

        return {
            daily,
            monthly
        };
    },
    getDefaultDistribution: (customers) => {
        const distribution = {};

        for (const customer of customers) {
            // Only count customers who subscribed (y = "yes")
            if (customer.y !== "yes") continue;

            const key = customer.default;  // could be "yes", "no", "unknown"

            // Initialize if not seen before
            if (!distribution[key]) {
                distribution[key] = {
                    default: key,
                    total_customers: 0
                };
            }

            distribution[key].total_customers++;
        }

        // Return as array (like SQL result)
        return Object.values(distribution);
    },
    getJobDepositDistribution: (customers) => {
        const distribution = {};

        for (const customer of customers) {
            // Only count customers who subscribed (y = "yes")
            if (customer.y !== "yes") continue;

            const job = customer.job;

            if (!distribution[job]) {
                distribution[job] = {
                    job,
                    total_deposit_subscribers: 0
                };
            }

            distribution[job].total_deposit_subscribers++;
        }

        // Convert to array and sort DESC
        return Object.values(distribution).sort(
            (a, b) => b.total_deposit_subscribers - a.total_deposit_subscribers
        );
    },
    getTopAverageBalanceByJob: (customers) => {
        const jobStats = {};

        // accumulate totals
        for (const customer of customers) {
            if (customer.y !== 'yes') continue;

            const job = customer.job;

            if (!jobStats[job]) {
                jobStats[job] = {
                    job,
                    totalBalance: 0,
                    count: 0,
                };
            }

            jobStats[job].totalBalance += customer.balance;
            jobStats[job].count++;
        }

        // compute averages
        const jobAverages = Object.values(jobStats).map((stat) => ({
            job: stat.job,
            avg_deposit_balance: Number((stat.totalBalance / stat.count).toFixed(2))
        }));

        // sort descend by average balance
        jobAverages.sort((a, b) => b.avg_deposit_balance - a.avg_deposit_balance);

        // return top 10
        return jobAverages.slice(0, 10);
    },
    getAverageContactDuration: (customers) => {
        const contactStats = {};

        for (const customer of customers) {
            if (customer.y !== "yes") continue;

            const contactType = customer.contact;

            if (!contactStats[contactType]) {
                contactStats[contactType] = {
                    contact_type: contactType,
                    totalDuration: 0,
                    count: 0,
                    customer_rank: "Priority"
                };
            }

            contactStats[contactType].totalDuration += customer.duration;
            contactStats[contactType].count++;
        }

        // compute AVG and format output
        const result = Object.values(contactStats).map(stat => ({
            contact_type: stat.contact_type,
            avg_duration: Number((stat.totalDuration / stat.count).toFixed(2)),
            customer_rank: stat.customer_rank
        }));

        // sort by contact_type
        result.sort((a, b) => a.contact_type.localeCompare(b.contact_type));

        return result;
    },
    getContactEffectiveness: (customers) => {
        const stats = {};

        for (const customer of customers) {
            if (customer.previous <= 0) continue;

            const contact = customer.contact;
            const poutcome = customer.poutcome;

            // create grouping key like "cellular|success"
            const key = `${contact}|${poutcome}`;

            if (!stats[key]) {
                stats[key] = {
                    contact,
                    poutcome,
                    total_nasabah: 0,
                    deposit_success: 0,
                    success_rate_percent: 0
                };
            }

            stats[key].total_nasabah++;

            if (customer.y === "yes") {
                stats[key].deposit_success++;
            }
        }

        // convert to array and compute success rate
        const result = Object.values(stats).map((entry) => ({
            contact: entry.contact,
            poutcome: entry.poutcome,
            total_nasabah: entry.total_nasabah,
            deposit_success: entry.deposit_success,
            success_rate_percent: Number(
                ((entry.deposit_success / entry.total_nasabah) * 100).toFixed(2)
            )
        }));

        // sort by success rate DESC
        result.sort((a, b) => b.success_rate_percent - a.success_rate_percent);

        return result;
    },
    getCampaignContactStats: (customers) => {
        const campaignStats = {};

        for (const customer of customers) {
            const campaign = customer.campaign;

            if (!campaignStats[campaign]) {
                campaignStats[campaign] = {
                    number_of_contacts: campaign,
                    total_customers: 0,
                    success_count: 0,
                    success_rate_percent: 0
                };
            }

            campaignStats[campaign].total_customers++;

            if (customer.y === "yes") {
                campaignStats[campaign].success_count++;
            }
        }

        // convert object to array and compute success rate
        const result = Object.values(campaignStats).map((stat) => ({
            number_of_contacts: stat.number_of_contacts,
            total_customers: stat.total_customers,
            success_count: stat.success_count,
            success_rate_percent: Number(
                ((stat.success_count / stat.total_customers) * 100).toFixed(2)
            ),
        }));

        // sort by number_of_contacts ASC
        result.sort((a, b) => a.number_of_contacts - b.number_of_contacts);

        return result;
    },
    getContactDistribution: (customers) => {
        const contactStats = {};

        for (const customer of customers) {
            const contact = customer.contact;

            if (!contactStats[contact]) {
                contactStats[contact] = {
                    contact,
                    total_contacted: 0,
                    total_success: 0,
                    success_rate_percent: 0
                };
            }

            contactStats[contact].total_contacted++;

            if (customer.y === "yes") {
                contactStats[contact].total_success++;
            }
        }

        // convert to array and compute success rate
        const result = Object.values(contactStats).map((stat) => ({
            contact: stat.contact,
            total_contacted: stat.total_contacted,
            total_success: stat.total_success,
            success_rate_percent: Number(
                ((stat.total_success / stat.total_contacted) * 100).toFixed(2)
            ),
        }));

        // sort total_success DESC
        result.sort((a, b) => b.total_success - a.total_success);

        return result;
    }
};

module.exports = DashboardModel;