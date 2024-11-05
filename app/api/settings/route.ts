import { NextResponse, NextRequest } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// // Input validation schemas
const UpdateUserSchema = z.object({
  username: z.string().min(3).max(255).optional(),
  email: z.string().email().optional()
});

const UpdateThemeSchema = z.object({
  theme: z.enum(['light', 'dark'])
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});

const DeleteAccountSchema = z.object({
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { currentPassword, newPassword } = ChangePasswordSchema.parse(data);

    const userRecord = await prisma.user.findUnique({
      where: { userId: user.id }
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      userRecord.password
    );
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { userId: user.id },
      data: { password: hashedNewPassword }
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT function to update user data
export async function PUT(request: NextRequest) {
  // Authenticate user
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse and validate input data
    const data = await request.json();
    const validatedData = UpdateUserSchema.parse(data);

    // Update user data in the database
    await prisma.user.update({
      where: { userId: user.id },
      data: validatedData
    });

    // Return the updated data
    return NextResponse.json({
      message: 'Profile updated successfully',
      data: validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating user data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

//GET

export async function GET(request: NextRequest) {
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Fetching user data for userId:', user.id); // Log user ID

    const userData = await prisma.user.findUnique({
      where: { userId: user.id }
    });

    if (!userData) {
      console.warn('User not found in database for userId:', user.id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User data retrieved successfully',
      data: userData
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

//Patch
export async function PATCH(request: NextRequest) {
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const validatedData = UpdateThemeSchema.parse(data);

    await prisma.user.update({
      where: { userId: user.id },
      data: { theme: validatedData.theme }
    });

    return NextResponse.json({ message: 'Theme updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

//DELETE
export async function DELETE(request: NextRequest) {
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { password } = DeleteAccountSchema.parse(data);

    const userRecord = await prisma.user.findUnique({
      where: { userId: user.id }
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { userId: user.id } });

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
