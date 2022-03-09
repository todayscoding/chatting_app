import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import React, { useCallback, VFC } from 'react';
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
	setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
	const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
	const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
	
	const {data: userData, error, mutate } = useSWR<IUser | false>(
		'/api/users',
		fetcher,
		{
			dedupingInterval: 2000, //2초
		},
	);
    const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
		userData ? `/api/workspaces/${workspace}/channels` : null, 	
		fetcher,
	);
	const onCreateChannel = useCallback((e) => {
		e.preventDefault();
		axios.post(`/api/workspaces/${workspace}/channels`, {
			name: newChannel,
		}, {
			//withCredentials: true,
			},
		)
		.then(() => {
			setShowCreateChannelModal(false);
			mutateChannel();
			setNewChannel('');
		})
		.catch((error: any) => {
			console.dir(error);
			toast.error(error.response?.data, { position: 'bottom-center' });
		})
	}, [newChannel]);
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