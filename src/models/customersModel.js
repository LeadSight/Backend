const { updateCustomerProbability } = require('../controllers/customerControllers');
const supabase = require('../helpers/db');

const mergeCustomersWithEcon = (customers, economicIndicators) => {
    return customers.map((customer, index) => ({
        ...customer,
        emp_var_rate: economicIndicators[index]?.emp_var_rate ?? null,
        cons_price_idx: economicIndicators[index]?.cons_price_idx ?? null,
        cons_conf_idx: economicIndicators[index]?.cons_conf_idx ?? null,
        euribor3m: economicIndicators[index]?.euribor3m ?? null,
        nr_employed: economicIndicators[index]?.nr_employed ?? null
    }));
}

const CustomersModel = {
    getCustomers: async (filters, limit, offset) => {
        // Remove empty values while also formatting the search to add % (helps with searching)
        Object.keys(filters).forEach(key => {
            if (filters[key] === "" || filters[key] == null) {
                delete filters[key];
            }
            if (key === "search" && filters[key] != null) {
                filters[key] = `%${filters[key]}%`;
            }
        });

        // If after cleaning it's empty, force {}
        if (Object.keys(filters).length === 0) {
            filters = {};
        }

        const { data, error } = await supabase.rpc("get_customers", {
            filters,
            limit_size: limit,
            offset_size: offset
        });

        if (error) {
            console.error("RPC get_customers error:", error);
            throw error;
        }

        const merged = mergeCustomersWithEcon(data.customers, data.econs);

        data.customers = merged;
        
        return data;
    },
    addCustomer: async ({ id, customerName, age, job, marital, education, defaultValue, balance, housing, hasLoan, contact, month, day, duration, campaign, pdays, previous, poutcome }) => {
                
        const { error } = await supabase
            .from("customers")
            .insert({
                id,
                name: customerName,
                age,
                job,
                marital,
                education,
                default: defaultValue,
                balance,
                housing,
                loan: hasLoan,
                contact,
                month,
                day,
                duration,
                campaign,
                pdays,
                previous,
                poutcome
            });

        if (error) throw error;
    },
    addEconomicIndicator: async ({ emp_var_rate, cons_price_idx, cons_conf_idx, euribor3m, nr_employed }) => {
        
        const { error } = await supabase
            .from("economic_indicators")
            .insert({
                emp_var_rate,
                cons_price_idx,
                cons_conf_idx,
                euribor3m,
                nr_employed
            });

        if (error) throw error;
    },
    getStatusColor: async({ key, value }) => {
        const allowedNumericColumns = [
            "balance",
            "campaign",
            "previous",
            "duration",
            "cons_price_idx",
            "cons_conf_idx"
        ];

        if (!allowedNumericColumns.includes(key)) {
            throw new Error(`Invalid numeric key: ${key}`);
        }

        const { data, error } = await supabase.rpc("get_status_color_stats", { col: key });

        if (error) throw error;


        const average = Number(data[0].average) || 0;
        const total = Number(data[0].total) || 0;

        // Avoid division by zero
        if (average === 0) {
            return 'bg-yellow-400'; // no comparison possible
        }

        // Compute ratio
        const ratio = (value / total) / average;

        // Determine color
        if (ratio >= 0.9) return 'bg-green-500';
        if (ratio >= 0.7) return 'bg-red-500';
        return 'bg-yellow-400';
    },
    updateCustomerProbability: async (id, probability) => {
        const { error } = await supabase
            .from("customers")
            .update({ probability })
            .eq("id", id);

        if (error) throw error;

        return true;
    }
}

module.exports = CustomersModel;