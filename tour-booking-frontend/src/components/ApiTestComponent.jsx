import React, { useState } from 'react';
import { Button, Alert, Card } from 'react-bootstrap';

const ApiTestComponent = () => {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testAPI = async () => {
    setTesting(true);
    try {
      console.log('Testing API connection...');
      
      // Test places endpoint
      const response = await fetch('http://localhost:5050/api/TourPlanner/places');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        setTestResult({
          success: true,
          message: `✅ API Working! Got ${data.length} places`,
          data: data
        });
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        setTestResult({
          success: false,
          message: `❌ API Error: ${response.status} - ${errorText}`
        });
      }
    } catch (error) {
      console.error('Network Error:', error);
      setTestResult({
        success: false,
        message: `❌ Network Error: ${error.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header>
        <h6 className="mb-0">🔧 API Connection Test</h6>
      </Card.Header>
      <Card.Body>
        <Button 
          variant="outline-primary" 
          onClick={testAPI} 
          disabled={testing}
          size="sm"
        >
          {testing ? 'Testing...' : 'Test API Connection'}
        </Button>
        
        {testResult && (
          <Alert 
            variant={testResult.success ? 'success' : 'danger'} 
            className="mt-3 mb-0"
          >
            <strong>{testResult.message}</strong>
            {testResult.data && (
              <div className="mt-2">
                <small>Sample places: {testResult.data.slice(0, 3).map(p => p.name).join(', ')}</small>
              </div>
            )}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default ApiTestComponent;
