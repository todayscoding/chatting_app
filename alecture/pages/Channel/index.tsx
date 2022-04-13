import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import { Container, Header } from '@pages/Channel/styles';
import useInput from '@hooks/useInput';
import React, { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import makeSection from '@utils/makeSection';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IUser, IChannel, IDM } from '@typings/db';
import Scrollbars from 'react-custom-scrollbars-2';

const Channel = () => {
	const { workspace, channel, id } = useParams<{ workspace: string; channel: string; id: string; }>();
	const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
		`/api/workspaces/${workspace}/dms/${id}/chats`,	
		fetcher,
	);
	const scrollbarRef = useRef<Scrollbars>(null);
	console.log(workspace, channel);
	const [chat, onChangeChat, setChat] = useInput('');
	const onSubmitForm = useCallback((e) => {
		e.preventDefault();
		console.log('submit');
		setChat('');
	}, []);
	
	
	const chatSections = makeSection(chatData ? [...chatData].reverse() : []);
	
	return (
		<Container>
			<Header>채널</Header>
			<ChatList chatSections={chatSections} scrollbarRef={scrollbarRef}/>
			<ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
		</Container>
	);
};

export default Channel;