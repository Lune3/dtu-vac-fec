-- CreateTable
CREATE TABLE "Course" (
    "Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "Id" TEXT NOT NULL,
    "courseComment" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "commentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teacherName" TEXT NOT NULL,
    "gradeObtain" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
