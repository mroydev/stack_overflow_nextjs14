import { getQuestionById } from '@/lib/actions/question.action';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import Metric from '@/components/shared/Metric';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import ParseHTML from '@/components/shared/ParseHTML';
import Answer from '@/components/forms/Answer';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import AllAnswers from '@/components/shared/AllAnswers';

const Page = async ({ params }: any) => {
  const { userId: clerkId } = auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">Votes</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(result.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.content} />

      <AllAnswers
        questionId={result._id}
        userId={JSON.stringify(mongoUser._id)}
        totalAnswers={result.answers.length}
      />

      <Answer
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default Page;