import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { FC } from 'react'

interface pageProps {
  params : {
    chatId : string
  }
}

const page: FC<pageProps> = async({params} : pageProps) => {

  const {chatId} = params;
  const session = await getServerSession(authOptions)


  return <div>{params.chatId}</div>
}

export default page