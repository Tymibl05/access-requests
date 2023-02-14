import React from 'react';
import { formatWindow } from '../../../utils';

export const Pending = ({ pending }) => {
  return (
    <div className="Pending">
      <h2>Pending Requests</h2>
      <div className="requests">
        {pending &&
          pending.map((req) => (
            <div key={req._id} value={req._id}>
              <h3>{req.name}</h3>
              <h4>{formatWindow(req.window.start, req.window.end)}</h4>
              <h5>Description:</h5>
              <p>{req.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};
