import React from 'react';
import { formatWindow } from '../../../utils';
import { Link } from 'react-router-dom';

export const Active = ({ active }) => {
  return (
    <div className="Active">
      <div className="header">
        <h2>Active Requests</h2>
        <div className="filters">
          <h4>All</h4>
          <h4>Today</h4>
          <h4>This Week</h4>
          <h4>This Month</h4>
        </div>
      </div>
      <div className="requests">
        {active &&
          active.map((req) => (
            <Link to={`/request/${req._id}`} key={req._id}>
              <div key={req._id} value={req._id} className="req">
                <h3>{req.name}</h3>
                <h4>{formatWindow(req.window.start, req.window.end)}</h4>
                <div className="visitors">
                  {req.visitors.map((vis) => (
                    <h5 key={vis.user_id}>{vis.user_name}</h5>
                  ))}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
