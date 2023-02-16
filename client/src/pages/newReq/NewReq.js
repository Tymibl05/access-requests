import React, { useEffect, useState } from 'react';
import { useStore } from '../../Context';
import { formatWindow } from '../../utils';
import './newReq.scss';

export const NewReq = () => {
  const {
    state: { user },
  } = useStore();
  const [employees, setEmployees] = useState([]); // each vis needs user_id + user_name
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const results =
    search === ''
      ? []
      : employees.filter((emp) =>
          emp.user_name.toUpperCase().includes(search.toUpperCase())
        );

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const updateSelected = (e) => {
    const emp_id = e.target.value;
    const inSelected = selected.filter((sel) => sel.user_id === emp_id);
    if (inSelected.length === 0) {
      const employee = employees.filter((emp) => emp.user_id === emp_id);
      return setSelected([...selected, employee[0]]);
    } else {
      const filter = selected.filter((sel) => sel.user_id !== emp_id);
      return setSelected(filter);
    }
  };

  useEffect(() => {
    (async () => {
      const url = `http://localhost:5000/api/companies/${user.company_id}/get-employees`;
      const res = await fetch(url);
      if (!res.ok) {
        const error = await res.json();
        return console.log(error.message);
      }
      const result = await res.json();
      return setEmployees(result);
    })();
  }, [user.company_id]);
  const submitReq = async (e) => {
    e.preventDefault();
  };
  return (
    <div id="NewReq">
      <div className="container">
        <h1>New Request</h1>

        <div className="Info">
          <h2>REQ********</h2>
          <form onSubmit={submitReq}>
            <div className="window">
              <div className="header">
                <h3>Window: </h3>
                {(start && end) !== '' && <b>{formatWindow(start, end)}</b>}
              </div>
              <div className="dates">
                <div>
                  <h4>Start:</h4>
                  <input
                    required
                    type="datetime-local"
                    name="start"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                <div>
                  <h4>End:</h4>
                  <input
                    required
                    type="datetime-local"
                    name="end"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="description">
              <h3>Description: </h3>
              <textarea
                required
                name="description"
                cols="52"
                rows="10"
                placeholder="Access request description..."
              />
            </div>
          </form>
        </div>

        <div className="Visitors">
          <div className="header">
            <div>
              <h2>Visitors: </h2>
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                placeholder="Search for employee"
              />
            </div>
            {results.length > 0 && (
              <div className="results">
                {results.map((emp) => (
                  <button
                    key={emp.user_id}
                    value={emp.user_id}
                    onClick={updateSelected}
                  >
                    {emp.user_name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="cards">
            {selected.map((vis) => (
              <div key={vis.user_id} className="vis">
                <h3>{vis.user_name}</h3>
                <h4>{vis.company_name}</h4>
                <button value={vis.user_id} onClick={updateSelected}>
                  Trash
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
