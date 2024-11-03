import { useEffect } from "react";
import { apiUrl } from "../config";

type sectionProps = {
    course: string,
    comments : object | null,
    setComments : React.Dispatch<React.SetStateAction<object | null>>,
}

type commentProps = {
    course: string,
    comments : object | null,
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

function Comments({course, comments} : commentProps){
    return (
        <>
            <h1>{course}</h1>
        </> 
    )
}

function Section({course, comments , setComments} : sectionProps){

    useEffect(() => {
        fetchComments(course,setComments);
    },[course])

    return (
        <section>
            {course === "" ? <DefaultCommentView/> : <Comments course={course} comments={comments}/>}
        </section>
    )
}

export {Section}