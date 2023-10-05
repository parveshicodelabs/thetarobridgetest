import React from 'react'
import { H4, H6 } from '../../../components'
import { ensureCurrentUser, ensureListing, ensureUser } from '../../../util/data';
import css from './Listing.module.css'

const tempTagline = ` Helping You Find Clarity: Hi, I'm Mars! I'm driven by a genuine desire to assist others in navigating life's intricate labyrinths. Whether you're facing relationship dilemmas, career crossroads, or seeking a deeper understanding of your spiritual path, I am committed to providing you with the insight and wisdom needed to make informed decisions and find your true purpose. Love, Career, Relationship, Finance, Shadow Work, Family, Marriage, and More!`


export default function AdvisorInformation(props) {
    const { listing , intl} = props;

    const ensuredListing = ensureListing(listing)

    const user = ensuredListing.author;
    const userIsCurrentUser = user && user.type === 'currentUser';
    const ensuredUser = userIsCurrentUser ? ensureCurrentUser(user) : ensureUser(user);

    const taglines = ensuredUser.attributes.profile.publicData.taglines || tempTagline;
    const yearsOfExperience = ensuredUser.attributes.profile.publicData.yearsOfExperience || 0
    const specialities = ensuredListing.attributes.publicData.Categories || [];

    const specialitiesContent = <ul>
        {specialities.map((s, i) => (
            <li key={i}>{s}</li>
        ))}
    </ul>

    const experienceTitle = intl.formatMessage({ id: 'CustomListingPage.Listing.authorExperience' });
    const specialityTitle = intl.formatMessage({ id: 'CustomListingPage.Listing.authorSpeciality' });

    return (
        <div className={css.informationContainer}>
            <p>
                {taglines}
            </p>
            <div className={css.subInformationB}>
                <div>
                    <H4>{experienceTitle}</H4>
                    {yearsOfExperience}
                </div>
                <div>
                    <H4>{specialityTitle}</H4>
                    {specialitiesContent}
                </div>
            </div>
        </div>
    )
}
