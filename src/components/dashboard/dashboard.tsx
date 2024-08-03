import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
//Everything in here is a placeholder that needs to be build up.
interface UserMetrics {
  someMetric: number;
}

const Dashboard: React.FC = () => {
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);

  useEffect(() => {
    fetch('/api/user-metrics')
      .then(response => response.json())
      .then(data => setUserMetrics(data));
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Zenith Dashboard</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.widget}>
          <h2>User Metrics</h2>
          {userMetrics ? (
            <p>{userMetrics.someMetric}</p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className={styles.widget}>
          <h2>Challenge Progress</h2>
          <p>Placeholder for challenge progress...</p>
        </div>
        <div className={styles.widget}>
          <h2>Recent Activities</h2>
          <p>Placeholder for recent activities...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
