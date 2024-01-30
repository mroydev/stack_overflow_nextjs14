'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { formatAndDivideNumber } from '@/lib/utils';
import {
  downVoteQuestion,
  upVoteQuestion,
} from '@/lib/actions/question.action';
import { usePathname, useRouter } from 'next/navigation';
import { downVoteAnswer, upVoteAnswer } from '@/lib/actions/answer.action';
import { toggleSaveQuestion } from '@/lib/actions/user.action';
import { viewQuestion } from '@/lib/actions/interaction.action';
import { toast } from '../ui/use-toast';

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upVotes: number;
  hasUpVoted: boolean;
  downVotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upVotes,
  hasUpVoted,
  downVotes,
  hasDownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
    return toast({
      title: `Question ${
        !hasSaved ? 'Saved in' : 'Removed from'
      } your collection`,
      variant: !hasSaved ? 'default' : 'destructive',
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        title: 'Please login to vote',
        description: 'You must be logged in to vote on a question or answer',
      });
    }

    if (action === 'upVote') {
      if (type === 'Question') {
        await upVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      } else if (type === 'Answer') {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      }
      return toast({
        title: `UpVote ${!hasUpVoted ? 'Successful' : 'Removed'}`,
        variant: !hasUpVoted ? 'default' : 'destructive',
      });
    }

    if (action === 'downVote') {
      if (type === 'Question') {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      } else if (type === 'Answer') {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      }

      return toast({
        title: `DownVote ${!hasUpVoted ? 'Successful' : 'Removed'}`,
        variant: !hasUpVoted ? 'default' : 'destructive',
      });
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            width={18}
            height={18}
            alt="upVote"
            className="cursor-pointer"
            onClick={() => handleVote('upVote')}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upVotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            width={18}
            height={18}
            alt="downVote"
            className="cursor-pointer"
            onClick={() => handleVote('downVote')}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downVotes)}
            </p>
          </div>
        </div>
      </div>

      {type === 'Question' && (
        <Image
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
