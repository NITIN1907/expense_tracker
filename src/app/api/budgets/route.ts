import { connectToDatabase } from '@/lib/mongodb';
import Budget from '@/models/Budget';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const budgets = await Budget.find({ month: currentMonth, year: currentYear });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('GET /api/budgets error:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { category, amount, month, year } = await req.json();

 if (!category || amount === undefined || month === undefined || year === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await Budget.findOne({ category, month, year });

    if (existing) {
      existing.amount = amount;
      await existing.save();
      return NextResponse.json(existing);
    }

    const newBudget = await Budget.create({ category, amount, month, year });
    return NextResponse.json(newBudget);
  } catch (error) {
    console.error('POST /api/budgets error:', error);
    return NextResponse.json({ error: 'Failed to save budget' }, { status: 500 });
  }
}
