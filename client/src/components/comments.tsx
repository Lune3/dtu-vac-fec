import { CommentsType } from "../types";
import {format} from "date-fns"

type commentProp = {
    comments: CommentsType
}

function Comments({comments} : commentProp){
    
    const CommentList = comments.comments.map((comment) =>{
        return (
            <li key={comment.Id} className="border 1">
                <div className="flex justify-between">
                    <div className="flex gap-5">
                        <p>Username</p>
                        <p>Teacher Name: {comment.teacherName}</p>
                        <p>Grade Obtained: {comment.gradeObtain}</p>
                    </div>
                    <p>{format(comment.commentDate,'dd/MM/yyyy')}</p>
                </div> 
                <p>Description: {comment.title}</p>
            </li>
        )
    })

    return (
        <ul className="flex flex-col gap-3">{CommentList}</ul>
    )
}

export {Comments as CommentComponent}