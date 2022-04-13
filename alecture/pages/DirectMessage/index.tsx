import { Container, Header } from '@pages/DirectMessage/styles';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import fetcher from '@utils/fetcher';
import { IUser, IChannel, IDM } from '@typings/db';
import useInput from '@hooks/useInput';
import React, { useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import gravatar from 'gravatar';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import axios from 'axios';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars-2';

const DirectMessage = () => {
	const { workspace, id } = useParams<{ workspace: string; id: string}>();
	const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
	const { data: myData } = useSWR('/api/users', fetcher);
	const [chat, onChangeChat, setChat] = useInput('');
	const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
		(index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,	
		fetcher,
	);
	// [{id: 1}, {id: 2}, {id: 3}, {id: 4}]
	// 40 20 20
	//45 20 20 5
	const isEmpty = chatData?.[0]?.length === 0;
	const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
	const scrollbarRef = useRef<Scrollbars>(null);
	const onSubmitForm = useCallback((e) => {
		e.preventDefault();
		console.log(chat);
		if (chat?.trim()) {
			axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
				content: chat,
			})
			.then(() => {
				mutateChat();
				setChat('');
			})
			.catch(console.error);
		}
	}, [chat]);
	
	if (!userData || !myData) {
		return null;
	}
	
	const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);	
	return <Container>
		<Header>
			<img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
			<span>{userData.nickname}</span>
		</Header>
		<ChatList 
			chatSections={chatSections} 
			scrollbarRef={scrollbarRef} 
			setSize={setSize} 
			isEmpty={isEmpty} 
			isReachingEnd={isReachingEnd}
		/>
		<ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
	</Container>
};

export default DirectMessage;