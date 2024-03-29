import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteComment } from '../../../api/postAPI'
import { useTranslation } from 'react-i18next';


const CommentMenu = ({post, comment, setOnEdit}) => {
    const { t } = useTranslation();
    const { auth, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleRemove = () => {
        if(post.user._id === auth.user._id || comment.user._id === auth.user._id){
        
    
         deleteComment({post, auth, comment, socket,dispatch})
        }
    }

    const MenuItem = () => {
        return(
            <>
                <div className="dropdown-item" onClick={() => setOnEdit(true)}> 
                    <span className="material-icons">create</span>    {t('edit')}
                </div>
                <div className="dropdown-item" onClick={handleRemove}>
                    <span className="material-icons">delete_outline</span>  {t('delete')}
                </div>
            </>
        )
    }


    return (
        <div className="menu">
            {
                (post.user._id === auth.user._id || comment.user._id === auth.user._id) &&
                <div className="nav-item dropdown">
                    <span className="material-icons" id="moreLink" data-toggle="dropdown">
                        more_vert
                    </span>

                    <div className="dropdown-menu" aria-labelledby="moreLink">
                        {
                            post.user._id === auth.user._id
                            ? comment.user._id === auth.user._id
                                ? MenuItem()
                                : <div className="dropdown-item" onClick={handleRemove}>
                                    <span className="material-icons">delete_outline</span> Remove
                                </div>
                            : comment.user._id === auth.user._id && MenuItem()
                        }
                    </div>

                </div>
            }
            
        </div>
    )
}

export default CommentMenu
