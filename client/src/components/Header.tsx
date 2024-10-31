import { useState } from "react";
import { apiUrl } from "../config"

function Header(){
    const [courseName,setCourseName] = useState<String>("");
    const courseSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const url = `${apiUrl}/course/${courseName}`;
        const course = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type": "application/json"
            }
        })
        if(course.status === 200){
            
        }
    }

    return (
        <header className="flex justify-between p-3 border-b border-black">
            <div>
                <h1>Dtu electives and fec</h1>
            </div>
            <form action="" method="post" onSubmit={courseSubmit}>
                <label>
                    <input type="text" placeholder="Search for a course" maxLength={50} className="border border-black" name="courseName" onChange={(e) => setCourseName(e.target.value)}/>
                </label>
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

export {Header}