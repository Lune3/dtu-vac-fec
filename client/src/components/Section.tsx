import { useEffect } from "react";
import { apiUrl } from "../config";

type sectionProps = {
    course: string,
    comments : object | null,
    setComments : React.Dispatch<React.SetStateAction<object[] | null>>,
}


const fetchComments = async (course : string,setComments : React.Dispatch<React.SetStateAction<object | null>>) =>{
    if(course != ""){
        const getComments = await fetch(`${apiUrl}/comment/${course}`,);
        const comments = await getComments.json();
        console.log(comments);
        setComments(comments);
    }
}

function DefaultCommentView(){
    return(
        <p>
            Search for a course to view it's reviews
        </p>
    )
}

function PostComment({course,comments,setComments} : sectionProps){
    const submitComment : React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const commentData = e.target as HTMLFormElement;
        console.log((commentData.elements[0] as HTMLInputElement).value,(commentData.elements[1] as HTMLInputElement).value)
        try {
            const comment = await fetch(`${apiUrl}/comment/${course}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({title:(commentData.elements[0] as HTMLInputElement).value,teacherName:(commentData.elements[1] as HTMLInputElement).value,grade:(commentData.elements[2] as HTMLInputElement).value})
            })
            setComments
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <form action="" onSubmit={submitComment}>
                <label>Description:
                    <input type="text" name="title" maxLength={200}/>
                </label>
                <label> Teacher Name:
                    <input type="text" name="teacherName" maxLength={50}/>
                </label>
                <label>Grade Obtained:
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
    )
}

function Comments({course,comments,setComments} : sectionProps){
    return (
        <>
            <h1>{course}</h1>
            <PostComment course={course} comments={{}} setComments={setComments}/>
        </> 
    )
}

function Section({course, comments , setComments} : sectionProps){

    useEffect(() => {
        fetchComments(course,setComments);
    },[course])

    return (
        <section>
            {course === "" ? <DefaultCommentView/> : <Comments course={course} comments={comments} setComments={setComments}/>}
        </section>
    )
}

export {Section}