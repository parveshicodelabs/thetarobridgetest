import React from 'react'
import { H4, PrimaryButton, H6 } from '../../../components'
import { ensureListing } from '../../../util/data';

import css from './Listing.module.css'

const ServiceCard = (props) => {
    const { service: { title, description, amount }, onOrder } = props;

    return <div className={css.serviceCard}>
        <div>
            <H4>{title}-${amount}</H4>
            <p style={{ margin: 0 }}>{description}</p>
        </div>
        <div>
            <PrimaryButton className={css.orderBtn} onClick={onOrder}>Order For ${amount}</PrimaryButton>
        </div>
    </div>
}




export default function AdvisorServices(props) {

    const { services, intl, onOrder } = props;

    const servicesTitle = intl.formatMessage({ id: 'CustomListingPage.Listing.authorServicesTitle' });

    return (
        <div>
            <H4>{servicesTitle}</H4>
            <div>
                {services.map((s, i) => (
                    <ServiceCard service={s} key={i} onOrder={onOrder}/>
                ))}
            </div>
        </div>
    )
}
