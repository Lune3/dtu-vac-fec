import { useEffect } from "react";
import { apiUrl } from "../config";

interface Comment {
    title: string;
    teacherName: string;
    grade: string;
}

interface Comments {
    comments: Comment[];
}

type SectionProps = {
    course: string;
    comments: Comments | null;
    setComments: React.Dispatch<React.SetStateAction<Comments | null>>;
}

const fetchComments = async (course: string, setComments: React.Dispatch<React.SetStateAction<Comments | null>>) => {
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

        try {
            const response = await fetch(`${apiUrl}/comment/${course}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: (commentData.elements[0] as HTMLInputElement).value,
                    teacherName: (commentData.elements[1] as HTMLInputElement).value,
                    grade: (commentData.elements[2] as HTMLInputElement).value,
                })
            });
            const newComment: Comment = await response.json();
            const updatedComments = [...(comments?.comments || []), newComment];
            setComments({ comments: updatedComments });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <form onSubmit={submitComment}>
                <label>
                    Description:
                    <input type="text" name="title" maxLength={200} />
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