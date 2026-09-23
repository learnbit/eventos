-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'pending';
