import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const Dashboard = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((json) => {
        const salesData = json.products.map((product) => ({
          name: product.title,
          sales: product.stock,
          category: product.category,
        }));

        setData(salesData);
        setFilteredData(salesData);

        const uniqueCategories = [
          "All",
          ...new Set(json.products.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.category === category));
    }
  };

  return (
    <div className="dashboard-container">
      <button className="theme-button" onClick={toggleTheme}>
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>
      <h2>Sales Chart (API Data)</h2>
      <div className="filter-container">
        <label>Filter by Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="loading">Loading data...</p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="95%" height="100%">
            <BarChart data={filteredData} barSize={100}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 16 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" animationDuration={1000} />

            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <button className="refresh-button" onClick={fetchData}>
        Refresh Data 🔄
      </button>
    </div>
  );
};

export default Dashboard;
