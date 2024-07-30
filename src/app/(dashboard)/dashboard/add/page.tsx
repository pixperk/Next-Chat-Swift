import AddFriendsButton from '@/components/AddFriendsButton'
import { FC } from 'react'

const page: FC = () => {
  return <main className='pt-8 '>
    <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
    <AddFriendsButton/>
  </main>
}

export default page