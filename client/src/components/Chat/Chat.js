import React, { useState,  useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
let socket;

const Chat = ({ location }) => { 
	const [name, setName] = useState('');
	const [room, setRoom] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);

	const ENDPOINT = 'localhost:5000';
	
	/*
	useEffect is filling the function of ComponentDidMount & ComponentDidUpdate. You can also specify ComponentWillUnmount 
	*/
	
	useEffect(() => {
		const { name, room } = queryString.parse(location.search);

		socket = io(ENDPOINT); //passing endpoint to server.

		setName(name);
		setRoom(room);

		socket.emit('join', { name, room }, () => { 
			console.log(`Welcome ${name}, to the ${room} - chatroom`);
		}); //socket.emit(STRING_THAT_BACKEND_RECOGNIZES, PAYLOAD);

		return () => { 
			socket.emit('disconnect');
			socket.off();
		}//used for disconnect

		}, [ENDPOINT, location.search] //Only re-render useEffect if any of these values change.
	);

	useEffect(() => {
		socket.on('roomData', ({ users }) => {
			setUsers([...users.map(x => x.name)]);
		})
		}, [users]
	);

	useEffect(() => {
		socket.on('message', (message) => {
			setMessages([...messages, message]);
		})
		}, [messages]//run only when messages array changes
	);

	//function for sending messages
	const sendMessage = (event) => { 
		event.preventDefault(); //prevent page refresh

		if (message) { 
			socket.emit('sendMessage', message, () => { 
				setMessage(''); //clear input field
			})
		}
	}


	return (
		<div className="outerContainer">
			<div className="container">
				<InfoBar room={room} />
				<Messages messages={messages} name={name}/>
				<Input
					message={message}
					setMessage={setMessage}
					sendMessage={sendMessage}
				/>
			</div>
			{/* display people online now */}
			<TextContainer users={users} />

		</div>
	)
}


export default Chat;