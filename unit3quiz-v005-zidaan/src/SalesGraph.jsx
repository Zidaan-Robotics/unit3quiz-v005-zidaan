import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import './SalesGraph.css';

function SalesGraph() {
  const [allData, setAllData] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load and process CSV file
    fetch('/Warehouse_and_Retail_Sales.csv')
      .then(response => response.text())
      .then(csvText => {
        // Parse CSV
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            // Aggregate data by SUPPLIER (treating each supplier as a warehouse)
            const aggregated = {};
            
            results.data.forEach(row => {
              if (row.SUPPLIER && row.SUPPLIER !== '') {
                const supplier = row.SUPPLIER;
                if (!aggregated[supplier]) {
                  aggregated[supplier] = {
                    supplier: supplier,
                    warehouseSales: 0,
                    retailSales: 0
                  };
                }
                aggregated[supplier].warehouseSales += parseFloat(row['WAREHOUSE SALES'] || 0);
                aggregated[supplier].retailSales += parseFloat(row['RETAIL SALES'] || 0);
              }
            });

            // Convert to array and sort by warehouse sales (descending)
            const sortedData = Object.values(aggregated)
              .sort((a, b) => b.warehouseSales - a.warehouseSales);

            setAllData(sortedData);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
        setLoading(false);
      });
  }, []);

  // Get the data to display based on displayCount
  const displayedData = allData.slice(0, displayCount);
  const maxItems = allData.length;

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading data...</div>
      </div>
    );
  }

  return (
    <div className="sales-graph-container">
      <div className="graph-header">
        <h2>Warehouse and Retail Sales by Supplier</h2>
        <div className="controls">
          <label htmlFor="displayCount">
            Number of suppliers to display:
            <select
              id="displayCount"
              value={displayCount}
              onChange={(e) => setDisplayCount(Number(e.target.value))}
              className="count-select"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value={maxItems}>All ({maxItems})</option>
            </select>
          </label>
        </div>
        <p className="subtitle">Sorted by Warehouse Sales (Descending)</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: displayedData.length > 30 ? 150 : 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="supplier" 
              angle={displayedData.length > 30 ? -45 : -45}
              textAnchor="end"
              height={displayedData.length > 30 ? 180 : 150}
              interval={0}
              style={{ fontSize: displayedData.length > 50 ? '8px' : '10px' }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="warehouseSales" fill="#8884d8" name="Warehouse Sales" />
            <Bar dataKey="retailSales" fill="#82ca9d" name="Retail Sales" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesGraph;

