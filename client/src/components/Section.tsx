import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import { CommentComponent } from "./comments";
import { CommentsType } from "../types";

type SectionProps = {
    course: string;
    comments: CommentsType;
    setComments: React.Dispatch<React.SetStateAction<CommentsType>>;
}

type authProp = SectionProps & {setAuthMessage : React.Dispatch<React.SetStateAction<boolean>>}

const fetchComments = async (course: string, setComments: React.Dispatch<React.SetStateAction<CommentsType>>) => {
    if (course !== "") {
        const getComments = await fetch(`${apiUrl}/comment/${course}`);
        const commentsData = await getComments.json();
        setComments(commentsData);
    }
}

function DefaultCommentView() {
    return (
        <p>
            Search for a course to view its reviews
        </p>
    );
}

function PostComment({ course, comments, setComments, setAuthMessage }: authProp) {
    const submitComment: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const commentData = e.target as HTMLFormElement;

        try {
            const response = await fetch(`${apiUrl}/comment/${course}`, {
                method: "POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: (commentData.elements[0] as HTMLInputElement).value,
                    teacherName: (commentData.elements[1] as HTMLInputElement).value || "N/A",
                    grade: (commentData.elements[2] as HTMLInputElement).value || "N/A",
                })
            });
            if(response.status === 401){
                setAuthMessage(true);
            }
            else{
                let commentResponse = await response.json();
                const newComment = {
                    Id: commentResponse.newComment.Id, 
                    title: commentResponse.newComment.title,
                    teacherName: commentResponse.newComment.teacherName || "N/A",
                    gradeObtain: commentResponse.newComment.gradeObtain || "N/A",
                    commentDate: new Date().toISOString(),
                    commentUser:commentResponse.newComment.commentUser
                };
                const updatedComments = [...(comments?.comments || []),newComment];
                setComments({ comments: updatedComments });
            }
        }
        catch (error) {
            console.log(error);
        }
    }; 

    return (
        <>
            <form onSubmit={submitComment}>
                <label>
                    Description:
                    <input type="text" name="title" maxLength={200} required/>
                </label>
                <label>
                    Teacher Name:
                    <input type="text" name="teacherName" maxLength={50} />
                </label>
                <label>
                    Grade Obtained:
                    <select name="grade">
                        <option value="O">O</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="P">P</option>
                        <option value="F">F</option>
                    </select>
                </label>
                <button type="submit">Submit</button>
            </form>

            <ul>
                <li>Be respectful</li>
                <li>No profanity</li>
                <li>These comments will be actively moderated</li>
            </ul>
        </>
    );
}

function CommentsComponent({ course, comments, setComments, setAuthMessage }: authProp) {
    return (
        <>
            <h1>{course}</h1>
            <PostComment course={course} comments={comments} setComments={setComments} setAuthMessage={setAuthMessage}/>
            <CommentComponent comments={comments} setComments={setComments}/>
        </>
    );
}

function NotAuthorized ({setAuthMessage}: { setAuthMessage: React.Dispatch<React.SetStateAction<boolean>> }){
    useEffect(() => {
        const messageTime = setTimeout(() => {
            setAuthMessage(false);
        }, 1000);
        return ()=>{
            clearTimeout(messageTime);
        }
    })
    return <>
        <div>
            <p>Please login to continue</p>
        </div>
    </>
}

function Section({ course, comments, setComments}: SectionProps) {
    const [authMessage,setAuthMessage] = useState<boolean>(false);
    useEffect(() => {
        fetchComments(course, setComments);
    }, [course]);

    return (
        <section>
            {authMessage === true ? <NotAuthorized setAuthMessage = {setAuthMessage}/> : <div></div>}
            {course === "" ? <DefaultCommentView /> : <CommentsComponent course={course} comments={comments} setComments={setComments} setAuthMessage = {setAuthMessage} />}
        </section>
    );
}

export { Section };
