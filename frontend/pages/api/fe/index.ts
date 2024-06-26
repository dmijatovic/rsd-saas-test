// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import app from '../../../package.json'

type Data = {
  module: string,
  version: string,
  status: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({module: 'frontend/api', version: app.version, status:'live'})
}
