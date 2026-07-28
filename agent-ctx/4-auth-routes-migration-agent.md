# Task 4 - Auth Routes Migration Agent

## Task
Migrate 4 auth API routes from MongoDB/Mongoose to Prisma/SQLite

## Files Modified
1. src/app/api/auth/login/route.ts - POST login
2. src/app/api/auth/signup/route.ts - POST signup
3. src/app/api/auth/me/route.ts - GET student
4. src/app/api/auth/reset-password/route.ts - POST reset password

## Changes Made
- Removed all MongoDB imports (dbConnect, Student model)
- Added Prisma import: import { db } from @/lib/db
- Replaced Student.findOne().lean() with db.student.findUnique()
- Replaced Student.create() with db.student.create({ data: {...} })
- Replaced Student.findOneAndUpdate() with db.student.update()
- Removed .toObject() calls (not needed in Prisma)
- Password hashing (SHA256 + _quizmaster_salt) kept identical
- API response format preserved exactly
- Lint passes cleanly
