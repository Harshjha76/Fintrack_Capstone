-- FinTrack database schema
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS Fin_Track
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Fin_Track;

-- ---------- Tables ----------
CREATE TABLE IF NOT EXISTS income (
  income_id  INT AUTO_INCREMENT PRIMARY KEY,
  amount     DECIMAL(12,2) NOT NULL,
  source     VARCHAR(50)   NOT NULL,
  date       DATE          NOT NULL,
  CONSTRAINT chk_income_amount CHECK (amount > 0),
  INDEX idx_income_date (date)
);

CREATE TABLE IF NOT EXISTS expenses (
  expense_id INT AUTO_INCREMENT PRIMARY KEY,
  amount     DECIMAL(12,2) NOT NULL,
  category   VARCHAR(50)   NOT NULL,
  situation  ENUM('Necessary','Casual','Emergency','Entertainment','Time Pass','Other') NOT NULL,
  date       DATE          NOT NULL,
  CONSTRAINT chk_expense_amount CHECK (amount > 0),
  INDEX idx_expense_date (date),
  INDEX idx_expense_situation (situation)
);

CREATE TABLE IF NOT EXISTS budgets (
  budget_id     INT AUTO_INCREMENT PRIMARY KEY,
  category      VARCHAR(50)   NOT NULL,
  monthly_limit DECIMAL(12,2) NOT NULL,
  month         CHAR(7)       NOT NULL,              -- 'YYYY-MM'
  CONSTRAINT chk_budget_limit CHECK (monthly_limit > 0),
  UNIQUE KEY uq_budget_category_month (category, month)
);

CREATE TABLE IF NOT EXISTS savings_goals (
  goal_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  saved_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,
  deadline      DATE          NULL,
  CONSTRAINT chk_goal_target CHECK (target_amount > 0),
  CONSTRAINT chk_goal_saved  CHECK (saved_amount >= 0)
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(120) NOT NULL,
  message         VARCHAR(500) NOT NULL,
  type            ENUM('transaction','budget','info') NOT NULL DEFAULT 'info',
  is_read         TINYINT(1)   NOT NULL DEFAULT 0,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notification_read (is_read)
);

-- ---------- Sample data ----------
INSERT INTO income (amount, source, date) VALUES
  (8000.00,  'Pocket Money',       '2026-06-01'),
  (5000.00,  'Scholarship',        '2026-06-10'),
  (8000.00,  'Pocket Money',       '2026-07-01'),
  (3500.00,  'Part-time Job',      '2026-07-18'),
  (8000.00,  'Pocket Money',       '2026-08-01'),
  (12000.00, 'Internship Stipend', '2026-08-25'),
  (8000.00,  'Pocket Money',       '2026-09-01'),
  (2500.00,  'Freelance',          '2026-09-14');

INSERT INTO expenses (amount, category, situation, date) VALUES
  (4500.00, 'Rent & Hostel',     'Necessary',     '2026-06-02'),
  (1850.00, 'Food & Dining',     'Necessary',     '2026-06-05'),
  (650.00,  'Books & Supplies',  'Necessary',     '2026-06-08'),
  (399.00,  'Mobile & Internet', 'Necessary',     '2026-06-09'),
  (480.00,  'Entertainment',     'Entertainment', '2026-06-14'),
  (320.00,  'Food & Dining',     'Time Pass',     '2026-06-20'),
  (900.00,  'Shopping',          'Casual',        '2026-06-24'),
  (4500.00, 'Rent & Hostel',     'Necessary',     '2026-07-02'),
  (2100.00, 'Food & Dining',     'Necessary',     '2026-07-06'),
  (399.00,  'Mobile & Internet', 'Necessary',     '2026-07-09'),
  (1200.00, 'Health',            'Emergency',     '2026-07-11'),
  (750.00,  'Entertainment',     'Entertainment', '2026-07-19'),
  (260.00,  'Transport',         'Casual',        '2026-07-22'),
  (450.00,  'Food & Dining',     'Time Pass',     '2026-07-27'),
  (4500.00, 'Rent & Hostel',     'Necessary',     '2026-08-02'),
  (1950.00, 'Food & Dining',     'Necessary',     '2026-08-05'),
  (399.00,  'Mobile & Internet', 'Necessary',     '2026-08-09'),
  (2800.00, 'Tuition & Fees',    'Necessary',     '2026-08-12'),
  (1500.00, 'Shopping',          'Casual',        '2026-08-17'),
  (600.00,  'Entertainment',     'Entertainment', '2026-08-23'),
  (380.00,  'Transport',         'Necessary',     '2026-08-28'),
  (4500.00, 'Rent & Hostel',     'Necessary',     '2026-09-02'),
  (1700.00, 'Food & Dining',     'Necessary',     '2026-09-04'),
  (399.00,  'Mobile & Internet', 'Necessary',     '2026-09-09'),
  (850.00,  'Transport',         'Emergency',     '2026-09-12'),
  (540.00,  'Entertainment',     'Entertainment', '2026-09-16'),
  (290.00,  'Food & Dining',     'Time Pass',     '2026-09-19'),
  (700.00,  'Books & Supplies',  'Necessary',     '2026-09-21'),
  (200.00,  'Other',             'Other',         '2026-09-23');

