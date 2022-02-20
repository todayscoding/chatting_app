import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback }from 'react';
import useSWR from 'swr';
import { Redirect } from 'react-router-dom';


const Workspace: FC = ({children}) => {
	const {data, error, mutate} = useSWR('/api/users', fetcher);
	
	const onLogout = useCallback(() => {
		axios.post('/api/users/logout', null, {
			//withCredentials: true,
		})
		.then(() => {
			mutate();
		})
	}, []);
	
	if (!data) {
		return <Redirect to="/login" />;
	}
	return(
		<div>
			<button onClick={onLogout}>로그아웃</button>
			{children}
		</div>
	);
};

export default Workspace;