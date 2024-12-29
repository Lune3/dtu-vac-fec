import { Header} from "./components/Header";
import { useState } from "react";
import { Section } from "./components/Section";
import { CommentsType } from "./types";


function App() {
  const [course,setCourse] = useState<string>("");
  const [comments,setComments] = useState<CommentsType>({comments:[]});
  const [isAuth,setIsAuth] = useState<boolean>(false);

  return (
    <>
      <Header setCourse={setCourse}/>
      <Section course={course} comments={comments} setComments={setComments}/>
    </>
  )
}

export default App
