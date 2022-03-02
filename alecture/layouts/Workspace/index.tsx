import Menu from '@components/Menu';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { 
	AddButton,
	Channels,
	Chats,
	Header,
	LogOutButton,
	MenuScroll,
	ProfileImg,
	ProfileModal,
	RightMenu,
	WorkspaceButton,
	WorkspaceName,
	Workspaces,
	WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import loadable from '@loadable/component'
import { Label, Input, Button } from '@pages/SignUp/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useState, useCallback } from 'react';
import { Redirect } from 'react-router';
import { Link, Switch, Route } from 'react-router-dom';
import useSWR from 'swr';
import gravatar from 'gravatar';
import { toast } from 'react-toastify';
 

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = ({children}) => {
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
	const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
	const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
	 
	const {data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
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
	
	const onCloseUserProfile = useCallback((e) => {
		console.log('close');
		e.stopPropagation();
		setShowUserMenu(false);
	}, []);
	
	const onClickUserProfile = useCallback(() => {
		console.trace('click');
		setShowUserMenu((prev) => !prev);	
	}, []);
	
	const onClickCreateWorkspace = useCallback(() => {
	 	setShowCreateWorkspaceModal(true);
	}, []);
	
	const onCreateWorkspace = useCallback((e) => {
		e.preventDefault();
		if (!newWorkspace || !newWorkspace.trim()) return;
		if (!newUrl || !newUrl.trim()) return;
		axios.post('/api/workspaces', {
			workspace: newWorkspace,
			url: newUrl,
		})
		.then(() => {
			mutate();
			setShowCreateWorkspaceModal(false);
			setNewWorkspace('');
			setNewUrl('');
		})
		.catch((error) => {
			console.dir(error);
			toast.error(error.response?.data, { position: 'bottom-center' });
		});	 
	}, [newWorkspace, newUrl]);
	
	const onCloseModal = useCallback(() => {
 		setShowCreateWorkspaceModal(false);	 
	}, []);
	
	
	if (!userData) {
		return <Redirect to="/login" />;
	}
	
	
	return(
		<div>
			<Header>
				<RightMenu>
					<span onClick={onClickUserProfile}>
						<ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
						{showUserMenu && (
							<Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
								<ProfileModal>
									<img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname}/>
									<div>
										<span id="profile-name">{userData.nickname}</span>
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
				<Workspaces>{userData?.Workspaces.map((ws) => {
						return (
							<Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
								<WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
							</Link>
						)
					})}
					<AddButton onClick={onClickCreateWorkspace}>+</AddButton>
				</Workspaces>
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
			<Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>//새워크스페이스 만드는 모델
				<form onSubmit={onCreateWorkspace}>
					<Label id="workspace-label">
						<span>워크스페이스 이름</span>
						<Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
					</Label>
					<Label id="workspace-url-label">
						<span>워크스페이스 url</span>
						<Input id="workspace" value={newUrl} onChange={onChangeNewUrl}/>
					</Label>
					<Button type="submit">생성하기</Button>
				</form>
			</Modal>
		</div>
	);
};

export default Workspace;