INSERT INTO budgets (category, monthly_limit, month) VALUES
  ('Food & Dining',     2500.00, '2026-06'),
  ('Rent & Hostel',     5000.00, '2026-06'),
  ('Mobile & Internet',  500.00, '2026-06'),
  ('Food & Dining',     2500.00, '2026-07'),
  ('Rent & Hostel',     5000.00, '2026-07'),
  ('Food & Dining',     2500.00, '2026-08'),
  ('Rent & Hostel',     5000.00, '2026-08'),
  ('Food & Dining',     2500.00, '2026-09');

INSERT INTO savings_goals (name, target_amount, saved_amount, deadline) VALUES
  ('New Laptop',      55000.00, 32000.00, '2026-12-31'),
  ('Emergency Fund',  20000.00, 20000.00, '2026-10-31'),
  ('Trip Fund',       15000.00,  4500.00, '2027-03-15');

INSERT INTO notifications (title, message, type) VALUES
  ('Welcome to FinTrack', 'Add your income and expenses to see analytics.', 'info'),
  ('Budget set', 'Food & Dining budget for the month is Rs. 2500.00.', 'budget');

-- ---------- Analysis queries (for viva / testing) ----------
-- Totals and balance
SELECT
  (SELECT COALESCE(SUM(amount),0) FROM income)   AS total_income,
  (SELECT COALESCE(SUM(amount),0) FROM expenses) AS total_expenses,
  (SELECT COALESCE(SUM(amount),0) FROM income) -
  (SELECT COALESCE(SUM(amount),0) FROM expenses) AS balance;

-- Category-wise
SELECT category, SUM(amount) AS total, COUNT(*) AS entries
FROM expenses GROUP BY category ORDER BY total DESC;

-- Situation-wise
SELECT situation, COUNT(*) AS entries, SUM(amount) AS total, ROUND(AVG(amount),2) AS average
FROM expenses GROUP BY situation ORDER BY total DESC;

-- Monthly
SELECT YEAR(date) AS yr, MONTH(date) AS mon, SUM(amount) AS total
FROM expenses GROUP BY YEAR(date), MONTH(date) ORDER BY yr, mon;

-- Budget vs actual for one month
SELECT b.category, b.monthly_limit AS limit_amount,
       COALESCE(e.spent, 0) AS spent,
       b.monthly_limit - COALESCE(e.spent, 0) AS remaining
FROM budgets b
LEFT JOIN (
  SELECT category, SUM(amount) AS spent
  FROM expenses WHERE YEAR(date) = 2026 AND MONTH(date) = 9
  GROUP BY category
) e ON e.category = b.category
WHERE b.month = '2026-09';

-- Savings goal progress
SELECT name, saved_amount, target_amount,
       ROUND(saved_amount / target_amount * 100, 1) AS progress_percent
FROM savings_goals ORDER BY deadline;
