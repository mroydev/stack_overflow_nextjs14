import Question from '@/components/forms/Question';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

const AskQuestion = async () => {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const mongoUser = await getUserById({ userId });

  if (!mongoUser) {
    return (
      <p className="text-2xl font-semibold text-slate-800">
        User not found or not authenticated properly.
      </p>
    );
  }

  return (
    <div>
      <Question mongoUserId={JSON.stringify(mongoUser._id)} />
    </div>
  );
};

export default AskQuestion;
