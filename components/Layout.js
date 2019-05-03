import React from 'react';
import {Container, Image} from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';



export default (props) => {
    return (
        <div>
            <Head>
                <link
                    rel="stylesheet"
                    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"

                />
            </Head>

            <Header/>
               {props.children}
                </div>

    );
}