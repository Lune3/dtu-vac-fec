import { Header} from "./components/Header";
import { useState } from "react";
import { Section } from "./components/Section";

function App() {
  const [course,setCourse] = useState<string>("");
  const [comments,setComments] = useState<object[] | null>(null);
  return (
    <>
      <Header setCourse={setCourse}/>
      <Section course={course} comments={comments} setComments={setComments}/>
    </>
  )
}

export default App
