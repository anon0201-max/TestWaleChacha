import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");
    const studentId = searchParams.get("studentId");

    if (!deviceId && !studentId) {
      return NextResponse.json(
        { success: false, message: "deviceId or studentId is required" },
        { status: 400 }
      );
    }

    let student;

    if (studentId) {
      student = await db.student.findUnique({ where: { id: studentId } });
    } else if (deviceId) {
      student = await db.student.findUnique({ where: { deviceId: deviceId! } });
    }

    if (!student) {
      const newStudent = await db.student.create({
        data: {
          name: "Guest User",
          deviceId: deviceId || undefined,
        },
      });
      return NextResponse.json({
        success: true,
        data: {
          ...newStudent,
          freeTestsRemaining: Math.max(0, 5 - newStudent.freeTestsUsed),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...student,
        freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
      },
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, deviceId, name, email, phone } = body;

    if (!studentId && !deviceId) {
      return NextResponse.json(
        { success: false, message: "studentId or deviceId is required" },
        { status: 400 }
      );
    }

    const whereClause = studentId ? { id: studentId } : { deviceId };

    const updateData: Record<string, string | undefined> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    const student = await db.student.update({
      where: whereClause,
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...student,
        freeTestsRemaining: Math.max(0, 5 - student.freeTestsUsed),
      },
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update student" },
      { status: 500 }
    );
  }
}
