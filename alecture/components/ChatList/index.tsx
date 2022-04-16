import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import { IChat, IDM } from '@typings/db';
import React, { FC, useCallback, RefObject } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
	chatSections: { [key: string]: IDM[] };
	scrollbarRef: RefObject<Scrollbars>;
	setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
	isEmpty: boolean;
	isReachingEnd: boolean;  
}
const ChatList: FC<Props> = ({ chatSections, scrollbarRef, setSize, isEmpty, isReachingEnd }) => {
	const onScroll = useCallback((values) => {
		if (values.scrollTop === 0 && !isReachingEnd) {
			console.log('가장위');
			setSize((prevSize) => prevSize + 1).then(() => {
				//스크롤 위치 유지
				if (scrollbarRef?.current) {
					scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
				}
			});
		}
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
							{chats.map((chat) => (
								<Chat key={chat.id} data={chat}/>
							))}
						</Section>
					);
				})}
			</Scrollbars>
		</ChatZone>
	);
};

export default ChatList;