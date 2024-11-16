import { useEffect } from "react";
import { apiUrl } from "../config";
import { CommentComponent } from "./comments";
import { CommentsType } from "../types";
import { v4 as uuidv4 } from 'uuid';

type SectionProps = {
    course: string;
    comments: CommentsType;
    setComments: React.Dispatch<React.SetStateAction<CommentsType>>;
}

const fetchComments = async (course: string, setComments: React.Dispatch<React.SetStateAction<CommentsType>>) => {
    if (course !== "") {
        const getComments = await fetch(`${apiUrl}/comment/${course}`);
        const commentsData = await getComments.json();
        console.log(commentsData);
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

function PostComment({ course, comments, setComments }: SectionProps) {
    const submitComment: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const commentData = e.target as HTMLFormElement;

        const newComment = {
            Id: uuidv4(), 
            title: (commentData.elements[0] as HTMLInputElement).value,
            teacherName: (commentData.elements[1] as HTMLInputElement).value || "N/A",
            gradeObtain: (commentData.elements[2] as HTMLInputElement).value || "N/A",
            commentDate: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${apiUrl}/comment/${course}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: (commentData.elements[0] as HTMLInputElement).value,
                    teacherName: (commentData.elements[1] as HTMLInputElement).value || "N/A",
                    grade: (commentData.elements[2] as HTMLInputElement).value || "N/A",
                })
            });
            const updatedComments = [...(comments?.comments || []),newComment];
            setComments({ comments: updatedComments });
            console.log(comments);
        } catch (error) {
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

function CommentsComponent({ course, comments, setComments }: SectionProps) {
    return (
        <>
            <h1>{course}</h1>
            <PostComment course={course} comments={comments} setComments={setComments} />
            <CommentComponent comments={comments}/>
        </>
    );
}

function Section({ course, comments, setComments }: SectionProps) {
    useEffect(() => {
        fetchComments(course, setComments);
    }, [course]);

    return (
        <section>
            {course === "" ? <DefaultCommentView /> : <CommentsComponent course={course} comments={comments} setComments={setComments} />}
        </section>
    );
}

export { Section };
