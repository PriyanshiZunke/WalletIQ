import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { defaultCategories } from '../utils/defaultCategories.js';

const DEMO_USER = {
    name: 'Priyanshi',
    email: 'priyanshi@gmail.com',
    password: 'Test@1234',
    currency: 'USD',
};

const BUDGETS = [
    { name: 'Food & Dining', amount: 600 },
    { name: 'Groceries', amount: 500 },
    { name: 'Entertainment', amount: 120 },
    { name: 'Transportation', amount: 350 },
    { name: 'Shopping', amount: 200 },
];

const generateTransactions = (categoryMap) => {
    const transactions = [];
    const today = new Date();
    let seed = 1;

    const random = () => {
        seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };

    const rangeFloat = (min, max) => min + random() * (max - min);
    const rangeInt = (min, max) => Math.floor(rangeFloat(min, max + 1));
    const pick = (items) => items[Math.floor(random() * items.length)];

    for (let monthsAgo = 11; monthsAgo >= 0; monthsAgo -= 1) {
        const monthStart = new Date(
            today.getFullYear(),
            today.getMonth() - monthsAgo,
            1
        );
        const daysInMonth = new Date(
            monthStart.getFullYear(),
            monthStart.getMonth() + 1,
            0
        ).getDate();
        const lastDay = monthsAgo === 0 ? today.getDate() : daysInMonth;

        const dateOn = (day) => {
            const year = monthStart.getFullYear();
            const month = String(monthStart.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}-${String(day).padStart(2, '0')}`;
        };

        const add = (day, categoryName, amount, type, description) => {
            if (day < 1 || day > lastDay) return;

            const categoryId = categoryMap[categoryName];
            if (!categoryId) return;

            transactions.push({
                categoryId,
                amount: Number(amount.toFixed(2)),
                type,
                description,
                date: dateOn(day),
            });
        };

        add(1, 'Salary', 2750, 'income', 'Salary deposit');
        add(15, 'Salary', 2750, 'income', 'Salary deposit');

        if (monthsAgo % 3 === 1) {
            add(
                rangeInt(10, 22),
                'Freelance',
                rangeFloat(400, 1100),
                'income',
                'Client project'
            );
        }

        if (random() < 0.5) {
            add(
                rangeInt(8, 25),
                'Other Income',
                rangeFloat(15, 120),
                'income',
                pick(['Cashback', 'Refund', 'Gift'])
            );
        }

        add(2, 'Rent', 1800, 'expense', 'Monthly rent');
        add(rangeInt(5, 9), 'Utilities', rangeFloat(75, 110), 'expense', 'Electricity');
        add(rangeInt(10, 14), 'Utilities', rangeFloat(45, 70), 'expense', 'Internet');
        add(3, 'Entertainment', 15.99, 'expense', 'Netflix');
        add(5, 'Entertainment', 10.99, 'expense', 'Spotify');
        add(7, 'Entertainment', 9.99, 'expense', 'YouTube Premium');

        for (let day = 1; day <= lastDay; day += 1) {
            const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            if (!isWeekend && random() < 0.8) {
                add(day, 'Food & Dining', rangeFloat(4, 8), 'expense', pick([
                    'Morning coffee',
                    'Coffee',
                    'Latte',
                ]));
            }

            if (!isWeekend && random() < 0.55) {
                add(day, 'Food & Dining', rangeFloat(10, 18), 'expense', pick([
                    'Lunch',
                    'Salad bowl',
                    'Sandwich',
                ]));
            }

            if (isWeekend && random() < 0.5) {
                add(day, 'Food & Dining', rangeFloat(28, 75), 'expense', pick([
                    'Dinner out',
                    'Restaurant',
                    'Brunch',
                ]));
            }

            if (!isWeekend && random() < 0.4) {
                add(day, 'Transportation', rangeFloat(2.5, 6), 'expense', pick([
                    'Subway',
                    'Parking',
                ]));
            }

            if (random() < 0.15) {
                add(day, 'Shopping', rangeFloat(12, 48), 'expense', 'Amazon order');
            }
        }

        for (let day = 1; day <= lastDay; day += 1) {
            const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
            if (date.getDay() === 0) {
                add(day, 'Groceries', rangeFloat(55, 120), 'expense', pick([
                    'Whole Foods',
                    "Trader Joe's",
                    'Weekly groceries',
                ]));
            }
        }

        for (let day = 4; day <= lastDay; day += 7) {
            add(day, 'Transportation', rangeFloat(35, 60), 'expense', 'Gas');
        }

        if (monthsAgo % 2 === 0) {
            add(
                rangeInt(8, 25),
                'Shopping',
                rangeFloat(55, 180),
                'expense',
                pick(['Clothes', 'New shoes'])
            );
        }

        if ([10, 6, 2].includes(monthsAgo)) {
            add(rangeInt(10, 20), 'Healthcare', rangeFloat(40, 130), 'expense', 'Doctor visit');
        }

        if (monthsAgo % 2 === 0) {
            add(rangeInt(8, 14), 'Personal Care', rangeFloat(35, 55), 'expense', 'Haircut');
        }

        if ([11, 7, 3].includes(monthsAgo)) {
            add(rangeInt(15, 22), 'Travel', rangeFloat(180, 380), 'expense', 'Weekend trip');
        }
    }

    return transactions;
};

const seed = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const existing = await client.query(
            'SELECT id FROM users WHERE email = $1',
            [DEMO_USER.email]
        );

        if (existing.rows.length > 0) {
            console.log(`Removing existing demo user (${DEMO_USER.email})...`);
            await client.query('DELETE FROM users WHERE email = $1', [DEMO_USER.email]);
        }

        console.log(`Creating user ${DEMO_USER.email}...`);
        const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
        const userResult = await client.query(
            `INSERT INTO users (name, email, password_hash, currency)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [DEMO_USER.name, DEMO_USER.email, passwordHash, DEMO_USER.currency]
        );
        const userId = userResult.rows[0].id;

        console.log(`Seeding ${defaultCategories.length} default categories...`);
        for (const category of defaultCategories) {
            await client.query(
                `INSERT INTO categories (user_id, name, type, icon, color, is_default)
                 VALUES ($1, $2, $3, $4, $5, true)`,
                [userId, category.name, category.type, category.icon, category.color]
            );
        }

        const categoryResult = await client.query(
            'SELECT id, name FROM categories WHERE user_id = $1',
            [userId]
        );
        const categoryMap = Object.fromEntries(
            categoryResult.rows.map((category) => [category.name, category.id])
        );

        const transactions = generateTransactions(categoryMap);
        console.log(`Inserting ${transactions.length} transactions across 12 months...`);

        for (const transaction of transactions) {
            await client.query(
                `INSERT INTO transactions
                    (user_id, category_id, amount, type, description, transaction_date)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    userId,
                    transaction.categoryId,
                    transaction.amount,
                    transaction.type,
                    transaction.description,
                    transaction.date,
                ]
            );
        }

        const currentDate = new Date();
        const monthStart = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
        ).padStart(2, '0')}-01`;

        console.log(`Inserting ${BUDGETS.length} budgets...`);
        for (const budget of BUDGETS) {
            const categoryId = categoryMap[budget.name];
            if (!categoryId) continue;

            await client.query(
                `INSERT INTO budgets (user_id, category_id, amount, period, start_date)
                 VALUES ($1, $2, $3, 'monthly', $4)`,
                [userId, categoryId, budget.amount, monthStart]
            );
        }

        await client.query('COMMIT');
        console.log('\nDemo data seeded successfully!');
        console.log(`Email: ${DEMO_USER.email}`);
        console.log(`Password: ${DEMO_USER.password}`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Seed failed:', error);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
};

seed();
