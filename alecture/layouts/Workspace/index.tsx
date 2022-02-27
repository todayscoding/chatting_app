import Menu from '@components/Menu';
import { 
	Header,
	RightMenu,
	ProfileImg,
	WorkspaceWrapper,
	Workspaces,
	Channels,
	WorkspaceName,
	MenuScroll,
	Chats,
	ProfileModal,
	LogOutButton,
} from '@layouts/Workspace/styles';
import loadable from '@loadable/component'
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useState, useCallback } from 'react';
import useSWR from 'swr';
import { Redirect } from 'react-router-dom';
import gravatar from 'gravatar';
import { Switch, Route } from 'react-router-dom';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = ({children}) => {
	const [showUserMenu, setShowUserMenu] = useState(false);
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
	
	const onClickUserProfile = useCallback(() => {
		setShowUserMenu((prev) => !prev);	
	}, []);
	if (!data) {
		return <Redirect to="/login" />;
	}
	
	return(
		<div>
			<Header>
				<RightMenu>
					<span onClick={onClickUserProfile}>
						<ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
						{showUserMenu && (
							<Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
								<ProfileModal>
									<img src={gravatar.url(data.email, { s: '36px', d: 'retro' })} alt={data.nickname}/>
									<div>
										<span id="profile-name">{data.nickname}</span>
										<span id="profile-actice">Active</span>
									</div>
								</ProfileModal>
								<LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
							</Menu>
						)}	
					</span>
				</RightMenu>
			</Header>
			<WorkspaceWrapper>
				<Workspaces>test</Workspaces>
				<Channels>
					<WorkspaceName>Sleact</WorkspaceName>
					<MenuScroll>menu scroll</MenuScroll>
				</Channels>
				<Chats>
					<Switch>
						<Route path="/workspace/channel" component={Channel} />
			 			<Route path="/workspace/dm" component={DirectMessage}/>
					</Switch>
				</Chats>
			</WorkspaceWrapper>
		</div>
	);
};

export default Workspace;