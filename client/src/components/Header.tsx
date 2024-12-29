import { apiUrl } from "../config";
import { useEffect, useState } from "react";

type HeaderProps = {
    setCourse: React.Dispatch<React.SetStateAction<string>>,
};


const fetchCourse = async (courseName: string, setCourse: React.Dispatch<React.SetStateAction<string>>) => {
    if(courseName != ""){
        const url = `${apiUrl}/course/${courseName}`;
        const getCourse = await fetch(url, { mode: "cors" });
        if (getCourse.status === 200) {
            const course = await getCourse.json();
            setCourse(course.course.name);
        }
        else if (getCourse.status === 422) {
            console.log("wrong");
        }
        else {
            console.log("very wrong");
        }
    }
}

function Header({setCourse}: HeaderProps) {
    const [courseName, setCourseName] = useState<string>("");
    useEffect(() => {
        fetchCourse(courseName,setCourse);
        return () =>{
            setCourseName("");
        }
    }, [courseName]);

    const submitCourse: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const courseData = e.target as HTMLFormElement;
        setCourseName((courseData.elements[0] as HTMLInputElement).value);
    }

    const logout = async function (event : React.MouseEvent<HTMLAnchorElement, MouseEvent>){
        event.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/auth/google/logout`, {
                method: 'POST',
                credentials:'include'
            });
            
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                console.log('Logout successful but no redirection');
            }
        } catch (err) {
            console.error('Error during logout:', err);
        }
    }

    return (
        <header className="flex justify-between p-3 border-b border-black">
            <div>
                <h1>Dtu electives and fec</h1>
            </div>
            <form action="" method="GET" onSubmit={submitCourse}>
                <input type="text" placeholder="Search for a course" maxLength={50} className="border border-black" name="courseName" />
                <button type="submit" style={{ display: "none" }}></button>
            </form>
            <div>
                <a href={`${apiUrl}/auth/google`}>Log In</a>
                <a href="#" onClick={(event) => {logout(event)}}>Logout</a>
                <picture>
                    change theme
                </picture>
            </div>
        </header>
    )
}

export { Header }