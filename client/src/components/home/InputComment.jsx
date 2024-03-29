import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../../api/postAPI'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
/* import { createComment } from '../../redux/actions/commentAction' */
/* import Icons from '../Icons' */

const InputComment = ({ children, post, onReply, setOnReply }) => {
    const [content, setContent] = useState('')
    const { t } = useTranslation();
    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        console.log('submit comment')
        e.preventDefault()
        if (!content.trim()) {
            if (setOnReply) return setOnReply(false);
            return;
        }

        setContent('')

        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }
        await createComment(dispatch, post, newComment, auth)
        /*  dispatch(createComment({post, newComment, auth, socket})) */

        if (setOnReply) return setOnReply(false);
    }

    return (
        /*  <form className="bg-gray-200  rounded-full relative py-2 flex" onSubmit={handleSubmit} >
             {children}
             <input type="text" placeholder="Add your comments..." className='mx-3 bg-transparent w-[85%] shadow-none'
             value={content} onChange={e => setContent(e.target.value)}
            />
 
      
 
             <button type="submit" className="postBtn">
                 Post
             </button>
         </form> */
        <form className="px-2 mb-2 " onSubmit={handleSubmit} >
            {
                children ?
                <div  className='flex flex-row mx-2 mb-1 py-1 items-center '>
                        {children}
                        <input type="text" placeholder={t('comments')}
                            value={content} onChange={e => setContent(e.target.value)} className='w-[80%] lg:w-[78%] mr-2 bg-transparent'
                        />



<button type="submit" className="bg-blue-400 font-medium text-black py-2 px-3 rounded-lg">
                                {t('post')}
                            </button>
                    </div>
                    :
                    <div >
                        <div  className='flex flex-row mx-2 py-1 items-center '>
                            <input type="text" placeholder={t('comments')}
                                value={content} onChange={e => setContent(e.target.value)} className='w-[90%]  mr-2'
                            />
                            <button type="submit" className="bg-blue-400 font-medium text-black py-2 px-3 rounded-lg">
                                {t('post')}
                            </button>
                        </div>
                    </div>
            }

        </form>

    )
}

export default InputComment
