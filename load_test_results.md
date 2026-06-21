# TruthGuard Web Application - Baseline/Load Testing Results

This report documents the performance of the TruthGuard Web Application server under a baseline load test simulating concurrent users.

## Test Configuration
- **Target URL**: `http://localhost:3000/` (Express static file server)
- **Virtual Users (Concurrency)**: 100 concurrent connections
- **Duration**: 1 minute (60.12 seconds total)
- **Testing Tool**: Autocannon (Node.js load-testing utility)

---

## Performance Summary

The server demonstrated exceptional stability and speed under the load of 100 concurrent users. 

| Metric | Result |
| :--- | :--- |
| **Total Requests Handled** | 236,000 |
| **Total Data Read** | 1.98 GB |
| **Average Requests per Second (RPS)** | **3,940.37 req/sec** |
| **Average Response Time** | **24.9 ms** |
| **Min Response Time (2.5% percentile)** | **16 ms** |
| **Max Response Time (Slowest)** | **118 ms** |

---

## Detailed Metrics

### 1. Requests Per Second (RPS)
The server successfully handled around 3,940 requests per second continuously, indicating highly stable throughput.

- **Average**: 3,940.37 req/sec
- **Min**: 2,725 req/sec
- **Max (97.5% percentile)**: 5,455 req/sec
- **Standard Deviation**: 1,008.5 req/sec

### 2. Response Time (Latency Distribution)
Response times remained consistently fast, with the slowest response peaking at only 118ms.

- **Fastest (2.5% percentile)**: 16 ms
- **Average**: 24.9 ms
- **Median (50% percentile)**: 21 ms
- **97.5% percentile**: 36 ms
- **99% percentile**: 40 ms
- **Slowest (Max)**: 118 ms
- **Standard Deviation**: 7.44 ms

---

## Analysis & Recommendations
1. **Excellent Throughput**: Handling ~3.9k requests/sec is an extremely strong result for a single-threaded Node.js Express server. This is because the server is serving static frontend assets (HTML, CSS, and JS) from memory/disk cache.
2. **Sub-25ms Latency**: The average response time is 24.9ms, with 99% of all requests served in under 40 milliseconds, ensuring a highly responsive user experience.
3. **Database & External APIs**: The web application connects directly to Firebase Firestore on the client-side (`app.js` using Firestore SDK CDN). Therefore, database reads/writes bypass this local Express server and go directly to Firebase. As a result, the backend server itself only handles static serving, making it highly resilient to load.
