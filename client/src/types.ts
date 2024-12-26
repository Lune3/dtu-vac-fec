interface CommentType {
    title: string;
    teacherName: string;
    gradeObtain: string;
    Id:string;
    commentDate:string;
    commentUser:string;
  }
   
export interface CommentsType {
    comments: CommentType[];
}

