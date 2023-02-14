import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../Context';
import { formatWindow } from '../../utils';
import { Visitor } from './components/Visitor';
import './request.scss';

export const Request = () => {
  const {
    state: { user },
  } = useStore();
  const { req_id } = useParams();
  const [request, setRequest] = useState(null);
  useEffect(() => {
    if (req_id) {
      (async () => {
        const url = `http://localhost:5000/api/requests/${req_id}`;
        const res = await fetch(url);
        if (!res.ok) {
          const error = await res.json();
          return console.log(error.message);
        }
        const result = await res.json();
        return setRequest(result);
      })();
    }
  }, [req_id]);
  return (
    <div id="Request">
      {request && (
        <div
          className={`container ${user.is_client ? 'client' : 'not_client'}`}
        >
          <div className="Info">
            <h2>{request.name}</h2>
            <h3 className={`status ${request.status}`}>
              {request.status.toUpperCase()}
            </h3>
            <h3 className="window">
              {formatWindow(request.window.start, request.window.end)}
            </h3>
            <h4>Description: </h4>
            <h5>{request.description}</h5>
          </div>
          <div className="Visitors">
            <div className="header">
              <h2>Visitors</h2>
              {user.is_client && request.status === 'active' && (
                <div>Selected:</div>
              )}
              {user.is_client && request.status === 'active' && (
                <div className="actions">
                  <button>Check In</button>
                  <button>Check Out</button>
                </div>
              )}
            </div>
            <div className="cards">
              {request.visitors.map((vis) => (
                <Visitor key={vis.user_id} visitor={vis} req_id={request._id} />
              ))}
            </div>
          </div>
          <div className="Logs">
            <h2>Activity Log</h2>
          </div>
        </div>
      )}
    </div>
  );
};
