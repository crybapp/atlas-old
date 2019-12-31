import { Response } from 'express'

interface IAPIResponse {
		response: string
		error: {
				title: string
				description: string
		}
		status: number
}

export const UserNoAuth: IAPIResponse = {
		response: 'USER_NO_AUTH',
		error: {
				title: 'User No Auth',
				description: 'You are not authenticated. Please log out and try again'
		},
		status: 401
}

export const UserNotFound: IAPIResponse = {
		response: 'USER_NOT_FOUND',
		error: {
				title: 'User Not Found',
				description: 'This user was not found'
		},
		status: 404
}

export const UserIsNotPermitted: IAPIResponse = {
		response: 'USER_IS_NOT_PERMITTED',
		error: {
				title: 'User Is Not Permitted',
				description: 'You\'re not permitted to perform this action. Refresh the page and try again'
		},
		status: 401
}

export const EmailAlreadyExists: IAPIResponse = {
		response: 'EMAIL_ALREADY_EXISTS',
		error: {
				title: 'Email Already Exists',
				description: 'A user has already created an account with this email. If this was you, reset your password.'
		},
		status: 409
}

export const handleError = (error: any, res: Response) => {
		console.error(error)

		if (!error) res.sendStatus(500)
		else if (error.response && error.error && error.status) res.status(error.status).send(error)
		else if (error.status) res.sendStatus(error.status)
		else res.sendStatus(500)
}
