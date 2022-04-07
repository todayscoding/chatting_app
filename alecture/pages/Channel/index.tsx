import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import { Container, Header } from '@pages/Channel/styles';
import useInput from '@hooks/useInput';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';

const Channel = () => {
	const { workspace, channel } = useParams<{ workspace: string; channel: string; }>();
	console.log(workspace, channel);
	const [chat, onChangeChat, setChat] = useInput('');
	const onSubmitForm = useCallback((e) => {
		e.preventDefault();
		console.log('submit');
		setChat('');
	}, []);
	
	return (
		<Container>
			<Header>채널</Header>
			<ChatList />
			<ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
		</Container>
	);
};

export default Channel;