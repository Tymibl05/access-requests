import React, { useEffect, useState } from 'react';

export const Visitor = ({
  visitor,
  req_id,
  req_status,
  selected,
  setSelected,
  badges,
  setBadges,
}) => {
  const [badge, setBadge] = useState(null);
  useEffect(() => {
    if (visitor && visitor.is_onsite) {
      (async () => {
        const url = `http://localhost:5000/api/badges/by-user/${visitor.user_id}`;
        const res = await fetch(url);
        if (!res.ok) {
          // const error = await res.json();
          // console.log(error.message)
          return;
        }
        const result = await res.json();
        if (result.number) return setBadge(result);
      })();
    }
  }, [visitor, req_id]);

  const [isSelected, setIsSelected] = useState(false);
  const selectHandler = () => {
    const prevB = badge;
    if (prevB) {
      const update = badges.filter((b) => b._id !== prevB._id);
      setBadges([...update, { ...prevB, is_available: true }]);
    }

    if (isSelected) {
      const update = selected.filter((sel) => sel.user_id !== visitor.user_id);
      setSelected(update);
      if (!visitor.is_onsite) setBadge(null);
    } else setSelected([...selected, { ...visitor, badge: badge }]);

    return setIsSelected(!isSelected);
  };
  useEffect(() => {
    const isSelected = selected.filter(
      (sel) => sel.user_id === visitor.user_id
    );
    if (isSelected.length > 0) return setIsSelected(true);
    setIsSelected(false);
  }, [selected, visitor.user_id]);

  const badgeHandler = (e) => {
    const newB = badges.filter((b) => b._id === e.target.value)[0];
    if (newB) {
      const prevB = badge;
      if (prevB) {
        const updateBadges = badges.filter(
          (b) => b._id !== prevB._id && b._id !== newB._id
        );
        setBadges([
          ...updateBadges,
          { ...prevB, is_available: true },
          { ...newB, is_available: false },
        ]);
      } else {
        const updateBadges = badges.filter((b) => b._id !== newB._id);
        setBadges([...updateBadges, { ...newB, is_available: false }]);
      }
      const updateSelected = selected.filter(
        (sel) => sel.user_id !== visitor.user_id
      );
      setSelected([...updateSelected, { ...visitor, badge: newB }]);
      setBadge(newB);
    } else {
      const prevB = badge;
      if (prevB) {
        const updateBadges = badges.filter((b) => b._id !== prevB._id);
        setBadges([...updateBadges, { ...prevB, is_available: true }]);
      }
      const updateSelected = selected.filter(
        (sel) => sel.user_id !== visitor.user_id
      );
      setSelected([...updateSelected, { ...visitor, badge: null }]);
      setBadge(null);
    }
  };

  return (
    <div
      className={`visitor bounce ${isSelected && 'selected'} ${
        visitor.is_onsite && 'in'
      }`}
      onClick={selectHandler}
    >
      <h4 className={`status ${visitor.is_onsite ? 'in' : 'out'}`}>
        {visitor.is_onsite ? 'In' : 'Out'}
      </h4>
      <h3>{visitor.user_name}</h3>
      <h4>{visitor.company_name}</h4>
      {visitor.is_onsite && <h5>{badge ? badge.number : 'Escort'}</h5>}
      {req_status === 'active' && !visitor.is_onsite && isSelected && (
        <select onClick={(e) => e.stopPropagation()} onChange={badgeHandler}>
          <option value={'escort'}>Escort</option>
          {badges.map((b) => (
            <option key={b._id} value={b._id} disabled={!b.is_available}>
              Badge: {b.number}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
