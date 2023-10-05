import React from 'react'
import {H4} from '../../../components'
import { ensureListing } from '../../../util/data';

import css from './Listing.module.css'


const ImageSlider = (props) => {
  const { urls } = props;
  return <div className={css.imageSlider}>
    {urls.map((url, i) => (
      <img src={url} alt={`listing-image ${i}`} key={i} />
    ))}
  </div>
}

export default function MeetAdvisor(props) {
  const { listing , intl} = props;

  const ensuredListing = ensureListing(listing);
  const images = ensuredListing.images || [];
  const listingCardVariantUrls = images.map(img => {
    const url = img.attributes.variants['listing-card'].url;
    return url;
  })

  const meetMeTitle = intl.formatMessage({ id: 'CustomListingPage.Listing.authorMeetMeTitle' });

  return (
    <div>
      <H4>{meetMeTitle}</H4>
      <ImageSlider urls={listingCardVariantUrls} />
    </div>
  )
}
