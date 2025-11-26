const pool = require('../helpers/db');

const CustomersModel = {
    getCustomers: async() => {
        // get the customer table
        const query = 'SELECT * FROM customers';

        const result = await pool.query(query);

        return result.rows;
    },
    getEconomicIndicators: async() => {
        // get the economic indicators table
        const query = 'SELECT * FROM economic_indicators';
    
        const result = await pool.query(query);
    
        return result.rows;
    },
    mergeCustomersWithEcon: (customers, economicIndicators) => {
        return customers.map((customer, index) => ({
            ...customer,
            emp_var_rate: economicIndicators[index]?.emp_var_rate ?? null,
            cons_price_idx: economicIndicators[index]?.cons_price_idx ?? null,
            cons_conf_idx: economicIndicators[index]?.cons_conf_idx ?? null,
            euribor3m: economicIndicators[index]?.euribor3m ?? null,
            nr_employed: economicIndicators[index]?.nr_employed ?? null
        }));
    },
    getCustomerRank: async() => {
        // get customers by rank
        const customers = await CustomersModel.getCustomers();

        const economicIndicators = await CustomersModel.getEconomicIndicators();

        const mergedCustomers =  CustomersModel.mergeCustomersWithEcon(customers, economicIndicators);
        
        // Placeholder probability (to be replaced later)
        const computeProbability = () => Math.random();

        const rankedCustomers = mergedCustomers.map((customer, index) => {
            const probability = computeProbability(customer);

            return {
                id: index + 1,
                customerId: customer.id, // TODO: This does not exist yet
                customerName: customer.name ?? "Unnamed", // TODO: so does this
                hasLoan: customer.loan === "yes" ? "Yes" : "No",
                hasDeposit: customer.y === "yes" ? "Yes" : "No",
                hasDefault: customer.default === "yes" ? "Yes" : "No",
                category: customer.y === "yes" ? "Priority" : "Not Priority",
                probability: `${Math.round(probability * 100)}%`, // TODO: This is still fake
                notes: [],
                ...customer,
                y: customer.y === "yes" ? "Yes" : "No"
            };
        });

        // sort by probability (highest → lowest)
        rankedCustomers.sort((a, b) => {
            // extract numbers from "92%" → 92
            const pa = parseFloat(a.probability);
            const pb = parseFloat(b.probability);
            return pb - pa;
        });

        return rankedCustomers;
    },
    computeDetailAverages: (customers, detailKeys) => {
        const totals = {};
        const counts = {};

        for (const key of detailKeys) {
            totals[key] = 0;
            counts[key] = 0;
        }

        for (const customer of customers) {
            for (const key of detailKeys) {

                const value = customer[key];

                // only average numeric fields
                if (typeof value === "number" && !isNaN(value)) {
                    totals[key] += value;
                    counts[key] += 1;
                }
            }
        }

        // compute averages
        const averages = {};
        for (const key of detailKeys) {
            if (counts[key] > 0) {
                averages[key] = totals[key] / counts[key];
            }
        }

        return averages;
    },
    getStatusLabel: (value, average) => {
        const ratio = value / average;

        if (ratio >= 0.9) return "Green";  
        if (ratio >= 0.7) return "Red";    
        return "Yellow";                  
    },
    getCustomerDemographics: async(id) => {
        const customers = await DashboardModel.getCustomers();

        const economicIndicators = await DashboardModel.getEconomicIndicators();
        
        const rankedCustomers = DashboardModel.getCustomerRank(customers, economicIndicators);

        const customer = rankedCustomers.find((c) => c.id === id);

        if (!customer) return null;

        const detail = {
            age: customer.age,
            job: customer.job,
            balance: customer.balance,
            duration: customer.duration,
            campaign: customer.campaign,
            previous: customer.previous,
            cons_price_idx: customer.cons_price_idx,
            cons_conf_idx: customer.cons_conf_idx
        };

        const detailKeys = Object.keys(detail);

        // compute averages of numeric fields
        const averages = DashboardModel.computeDetailAverages(rankedCustomers, detailKeys);

        const status = {};

        for (const key of detailKeys) {
            const value = detail[key];

            if (typeof value === "number" && averages[key] !== undefined) {
                status[key] = DashboardModel.getStatusLabel(value, averages[key]);
            } else {
                status[key] = "Green";
            }
        }

        return {
            header: {
                id: customer.id,
                name: customer.name,
                y: customer.y,
                skorPrioritas: customer.probabilityScore,
            },
            detail,
            status
        };
    }
}

module.exports = CustomersModel;