type sectionProps = {
    course: string,
    comments : object | null
}

function DefaultCommentView(){
    return(
        <p>
            Search for a course to view it's reviews
        </p>
    )
}

function Comments({course, comments} : sectionProps){
    console.log(course);
    return (
        <>
            <h1>{course}</h1>
        </> 
    )
}

function Section({course, comments} : sectionProps){

    return (
        <section>
            {course === "" ? <DefaultCommentView/> : <Comments course={course} comments={comments}/>}
        </section>
    )
}

export {Section}