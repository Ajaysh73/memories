import React, { useState } from 'react';
import { Avatar, Button, Grid, Paper, Typography, Container } from '@material-ui/core';
import Input from './Input';
import { signin, signup } from '../../actions/auth';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import useStyles from './styles';
import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory } from 'react-router-dom';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
const Auth = () => {
	const classes = useStyles();
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState(initialState);
	const [isSignup, setIsSignup] = useState(false);
	const dispatch = useDispatch();
	const history = useHistory();
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isSignup) {
			dispatch(signup(formData, history));
		} else {
			dispatch(signin(formData, history));
		}
		console.log(formData);
	};
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleShowPassword = () => {
		setShowPassword((prevState) => !prevState);
	};
	const switchMode = () => {
		setIsSignup((prevState) => !prevState);
	};
	const googleSucess = async (res) => {
		const result = res?.profileObj;
		const token = res?.tokenId;
		try {
			dispatch({ type: 'AUTH', payload: { result, token } });
			history.push('/');
		} catch (error) {
			console.log(error);
		}
	};
	const googleFailure = () => {
		console.log('Google Sign In Failed - Try again later. ');
	};
	return (
		<Container component='main' maxWidth='sm'>
			<Paper className={classes.paper} elevation={8}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						{isSignup && (
							<>
								<Input name='firstName' label='First Name' onChange={handleChange} half autoFocus />
								<Input name='lastName' label='Last Name' onChange={handleChange} half />
							</>
						)}
						<Input name='email' label='Email Address' onChange={handleChange} type='email' />
						<Input name='password' label='Password' onChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
						{isSignup && <Input name='confirmPassword' label='Repeat Password' onChange={handleChange} type='password' />}
					</Grid>
					<Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
						{isSignup ? 'Sign Up' : 'Sign In'}
					</Button>
					<GoogleLogin
						clientId='977073119513-guegu0vj85fb6i03bmsq5q5kb88d1aia.apps.googleusercontent.com'
						render={(renderProps) => (
							<Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant='contained'>
								Google Sign In
							</Button>
						)}
						onSuccess={googleSucess}
						onFailure={googleFailure}
						cookiePolicy='single_host_origin'
					/>
					<Grid container justifyContent='flex-end'>
						<Grid item>
							<Button onClick={switchMode}>{isSignup ? 'Already have an account? Sign In' : 'Dont have an an account? Sign Up'}</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default Auth;
