import { useState } from 'react';
import ux from '../main.module.css';
import comUx from './Comment.module.css';

export interface CommentProps {
  commentText: string;
  avatar?: string;
  userLogin?: string;
  reactions?: string[];
}

const fullReactionsList = ['❤️', '🔥', '😂', '😍', '🤡', '☠️', '👍', '👊'];
const maxShownReaction = 3;

function removeReaction(arr: typeof fullReactionsList, reaction: string) {
  return arr.filter(el => el !== reaction);
}

export const Comment = ({
  avatar = '/default-user-icon.svg',
  userLogin = 'Anonymous',
  commentText,
  reactions = fullReactionsList,
}: CommentProps) => {
  const [reactionsLocal, placeReaction] = useState(reactions);
  const [userReaction, updateUserReaction] = useState(fullReactionsList[4]);
  const [areChoicesOpen, openChoices] = useState(false);

  function createChoiceUI(
    reactionsList: typeof fullReactionsList,
    fullReactionsListEnabled = false
  ) {
    function createReactionsElements(reactionsList: typeof fullReactionsList) {
      return reactionsList.map((reaction: string) => (
        <span
          className={`${comUx.reaction_box} ${
            fullReactionsListEnabled
              ? ''
              : reaction === userReaction
              ? comUx.user_reaction
              : ''
          }`}
          onClick={() => {
            if (fullReactionsListEnabled && !reactionsList.includes(reaction)) {
              placeReaction([reaction, ...reactions]);
            }

            if (!fullReactionsListEnabled) {
              if (reaction === userReaction) {
                if (reactionsList.includes(reaction)) {
                  updateUserReaction(undefined as unknown as string);
                  return;
                }
                placeReaction(removeReaction(reactionsList, reaction));
                return;
              }
              placeReaction(current => [
                reaction,
                ...removeReaction(current, reaction),
              ]);
            }
            updateUserReaction(reaction);
          }}>
          {reaction}
        </span>
      ));
    }

    if (reactionsList.length > maxShownReaction && !fullReactionsListEnabled) {
      return (
        <>
          {createReactionsElements(
            reactionsList.filter((_, idx) => idx < maxShownReaction)
          )}
          <span className={comUx.reactions_overflow}>
            +{reactionsList.length - maxShownReaction}
          </span>
        </>
      );
    }
    return createReactionsElements(reactionsList);
  }

  return (
    <div
      className={comUx.comments_wrapper}
      onMouseLeave={() => openChoices(false)}>
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
                  {createChoiceUI(fullReactionsList, true)}
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
                {createChoiceUI(fullReactionsList, true)}
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
