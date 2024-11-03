import { apiUrl } from "../config";
import { useEffect, useState } from "react";

type HeaderProps = {
    setCourse: React.Dispatch<React.SetStateAction<string>>,
    setComments: React.Dispatch<React.SetStateAction<object>>;
};


async function getComment(courseName: string) {
    const fetchComments = await fetch(`${apiUrl}/comment/${courseName}`, { mode: "cors" });
    const comments = await fetchComments.json();
    return comments;
}


function Header({ setComments, setCourse }: HeaderProps) {
    const [courseName, setCourseName] = useState<string>("");
    useEffect(() => {
        const courseSubmit = async () => {
            const url = `${apiUrl}/course/${courseName}`;
            const getCourse = await fetch(url, { mode: "cors" });
            if (getCourse.status === 200) {
                const course = await getCourse.json();
                setCourse(course.course.name);
                const comments = await getComment(course.name);
                setComments(comments);
            }
            else if (getCourse.status === 422) {
                console.log("wrong");
            }
            else {
                console.log("very wrong");
            }
        }
        courseSubmit();
        return () =>{
            setCourseName("");
        }
    }, [courseName]);

    const foo: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const courseData = e.target as HTMLFormElement;
        setCourseName((courseData.elements[0] as HTMLInputElement).value);
    }

    return (
        <header className="flex justify-between p-3 border-b border-black">
            <div>
                <h1>Dtu electives and fec</h1>
            </div>
            <form action="" method="GET" onSubmit={foo}>
                <input type="text" placeholder="Search for a course" maxLength={50} className="border border-black" name="courseName" />
                <button type="submit" style={{ display: "none" }}></button>
            </form>
            <div>
                <button>Log In</button>
                <picture>
                    change theme
                </picture>
            </div>
        </header>
    )
}

export { Header }