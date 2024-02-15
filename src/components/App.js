import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState('');
  const [newAgent, setNewAgent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('/agents')
      .then(response => {
        setData(response.data.data)
         setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching agents:', error)
      });
  };

  return (
    <div>
      <h1>Agents</h1>
      {loading ? (
          <p>Loading Agents...</p>
      ) : (
        <ul>
          {data.map(agent => (
            <li key={agent.id}>
              ID: {agent.id}, Name: {agent.name}
            </li>
        ))}
        </ul>
      )}
    </div>
  );
}

export default App;
