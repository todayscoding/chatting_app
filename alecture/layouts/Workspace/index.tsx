import { 
	Header,
	RightMenu,
	ProfileImg,
	WorkspaceWrapper,
	Workspaces,
	Channels,
	WorkspaceName,
	MenuScroll,
	Chats
} from '@layouts/Workspace/styles';
import loadable from '@loadable/component'
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback }from 'react';
import useSWR from 'swr';
import { Redirect } from 'react-router-dom';
import gravatar from 'gravatar';
import { Switch, Route } from 'react-router-dom';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = ({children}) => {
	const {data, error, mutate} = useSWR('/api/users', fetcher, {
		dedupingInterval: 100000 //100초
	});
	
	const onLogout = useCallback(() => {
		axios.post('/api/users/logout', null, {
			//withCredentials: true,
		})
		.then(() => {
			mutate(false, false);
		})
	}, []);
	
	if (!data) {
		return <Redirect to="/login" />;
	}
	
	return(
		<div>
			<Header>
				<RightMenu>
					<span>
						<ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
					</span>
				</RightMenu>
			</Header>
			<button onClick={onLogout}>로그아웃</button>
			<WorkspaceWrapper>
				<Workspaces>test</Workspaces>
				<Channels>
					<WorkspaceName>Sleact</WorkspaceName>
					<MenuScroll>menu scroll</MenuScroll>
				</Channels>
				<Chats>
					<Switch>
						<Route path="/workspace/channel/:channel" component={Channel} />
			 			<Route path="/workspace/dm/:id" component={DirectMessage}/>
					</Switch>
				</Chats>
			</WorkspaceWrapper>
		</div>
	);
};

export default Workspace;