-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "done" BOOLEAN NOT NULL DEFAULT false,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "checkListId" INTEGER NOT NULL,
    CONSTRAINT "Task_checkListId_fkey" FOREIGN KEY ("checkListId") REFERENCES "CheckList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
