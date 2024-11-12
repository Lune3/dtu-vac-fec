import { Header} from "./components/Header";
import { useState } from "react";
import { Section } from "./components/Section";


interface Comment {
  title: string;
  teacherName: string;
  grade: string;
}

interface Comments {
  comments: Comment[];
}

function App() {
  const [course,setCourse] = useState<string>("");
  const [comments,setComments] = useState<Comments | null>({comments:[]});
  return (
    <>
      <Header setCourse={setCourse}/>
      <Section course={course} comments={comments} setComments={setComments}/>
    </>
  )
}

export default App
