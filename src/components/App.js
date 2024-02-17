import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    file: null
  });

  useEffect(() => {
    getAgents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAgentData({
      ...agentData,
      [name]: files ? files[0] : value
    })
  }

  const getAgents = () => {
    axios.get('/agents')
      .then(response => {
        setData(response.data.data)
         setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching agents:', error);
      });
  };

  const addAgent = () => {
    const { name, description, system_prompt, file } = agentData;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('system_prompt', system_prompt);
    formData.append('file', file);

    axios.post('/agents', formData)
      .then(() => {
        setAgentData({
          name: '',
          description: '',
          system_prompt: '',
          file: null
        });
        getAgents();
      })
      .catch(error => {
        console.error('Error adding agent:', error);
      })
  }

  return (
    <div>
      <h1>Agents</h1>
      {loading ? (
          <p>Loading Agents...</p>
      ) : (
        <>
          <div>
            <input
              type="text"
              placeholder="Agent Name"
              name="name"
              value={agentData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Agent Description"
              name="description"
              value={agentData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="System Prompt"
              name="system_prompt"
              value={agentData.system_prompt}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="file"
              name="file"
              onChange={handleChange}
            />
          </div>
          <button onClick={addAgent}>Add Agent</button>
          <ul>
            {data.map(agent => (
              <li key={agent.id}>
                ID: {agent.id}, Name: {agent.agent_name}, Description: {agent.description}, System Prompt: {agent.system_prompt}
              </li>
          ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
