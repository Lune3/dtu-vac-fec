interface CommentType {
    title: string;
    teacherName: string;
    gradeObtain: string;
    Id:string;
    commentDate:string;
    userName:string;
  }
   
export interface CommentsType {
    comments: CommentType[];
}

