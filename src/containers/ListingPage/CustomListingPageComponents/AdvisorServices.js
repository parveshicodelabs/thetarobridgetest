import React from 'react'
import { H4, PrimaryButton, H6 } from '../../../components'
import { ensureListing } from '../../../util/data';

import css from './Listing.module.css'

const ServiceCard = (props) => {
    const { service: { title, description, amount } } = props;

    return <div className={css.serviceCard}>
        <div>
            <H4>{title}-${amount}</H4>
            <p style={{ margin: 0 }}>{description}</p>
        </div>
        <div>
            <PrimaryButton className={css.orderBtn}>Order For ${amount}</PrimaryButton>
        </div>
    </div>
}




export default function AdvisorServices(props) {

    const { listing, intl } = props;

    const ensuredListing = ensureListing(listing);

    const services = ensuredListing.attributes.publicData.services;
    const prices = ensuredListing.attributes.publicData.prices;

    const servicesWithAmount = services.map(service => {
        const priceObject = prices.find(price => price.service === service.title);
        return {
            ...service,
            amount: priceObject ? priceObject.amount : 0, // Default to 0 if no price found
        };
    });
    
    const servicesTitle = intl.formatMessage({ id: 'CustomListingPage.Listing.authorServicesTitle' });

    return (
        <div>
            <H4>{servicesTitle}</H4>
            <div>
                {servicesWithAmount.map((s, i) => (
                    <ServiceCard service={s} key={i} />
                ))}
            </div>
        </div>
    )
}
