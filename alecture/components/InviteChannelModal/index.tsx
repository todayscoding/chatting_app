import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IUser, IChannel } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, FC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
	show: boolean;
	onCloseModal: () => void;
	setShowInviteChannelModal: (flag: boolean) => void;
}
const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
	const [newMember, onChangeNewMember, setNewMember] = useInput('');
	const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
	console.log(workspace, channel);

	const { data: userData } = useSWR<IUser>('/api/users', fetcher);
    const { mutate: revalidateMembers } = useSWR<IChannel[]>(
		userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null, 	
		fetcher,
	);
	
	const onInviteMember = useCallback(
		(e) => {
			e.preventDefault();
			if (!newMember || !newMember.trim()) {
				return;
			}
			axios
			.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
				email: newMember,
			})
			.then(() => {
				console.log(channel);
				revalidateMembers();
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