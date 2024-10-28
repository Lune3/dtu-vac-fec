-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_commentUser_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "commentUser" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentUser_fkey" FOREIGN KEY ("commentUser") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
