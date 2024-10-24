-- CreateTable
CREATE TABLE "User" (
    "Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Course" (
    "Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "Id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "commentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentCourse" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "gradeObtain" TEXT NOT NULL,
    "commentUser" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentCourse_fkey" FOREIGN KEY ("commentCourse") REFERENCES "Course"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentUser_fkey" FOREIGN KEY ("commentUser") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
