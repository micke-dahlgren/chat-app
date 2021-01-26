import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const ENDPOINT = 'localhost:5000';
let socket;

const useComponentWillMount = (func) => {
    useMemo(func, []);
}

const Join = () => { 
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState([]);
    
    //getting chatrooms from server
    useComponentWillMount(() => {
        socket = io(ENDPOINT);
        socket.on('getRooms', (rooms) => {
            setRooms(rooms);
            setRoom(rooms[0]);
        });
        
    },
	);
    
    
    return (

        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1>Join</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} /></div>
                {/* <div><input placeholder="Room" className="joinInput" type="text" onChange={(event) => setRoom(event.target.value)} /></div> */}
                <select id="chatrooms" name="chatrooms" onChange={(event) => setRoom(event.target.value)}>
                    <option value={rooms[0]} >{rooms[0]}</option>
                    <option value={rooms[1]} >{rooms[1]}</option>
                    <option value={rooms[2]} >{rooms[2]}</option>
                </select>
                <Link onClick={event =>(!name || !room) ? event.preventDefault() : null } to={ `/chat?name=${name}&room=${room}`}>
                    <button type="submit">Sign In</button>
                </Link>

            </div>
        </div>
        
    )
}


export default Join;