import React from 'react';

 
const Messages = ({users}) => (
    <div className="textContainer">
        {users.map((name, i) => <div key={i}>{name}</div>)}
    </div>
);

export default Messages;