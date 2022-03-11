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
	setShowInviteWorkspaceModal: (flag: boolean) => void;
}
const InviteWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
	const [newMember, onChangeNewMember, setNewMember] = useInput('');
	const { workspace } = useParams<{ workspace: string; }>();
	const { data: userData } = useSWR<IUser>('/api/users', fetcher);
    const { mutate: mutateMembers } = useSWR<IChannel[]>(
		userData ? `/api/workspaces/${workspace}/channels` : null, 	
		fetcher,
	);
	const onInviteMember = useCallback((e) => {
		e.preventDefault();
		if (!newMember || !newMember.trim()) {
			return;
		}
		axios
		.post(`/api/workspaces/${workspace}/members`, {
			email: newMember,
		})
		.then(() => {
			mutateMembers();
			setShowInviteWorkspaceModal(false);
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
						<span>이메일</span>
						<Input id="member" value={newMember} onChange={onChangeNewMember}/>
					</Label>
					<Button type="submit">초대하기</Button>	 
			</form>
		</Modal>
	)
};

export default InviteWorkspaceModal;