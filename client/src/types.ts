interface CommentType {
    title: string;
    teacherName: string;
    gradeObtain: string;
    Id:string;
    commentDate:string
  }
   
export interface CommentsType {
    comments: CommentType[];
}

