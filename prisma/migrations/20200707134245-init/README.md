# Migration `20200707134245-init`

This migration has been generated by b6332596 at 7/7/2020, 1:42:45 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP INDEX "public"."AdminComment_authorId"

DROP INDEX "public"."AdminPost_authorId"

ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT E'VIEWER';
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200707134025-init..20200707134245-init
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 model BookMark {
   authorId  String?
@@ -178,12 +178,15 @@
   banning            User[]        @relation("UserBan", references: [id])
   banners            User[]        @relation("UserBan", references: [id])
   following          User[]        @relation("UserFollows", references: [id])
   followers          User[]        @relation("UserFollows", references: [id])
-  adminPost          AdminPost?
-  adminComment       AdminComment?
+  adminPost          AdminPost[]
+  adminComment       AdminComment[]
 }
+
+
+
 model AdminPost {
   id            String     @id @default(cuid())
   text          String
   title         String
```


