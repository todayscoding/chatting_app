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
	setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal: FC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
	const { workspace } = useParams<{ workspace: string; }>();
	const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
	
	const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
    const { mutate: revalidateChannel } = useSWR<IChannel[]>(
		userData ? `/api/workspaces/${workspace}/channels` : null, 	
		fetcher,
	);
	
	const onCreateChannel = useCallback(
		(e) => {
		e.preventDefault();
		axios.post(`/api/workspaces/${workspace}/channels`, {
			name: newChannel,
		}, {
			//withCredentials: true,
			},
		)
		.then(() => {
		    revalidateChannel();
			setShowCreateChannelModal(false);
			setNewChannel('');
		})
		.catch((error: any) => {
			console.dir(error);
			toast.error(error.response?.data, { position: 'bottom-center' });
		})
	}, [newChannel, revalidateChannel, setNewChannel, setShowCreateChannelModal, workspace]
	);
	return (
		<Modal show={show} onCloseModal={onCloseModal}>
			<form onSubmit={onCreateChannel}>
					<Label id="channel-label">
						<span>채널</span>
						<Input id="channel" value={newChannel} onChange={onChangeNewChannel}/>
					</Label>
					<Button type="submit">생성하기</Button>	 
			</form>
		</Modal>
	)
};

export default CreateChannelModal;	