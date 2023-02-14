import React from 'react';
import { formatWindow } from '../../../utils';
import { Link } from 'react-router-dom';

export const Pending = ({ pending }) => {
  return (
    <div className="Pending">
      <div className="header">
        <h2>Pending Requests</h2>
      </div>
      <div className="requests">
        {pending &&
          pending.map((req) => (
            <Link to={`/request/${req._id}`} key={req._id}>
              <div key={req._id} value={req._id} className="req">
                <h3>{req.name}</h3>
                <h5>{formatWindow(req.window.start, req.window.end)}</h5>
                <b>Description:</b>
                <p>{req.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
