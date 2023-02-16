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
  const [selected, setSelected] = useState([]);
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
  const updateStatus = async (e) => {
    if (!request) return;

    const status =
      e.target.value === 'approve'
        ? 'active'
        : e.target.value === 'deny' && 'cancelled';

    const url = `http://localhost:5000/api/requests/${request._id}/update-status`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status }),
    });
    if (!res.ok) {
      const error = await res.json();
      return console.log(error.message);
    }
    const result = await res.json();
    console.log(result.message);
    return setRequest({ ...request, status: status });
  };
  const updateAccess = (e) => {
    if (!request || request.status !== 'active' || selected.length === 0)
      return;
    for (let i = selected.length - 1; i > 0; i--) {
      if (selected[i].is_onsite !== selected[i - 1].is_onsite)
        return console.log('Input error');
    }
    const is_onsite = selected[0].is_onsite;
    if (e.target.value === 'in' && is_onsite)
      return console.log(`${selected[0].user_name} is ALREADY checked in.`);
    if (e.target.value === 'out' && !is_onsite)
      return console.log(`${selected[0].user_name} is NOT checked in.`);

    const url = `http://localhost:5000/api/requests/${request._id}/update-access`;
    selected.forEach(async (sel) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { _id: sel.user_id, is_onsite: !sel.is_onsite },
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        return console.log(error.message);
      }
      // const result = await res.json();
      // console.log(result.message);

      const updateReq = request;
      updateReq.visitors.forEach((vis) => {
        if (vis.user_id === sel.user_id) vis.is_onsite = !vis.is_onsite;
      });
      setRequest({ ...updateReq });
    });
    return setSelected([]);
  };
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
            {user.is_client && request.status === 'pending' && (
              <div className="actions">
                <button
                  className="approve"
                  value="approve"
                  onClick={updateStatus}
                >
                  Approve
                </button>
                <button className="deny" value="deny" onClick={updateStatus}>
                  Deny
                </button>
              </div>
            )}
          </div>
          <div className="Visitors">
            <div className="header">
              <h2>Visitors</h2>
              {user.is_client && request.status === 'active' && (
                <div className={`selected ${selected.length > 0 && 'true'}`}>
                  {selected.length} Selected
                </div>
              )}
              {user.is_client && request.status === 'active' && (
                <div className="actions">
                  <button value="in" onClick={updateAccess}>
                    Check In
                  </button>
                  <button value="out" onClick={updateAccess}>
                    Check Out
                  </button>
                </div>
              )}
            </div>
            <div className="cards">
              {request.visitors.map((vis) => (
                <Visitor
                  key={vis.user_id}
                  visitor={vis}
                  req_id={request._id}
                  selected={selected}
                  setSelected={setSelected}
                  onClick={() => console.log('vis clicked')}
                />
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
