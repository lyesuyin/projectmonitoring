/*
  Warnings:

  - A unique constraint covering the columns `[projectID]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_projectID_key" ON "Post"("projectID");
