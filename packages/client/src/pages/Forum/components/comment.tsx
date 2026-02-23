import { useState } from 'react';
import ux from '../main.module.css';
import comUx from './Comment.module.css';

export interface CommentProps {
  commentText: string;
  avatar?: string;
  userLogin?: string;
  reactions?: string[];
}

const reactionChoices = ['❤️', '🔥', '😂', '😍', '🤡', '☠️', '👍', '👊'];

export const Comment = ({
  avatar = '/default-user-icon.svg',
  userLogin = 'Anonymous',
  commentText,
  reactions = [],
}: CommentProps) => {
  const [reactionsLocal, placeReaction] = useState(reactions);
  const [userReaction, updateUserReaction] = useState(reactionChoices[4]);
  const [areChoicesOpen, openChoices] = useState(false);

  function createChoiceUI(
    reactionsList: typeof reactionChoices,
    closeOnClick = false
  ) {
    return reactionsList.map((reaction: string) => (
      <span
        className={`
          ${comUx.reaction_box}
          ${
            closeOnClick
              ? ''
              : reaction === userReaction
              ? comUx.user_reaction
              : ''
          }
        `}
        onClick={() => {
          if (closeOnClick) {
            if (!reactionsLocal.includes(reaction)) {
              placeReaction([...reactionsLocal, reaction]);
            }
          }
          updateUserReaction(reaction);
        }}>
        {reaction}
      </span>
    ));
  }

  return (
    <div className={comUx.comments_wrapper}>
      <div className={`${comUx.comment} ${ux.flex_row}`}>
        <img src={avatar} alt="user avatar" />
        <div>
          <h3>{userLogin}</h3>
          <p>{commentText}</p>
        </div>
      </div>
      <div className={`${comUx.reactions_wrapper}`}>
        {reactionsLocal.length !== 0 ? (
          <>
            <div className={`${comUx.reactions}`}>
              {createChoiceUI(reactionsLocal)}
            </div>
            <div
              className={`${comUx.react} ${comUx.reaction_box}`}
              onClick={() => {
                openChoices(areChoicesOpen ? false : true);
              }}>
              {areChoicesOpen ? (
                <div className={`${comUx.reactions} ${comUx.choices}`}>
                  {createChoiceUI(reactionChoices, true)}
                </div>
              ) : (
                <></>
              )}
              <img src="/add-reaction.svg" alt="add reaction button" />
            </div>
          </>
        ) : (
          <div
            className={`${comUx.react} ${comUx.reaction_box}`}
            onClick={() => {
              openChoices(areChoicesOpen ? false : true);
            }}>
            {areChoicesOpen ? (
              <div className={`${comUx.choices}`}>
                {createChoiceUI(reactionChoices, true)}
              </div>
            ) : (
              <></>
            )}
            <img src="/add-reaction.svg" alt="add reaction button" />
          </div>
        )}
      </div>
    </div>
  );
};
