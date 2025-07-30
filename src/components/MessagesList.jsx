import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import MessageListItem from './MessageListItem';


const MessagesList = () => {
  const [conversations, setConversations] = useState([]);
  const token = useSelector(state => state?.user?.currentUser?.token)
  const socket = useSelector(state => state?.user?.socket)

  const getConversations = async () => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/conversation`,
        {withCredentials: true, headers: { Authorization: `Bearer ${token}`}}
      )
      setConversations(response?.data);

    } catch(error){
      console.log(error)

    }
  }

  useEffect(() => {
    getConversations()
  },[socket])
  return (
    <menu className='messagesList'>
      <h3>Recent Message</h3>
      {
        conversations?.map(conversation => <MessageListItem Key={conversation?._id}
        conversation={conversation} />)
      }
    </menu>
    
  )
}

export default MessagesList