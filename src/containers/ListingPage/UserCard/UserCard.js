import React, { useState } from 'react';
import { bool, func, oneOfType, string } from 'prop-types';
import truncate from 'lodash/truncate';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';
import { ensureUser, ensureCurrentUser } from '../../../util/data';
import { propTypes } from '../../../util/types';

import { AvatarXLarge, NamedLink, InlineTextButton, ResponsiveImage, AspectRatioWrapper, PrimaryButton, SecondaryButton, Avatar, H4 } from '../../../components';


import css from './UserCard.module.css';

// Approximated collapsed size so that there are ~three lines of text
// in the desktop layout in the author section of the ListingPage.
const BIO_COLLAPSED_LENGTH = 170;

const truncated = s => {
  return truncate(s, {
    length: BIO_COLLAPSED_LENGTH,

    // Allow truncated text end only in specific characters. This will
    // make the truncated text shorter than the length if the original
    // text has to be shortened and the substring ends in a separator.
    //
    // This ensures that the final text doesn't get cut in the middle
    // of a word.
    separator: /\s|,|\.|:|;/,
    omission: '…',
  });
};

const ExpandableBio = props => {
  const [expand, setExpand] = useState(false);
  const { className, bio } = props;
  const truncatedBio = truncated(bio);

  const handleShowMoreClick = () => {
    setExpand(true);
  };
  const showMore = (
    <InlineTextButton rootClassName={css.showMore} onClick={handleShowMoreClick}>
      <FormattedMessage id="UserCard.showFullBioLink" />
    </InlineTextButton>
  );
  return (
    <p className={className}>
      {expand ? bio : truncatedBio}
      {bio !== truncatedBio && !expand ? showMore : null}
    </p>
  );
};

ExpandableBio.defaultProps = { className: null };

ExpandableBio.propTypes = {
  className: string,
  bio: string.isRequired,
};

const UserCard = props => {
  const { rootClassName, className, user, currentUser, onContactUser, showContact, onChooseReading } = props;

  const userIsCurrentUser = user && user.type === 'currentUser';
  const ensuredUser = userIsCurrentUser ? ensureCurrentUser(user) : ensureUser(user);

  const ensuredCurrentUser = ensureCurrentUser(currentUser);
  const isCurrentUser =
    ensuredUser.id && ensuredCurrentUser.id && ensuredUser.id.uuid === ensuredCurrentUser.id.uuid;
  const { displayName, bio } = ensuredUser.attributes.profile;

  const handleContactUserClick = () => {
    onContactUser(user);
  };

  const hasBio = !!bio;
  const classes = classNames(rootClassName || css.root, className);
  const linkClasses = classNames(css.links, {
    [css.withBioMissingAbove]: !hasBio,
  });

  // const separator =
  //   isCurrentUser || !showContact ? null : <span className={css.linkSeparator}>•</span>;

  const contact = showContact ? (
    <SecondaryButton
      onClick={handleContactUserClick}
      enforcePagePreloadFor="SignupPage"
      className={css.contactBtn}
    >
      <FormattedMessage id="UserCard.contactUser" />
    </SecondaryButton>
  ) : null;

  const editProfileMobile = (
    <span className={css.editProfileMobile}>
      <span className={css.linkSeparator}>•</span>
      <NamedLink name="ProfileSettingsPage">
        <FormattedMessage id="ListingPage.editProfileLink" />
      </NamedLink>
    </span>
  );

  const editProfileDesktop = isCurrentUser ? (
    <NamedLink className={css.editProfileDesktop} name="ProfileSettingsPage">
      <FormattedMessage id="ListingPage.editProfileLink" />
    </NamedLink>
  ) : null;

  // const links = ensuredUser.id ? (
  //   <p className={linkClasses}>
  //     <NamedLink className={css.link} name="ProfilePage" params={{ id: ensuredUser.id.uuid }}>
  //       <FormattedMessage id="UserCard.viewProfileLink" />
  //     </NamedLink>
  //     {separator}
  //     {isCurrentUser ? editProfileMobile : contact}
  //   </p>
  // ) : null;

  const links = ensuredUser.id ? (
    <div className={css.links}>
      {!isCurrentUser && <PrimaryButton onClick={onChooseReading}> <FormattedMessage id="CustomListingPage.Listing.ChooseReadingButtonText" /></PrimaryButton>}
      {isCurrentUser ? editProfileMobile : contact}
    </div>
  ) : null;



  return (
    <div className={classes}>
      <div className={css.content}>
        <AvatarXLarge className={css.avatar} user={user} />
        <div className={css.info}>
          <div className={css.headingRow}>
            <H4>{displayName}</H4>
            {editProfileDesktop}
          </div>
          {links}
          {hasBio ? <ExpandableBio className={css.desktopBio} bio={bio} /> : null}
        </div>
      </div>
      {hasBio ? <ExpandableBio className={css.mobileBio} bio={bio} /> : null}
    </div>
  );
};

UserCard.defaultProps = {
  rootClassName: null,
  className: null,
  user: null,
  currentUser: null,
  showContact: true,
};

UserCard.propTypes = {
  rootClassName: string,
  className: string,
  user: oneOfType([propTypes.user, propTypes.currentUser]),
  currentUser: propTypes.currentUser,
  onContactUser: func.isRequired,
  showContact: bool,
};

export default UserCard;
