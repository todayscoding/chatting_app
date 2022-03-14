import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import React, { useCallback, FC } from 'react';
import axios from 'axios';
import useInput from '@hooks/useInput';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { IUser, IChannel } from '@typings/db';

interface Props {
	show: boolean;
	onCloseModal: () => void;
	setShowInviteChannelModal: (flag: boolean) => void;
}
const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
	const [newMember, onChangeNewMember, setNewMember] = useInput('');
	const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
	
	const { data: userData } = useSWR<IUser>('/api/users', fetcher);
    const { mutate: mutateMembers } = useSWR<IChannel[]>(
		userData ? `/api/workspaces/${workspace}/channels/members` : null, 	
		fetcher,
	);
	const onInviteMember = useCallback((e) => {
		e.preventDefault();
		if (!newMember || !newMember.trim()) {
			return;
		}
		axios
		.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
			email: newMember,
		})
		.then(() => {
			mutateMembers();
			setShowInviteChannelModal(false);
			setNewMember('');
		})
		.catch((error) => {
			console.dir(error);
			toast.error(error.response?.data, { position: 'bottom-center' });
		})
	}, [newMember]);
	return (
		<Modal show={show} onCloseModal={onCloseModal}>
			<form onSubmit={onInviteMember}>
					<Label id="member-label">
						<span>채널 멤버 초대</span>
						<Input id="member" value={newMember} onChange={onChangeNewMember}/>
					</Label>
					<Button type="submit">초대하기</Button>	 
			</form>
		</Modal>
	)
};

export default InviteChannelModal;