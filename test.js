import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,          // Number of virtual users
  duration: '100s',  // Duration of the test (1 minute, 40 seconds)
  cloud: {
    projectID: "3719091",
    name: "Signup Test",
  },

  thresholds : {
     http_req_failed:['rate<0.01'], //http error should be less than
     http_req_duration:['p(95)<200']  //95% of users should be below 200ms
  },

  stages : [
      { duration : '2m' , target: 2000 },  //fast ramp-up to a high point

      {duration : '1m' , target: 0}  //quick ramp-up to 0 users4
  ]
};


export default function() {
  // Define the URL for the signup endpoint
  const url = 'http://localhost:3000/api/v1/user/signup';

  // Define the payload with required fields
  const payload = JSON.stringify({
    fullname: `User_${Math.random().toString(36).substring(7)}`,
    email: `test_${Math.random().toString(36).substring(7)}@example.com`,
    password: 'password123',
  });

  // Set the request headers
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send a POST request to the signup endpoint
  const res = http.post(url, payload, params);

  // Check for a successful signup response (e.g., status 201 Created)
  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  // Pause to simulate real user interaction
  sleep(1);
}
