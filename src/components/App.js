import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Form,
  FormGroup,
  FileUpload,
  TextInput,
  Panel,
  PanelMain,
  PanelMainBody,
} from '@patternfly/react-core';
import { Table, Caption, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';

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
    <Panel>
      <PanelMain>
        <PanelMainBody>
          <h4>Add Agent</h4>
          {loading ? (
              <p>Loading Agents...</p>
          ) : (
            <div>
              <Form>
                <FormGroup>
                  <FormGroup label="Agent Name" isRequired>
                    <TextInput isRequired type="text" name="name" value={agentData.name} onChange={handleChange} />
                  </FormGroup>

                  <FormGroup label="Agent Description" isRequired>
                    <TextInput isRequired type="text" name="description" value={agentData.description} onChange={handleChange} />
                  </FormGroup>

                  <FormGroup label="System Prompt" isRequired>
                    <TextInput isRequired type="text" name="system_prompt" value={agentData.system_prompt} onChange={handleChange} />
                  </FormGroup>

                  <FormGroup label="File">
                    <input
                      type="file"
                      name="file"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button onClick={addAgent}>Add Agent</Button>
                  </FormGroup>
                </FormGroup>
              </Form>
              <Table aria-label="Simple table">
              <Caption>Agents</Caption>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Description</Th>
                  <Th>System Prompt</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map(agent => (
                  <Tr>
                    <Td>{agent.id}</Td>
                    <Td>{agent.agent_name}</Td>
                    <Td>{agent.description}</Td>
                    <Td>{agent.system_prompt}</Td>
                  </Tr>
                ))}
              </Tbody>
              </Table>
            </div>
          )}
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
}

export default App;
