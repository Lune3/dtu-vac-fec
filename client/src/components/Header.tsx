import { apiUrl } from "../config";

type HeaderProps = {
    courseName : string,
    setCourseName: React.Dispatch<React.SetStateAction<string>>,
    setComments : React.Dispatch<React.SetStateAction<object>>;
};


async function getComment(courseName : string){
    const fetchComments = await fetch(`${apiUrl}/comment/${courseName}`,{mode:"cors"});
    const comments = await fetchComments.json();
    return comments;
}   

function Header({courseName , setCourseName, setComments }: HeaderProps){
    const courseSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const url = `${apiUrl}/course/${courseName}`;
        console.log(courseName);
        const getCourse = await fetch(url,{mode:"cors"});
        if(getCourse.status === 200){
            const course = await getCourse.json(); 
            const comments = await getComment(course.name);
            setComments(comments);
        }
        else if(getCourse.status === 422){
            console.log("wrong");
        }
        else{
            console.log("very wrong");
        }
    }


    return (
        <header className="flex justify-between p-3 border-b border-black">
            <div>
                <h1>Dtu electives and fec</h1>
            </div>
            <form action="" method="GET" onSubmit={courseSubmit}>
                <input type="text" placeholder="Search for a course" maxLength={50} className="border border-black" name="courseName" onChange={(e) => setCourseName(e.target.value)}/>
                <button type="submit" style={{display:"none"}}></button>
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