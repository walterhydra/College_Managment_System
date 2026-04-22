import autocannon from 'autocannon';

const runLoadTest = () => {
  console.log('Initiating Load Test on Advanced API endpoints...');

  const instance = autocannon({
    url: 'http://localhost:5000/api/advanced/placements',
    connections: 500, // Simulating 500 concurrent socket/connection hooks
    pipelining: 1,
    duration: 10, // 10 seconds of intensive load testing
  }, console.log);

  autocannon.track(instance, { renderProgressBar: true });
};

runLoadTest();
