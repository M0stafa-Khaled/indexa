-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('BOOKMARK', 'FOLDER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkNode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "type" "NodeType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BookmarkNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "BookmarkNode_userId_parentId_idx" ON "BookmarkNode"("userId", "parentId");

-- CreateIndex
CREATE INDEX "BookmarkNode_userId_deletedAt_idx" ON "BookmarkNode"("userId", "deletedAt");

-- AddForeignKey
ALTER TABLE "BookmarkNode" ADD CONSTRAINT "BookmarkNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkNode" ADD CONSTRAINT "BookmarkNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BookmarkNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
