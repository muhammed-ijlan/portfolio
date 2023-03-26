import React from 'react'
import moment from 'moment'

function Footer() {
    return (
        <footer>
            <span> <span class="far fa-copyright"></span> {moment().format('YYYY')} All rights reserved.</span>
        </footer>
    )
}

export default Footer