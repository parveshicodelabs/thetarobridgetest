import React from 'react'
import ListingNavigation from './ListingNavigation'

import css from './Listing.module.css'
import { H1, H4, H6 } from '../../../components';
import { ensureCurrentUser, ensureUser } from '../../../util/data';
import AdvisorInformation from './AdvisorInformation';
import AdvisorServices from './AdvisorServices';
import MeetAdvisor from './MeetAdvisor';

const ADVISORINFORMATIONTABID = 'advisorInformation';
const ADVISORSERVICESTABID = 'advisorServices';
const MEETMETABID = 'meetMe';
const REVIEWSTABID = 'reviews';
const REFUNDTABID = 'refunds';

const tabs = [
    { tab: 'Advisor Information', link: `#${ADVISORINFORMATIONTABID}` },
    { tab: 'Advisor Services', link: `#${ADVISORSERVICESTABID}` },
    { tab: 'Meet Me', link: `#${MEETMETABID}` },
    { tab: 'Reviews', link: `#${REVIEWSTABID}` },
    { tab: 'Refund', link: `#${REFUNDTABID}` },
]

export default function Listing(props) {
    const { intl, listing, currentUser } = props;

    const user = listing.author;
    const userIsCurrentUser = user && user.type === 'currentUser';
    const ensuredUser = userIsCurrentUser ? ensureCurrentUser(user) : ensureUser(user);

    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const isCurrentUser =
        ensuredUser.id && ensuredCurrentUser.id && ensuredUser.id.uuid === ensuredCurrentUser.id.uuid;

    const { displayName } = ensuredUser.attributes.profile;

    const listingHeading = intl.formatMessage({ id: 'CustomListingPage.Listing.heading' });

    return (
        <div className={css.root}>
            {/* Listing Header */}
            <div>
                <H6>{listingHeading}</H6>
                <H4>{displayName}</H4>
            </div>

            {/* Listing Navigation */}
            <ListingNavigation tabs={tabs} />

            {/* Listing Advisor Information Section */}
            <div id={ADVISORINFORMATIONTABID}>
                <AdvisorInformation listing={listing} intl={intl} />
            </div>

            {/* Listing Advisor Services Section */}
            <div id={ADVISORSERVICESTABID}>
                <AdvisorServices listing={listing} intl={intl} />
            </div>

            {/* Listing Meet Advisor Section */}
            <div id={MEETMETABID}>
                <MeetAdvisor listing={listing} intl={intl} />
            </div>
        </div>
    )
}
