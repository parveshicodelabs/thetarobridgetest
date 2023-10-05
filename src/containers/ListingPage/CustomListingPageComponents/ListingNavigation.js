import React from 'react'
import css from './Listing.module.css'

export default function ListingNavigation(props) {
    const {tabs} = props;
    return (
        <ul className={css.listingNavigation}>
            {tabs.map((t, i) => {
                const {tab, link} = t;
                return <li key={i}><a href={link}>{tab}</a></li>
            })}
        </ul>
    )
}
