import { PieChart } from "lucide-react";

import {
  formatCurrency
} from "../utils/budget";

const categoryColours = [
  "#4f46e5",
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#db2777",
  "#0891b2",
  "#ca8a04"
];

function SpendingBreakdown({ categories }) {
  return (
    <section className="workspace-panel">
      <div className="calculator-heading">
        <PieChart size={26} />

        <div>
          <h2>Spending Breakdown</h2>

          <p>
            Understand where your money is going.
          </p>
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="spending-breakdown">
          {categories.map((category, index) => (
            <div
              className="spending-category"
              key={category.category}
            >
              <div className="spending-category-header">
                <strong>{category.category}</strong>

                <span>
                  {formatCurrency(category.amount)}
                </span>
              </div>

              <div className="spending-category-track">
                <div
                  className="spending-category-fill"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor:
                      categoryColours[
                        index % categoryColours.length
                      ]
                  }}
                />
              </div>

              <span className="spending-percentage">
                {category.percentage.toFixed(1)}%
                {" of total expenses"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <PieChart size={40} />

          <h2>No expenses recorded</h2>

          <p>
            Your spending breakdown will appear
            when you record expenses for this month.
          </p>
        </div>
      )}
    </section>
  );
}

export default SpendingBreakdown;