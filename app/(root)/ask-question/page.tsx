import Question from '@/components/forms/Question';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react';

const AskQuestion = async () => {
  // const { userId } = auth();

  const userId = 'clerk123';
  if (!userId) redirect('/sign-in');

  const mongoUser = await getUserById({ userId });

  console.log(mongoUser);
  return (
    <div>
      <Question mongoUserId={JSON.stringify(mongoUser._id)} />
    </div>
  );
};

export default AskQuestion;
