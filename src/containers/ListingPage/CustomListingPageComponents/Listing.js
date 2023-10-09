import React from 'react'
import ListingNavigation from './ListingNavigation'

import css from './Listing.module.css'
import { H1, H4, H6 } from '../../../components';
import { ensureCurrentUser, ensureListing, ensureUser } from '../../../util/data';
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
    const { intl, listing, currentUser, servicesWithAmount, onOrder} = props;


    const ensuredListing = ensureListing(listing);

    const user = ensuredListing.author;
    const userIsCurrentUser = user && user.type === 'currentUser';
    const ensuredUser = userIsCurrentUser ? ensureCurrentUser(user) : ensureUser(user);

    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const isCurrentUser =
        ensuredUser.id && ensuredCurrentUser.id && ensuredUser.id.uuid === ensuredCurrentUser.id.uuid;

    const { displayName } = ensuredUser.attributes.profile;

    const listingHeading = intl.formatMessage({ id: 'CustomListingPage.Listing.heading' });


    return (
        <div className={css.root}>
            {/* Header */}
            <div>
                <H6>{listingHeading}</H6>
                <H4>{displayName}</H4>
            </div>

            {/* Navigation */}
            <ListingNavigation tabs={tabs} />

            {/* Advisor Information Section */}
            <div id={ADVISORINFORMATIONTABID}>
                <AdvisorInformation listing={ensuredListing} intl={intl} />
            </div>

            {/* Advisor Services Section */}
            <div id={ADVISORSERVICESTABID}>
                <AdvisorServices services={servicesWithAmount} intl={intl} onOrder={onOrder}/>
            </div>

            {/* Meet Advisor Section */}
            <div id={MEETMETABID}>
                <MeetAdvisor listing={ensuredListing} intl={intl} />
            </div>
        </div>
    )
}
