import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import React, { VFC, useCallback, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
	chatSections: { [key: string]: IDM[] };
}
const ChatList: VFC<Props> = ({ chatSections }) => {
	const scrollbarRef = useRef(null);
	const onScroll = useCallback(() => {
		
	}, []);
	return (
		<ChatZone>
			<Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
				{Object.entries(chatSections).map(([date, chats]) => {
					return (
						<Section className={`section-${date}`} key={date}>
							<StickyHeader>
								<button>{date}</button>
							</StickyHeader>
							{chats.map(() => (
								<Chat key={chat.id} data={chat}/>
							))}
						</Section>
					)
				}
				))}
			</Scrollbars>
		</ChatZone>
	)
};

export default ChatList;