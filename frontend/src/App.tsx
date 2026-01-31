import { useState, useEffect } from 'react'
import './App.css'

interface Item {
  id: number;
  name: string;
  status: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = '/api';

  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching items:", err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>IDP Resource Manager 🚀</h1>
      {loading ? <p>Loading... </p> : (
        <table border={1} cellPadding={10} style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App