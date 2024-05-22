-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "projectID" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "approvedFunding" INTEGER NOT NULL,
    "approvedMmf" INTEGER NOT NULL,
    "outcomeMetric" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "ach6Mth" TEXT,
    "ach12Mth" TEXT,
    "ach18Mth" TEXT,
    "ach24Mth" TEXT,
    "ach30Mth" TEXT,
    "ach36Mth" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_projectID_key" ON "Post"("projectID");
