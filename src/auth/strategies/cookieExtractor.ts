import { Request } from 'express'

export const cookieExtractor = (cookieName: string) => {
	return (req: Request) => {
		let token = null
		if (req && req.cookies) {
			token = req.cookies?.[cookieName]
		}
		return token
	}
}
