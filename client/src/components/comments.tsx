import React, { useEffect, useState } from "react";
import { CommentsType } from "../types";
import {format} from "date-fns"
import { apiUrl } from "../config";
import Cookies from "js-cookie";

type commentProp = {
    comments: CommentsType,
    setComments: React.Dispatch<React.SetStateAction<CommentsType>>;
}

async function getUser(setUserId:React.Dispatch<React.SetStateAction<string>>){
    const sendUserRequest = await fetch(`${apiUrl}/user`,{
        method:'GET',
        credentials:'include', 
        headers:{
            "Content-Type": "application/json",
        }
    });
    const userDetail = await sendUserRequest.json();
    if(userDetail){ 
        setUserId(userDetail.user.userId);
    }
}

function Comments({comments,setComments} : commentProp){
    const [userId,setUserId] = useState<string>("");
    // useEffect(() => {
    //     getUser(setUserId);
    // },[])

    function deleteComment(commentId:string){
        fetch(`${apiUrl}/comment/${commentId}`,{
            method:"DELETE",
            credentials:"include",
        }).then(response => {
            if (response.ok) {
                const commentAfterDelete = comments.comments.filter((comment) => comment.Id !== commentId);
                
                setComments({ comments: commentAfterDelete });
            } else {
                console.error("Failed to delete the comment.");
            }
        }).catch(err => {
            console.error("Error deleting the comment:", err);
        });
}

    const CommentList = comments.comments.map((comment) =>{
    
        return (
            <li key={comment.Id} className="border 1">
                <div className="flex justify-between">
                    <div className="flex gap-5">
                        <p>Username:{comment.commentUser}</p>
                        <p>Teacher Name: {comment.teacherName}</p>
                        <p>Grade Obtained: {comment.gradeObtain}</p>
                    </div>
                    <div>
                        <p>{format(comment.commentDate,'dd/MM/yyyy')}</p>
                        {userId === comment.commentUser? <img onClick={() => {deleteComment(comment.Id)}} src="https://www.svgrepo.com/show/356373/trash-bin.svg" className="h-6 w-auto"/>: <></>}
                    </div>
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