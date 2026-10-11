-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('ORIGINAL_PRODUCTION', 'COMMERCIAL', 'COLLABORATION', 'INTERNAL_EXPERIMENT');

-- CreateEnum
CREATE TYPE "ProjectStage" AS ENUM ('IN_DEVELOPMENT', 'ACTIVE', 'COMPLETED', 'PAUSED');

-- CreateEnum
CREATE TYPE "PublicationKind" AS ENUM ('CHAPTER', 'PREVIEW', 'UPDATE');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'ANNOUNCED', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "clientName" TEXT,
ADD COLUMN     "contribution" TEXT,
ADD COLUMN     "format" TEXT,
ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "projectStage" "ProjectStage",
ADD COLUMN     "projectType" "ProjectType";

-- CreateTable
CREATE TABLE "ProjectCharacter" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "alias" TEXT,
    "shortDescription" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPublication" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "kind" "PublicationKind" NOT NULL,
    "number" INTEGER,
    "title" TEXT NOT NULL,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "publishedAt" TIMESTAMP(3),
    "officialUrl" TEXT,
    "thumbnailUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLink" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectCharacter_projectId_sortOrder_idx" ON "ProjectCharacter"("projectId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCharacter_projectId_slug_key" ON "ProjectCharacter"("projectId", "slug");

-- CreateIndex
CREATE INDEX "ProjectPublication_projectId_status_sortOrder_idx" ON "ProjectPublication"("projectId", "status", "sortOrder");

-- CreateIndex
CREATE INDEX "ProjectLink_projectId_isActive_sortOrder_idx" ON "ProjectLink"("projectId", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "Project_status_sortOrder_createdAt_idx" ON "Project"("status", "sortOrder", "createdAt");

-- CreateIndex
CREATE INDEX "Project_projectType_status_idx" ON "Project"("projectType", "status");

-- CreateIndex
CREATE INDEX "Service_isActive_sortOrder_idx" ON "Service"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "Product_status_sortOrder_idx" ON "Product"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "Contact_status_createdAt_idx" ON "Contact"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "ProjectCharacter" ADD CONSTRAINT "ProjectCharacter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPublication" ADD CONSTRAINT "ProjectPublication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLink" ADD CONSTRAINT "ProjectLink_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
